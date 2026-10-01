<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> & {
		/** Message in the panel, rendered as an `<h2>`; `\n` breaks the line. */
		title?: string;
		/** Owner shown below the panel as "© <current year> <copyright>". */
		copyright?: string;
		/** FooterColumns. */
		children?: Snippet;
		ref?: HTMLElement | null;
	};

	let {
		title,
		copyright,
		class: className,
		children,
		ref = $bindable(null),
		...rest
	}: Props = $props();

	const year = new Date().getFullYear();
</script>

<footer {...rest} bind:this={ref} class={['footer', className]}>
	<div class="footer-panel">
		{#if title}
			<h2 class="footer-title">{title}</h2>
		{/if}
		{#if children}
			<div class="footer-columns">{@render children()}</div>
		{/if}
	</div>
	{#if copyright}
		<p class="footer-copyright">© {year} {copyright}</p>
	{/if}
</footer>

<style>
	@layer svelte-ui {
		.footer {
			display: flex;
			flex-direction: column;
			gap: 20px;
			font-size: 14px;
		}

		.footer-panel {
			display: flex;
			flex-direction: column;
			gap: 40px;
			box-sizing: border-box;
			min-height: 256px;
			padding: 40px;
			color: #fff;
			background-color: #000;
			border-radius: 14px;
		}

		.footer-title {
			margin: 0;
			font-size: 24px;
			font-weight: 600;
			line-height: 1.25;
			white-space: pre-line;
			user-select: none;
		}

		.footer-columns {
			display: flex;
			flex-direction: column;
			gap: 40px;
		}

		.footer-copyright {
			margin: 0;
			text-align: center;
			color: var(--color-text-muted);
			user-select: none;
		}

		@media (min-width: 640px) {
			.footer-panel {
				flex-direction: row;
			}

			.footer-title {
				flex: 1;
			}

			.footer-columns {
				flex: 1;
				flex-direction: row;
			}
		}

		@media (forced-colors: active) {
			.footer-panel {
				border: 1px solid CanvasText;
			}
		}
	}
</style>
