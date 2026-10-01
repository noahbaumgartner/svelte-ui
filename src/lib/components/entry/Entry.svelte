<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> & {
		/** Rendered as an `<h3>`. */
		title: string;
		/** Muted text next to the title, e.g. a period like "2021 - 2025". */
		meta?: string;
		/** The description. */
		children?: Snippet;
		/** Below the description, e.g. a Link. */
		footer?: Snippet;
		ref?: HTMLDivElement | null;
	};

	let {
		title,
		meta,
		class: className,
		children,
		footer,
		ref = $bindable(null),
		...rest
	}: Props = $props();
</script>

<div {...rest} bind:this={ref} class={['entry', className]}>
	<div class="entry-heading">
		<h3 class="entry-title">{title}</h3>
		{#if meta}
			<span class="entry-meta">{meta}</span>
		{/if}
	</div>
	{#if children}
		<p class="entry-description">{@render children()}</p>
	{/if}
	{#if footer}
		<div class="entry-footer">{@render footer()}</div>
	{/if}
</div>

<style>
	@layer svelte-ui {
		.entry {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 10px;
			box-sizing: border-box;
			padding: 24px;
			color: var(--color-text);
			border: 1px solid var(--color-border-strong);
			border-radius: 14px;
		}

		.entry-heading {
			display: flex;
			flex-wrap: wrap;
			align-items: baseline;
			column-gap: 8px;
		}

		.entry-title {
			margin: 0;
			font-size: 20px;
			font-weight: 500;
		}

		.entry-meta {
			font-size: 14px;
			color: var(--color-text-muted);
			white-space: nowrap;
		}

		.entry-description {
			margin: 0;
			max-width: 640px;
		}

		.entry-footer {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			gap: 8px;
		}

		@media (min-width: 768px) {
			.entry {
				padding: 32px;
			}
		}
	}
</style>
