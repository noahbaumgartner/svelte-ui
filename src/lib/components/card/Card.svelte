<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** The root element. Bindable. */
		ref?: HTMLDivElement | null;
		variant?: 'outline' | 'secondary';
		/** CardHeader, CardContent and CardFooter; an `<img>` first renders edge to edge. */
		children: Snippet;
	};

	let {
		ref = $bindable(null),
		variant = 'outline',
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<div {...rest} bind:this={ref} class={['card', `card--${variant}`, className]}>
	{@render children()}
</div>

<style>
	@layer svelte-ui {
		.card {
			--card-spacing: 14px;
			display: flex;
			flex-direction: column;
			gap: var(--card-spacing);
			box-sizing: border-box;
			padding-block: var(--card-spacing);
			overflow: hidden;
			font-size: 13px;
			color: var(--color-text);
			border-radius: 14px;
		}

		.card--outline {
			background-color: var(--color-bg);
			border: 1px solid var(--color-border);
		}

		.card--secondary {
			background-color: var(--color-surface);
			border: 1px solid transparent;
		}

		.card:has(> :global(img:first-child)) {
			padding-top: 0;
		}

		.card:has(> :global(.card-footer)) {
			padding-bottom: 0;
		}

		@media (forced-colors: active) {
			.card--secondary {
				border-color: CanvasText;
			}
		}

		.card > :global(img) {
			display: block;
			width: 100%;
			object-fit: cover;
		}
	}
</style>
