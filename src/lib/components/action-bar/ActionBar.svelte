<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** The root element. Bindable. */
		ref?: HTMLDivElement | null;
		/** Takes the free width on the left, e.g. a total or a select. */
		summary?: Snippet;
		/** The actions on the right, usually buttons. */
		children?: Snippet;
	};

	let { ref = $bindable(null), summary, children, class: className, ...rest }: Props = $props();
</script>

<div {...rest} bind:this={ref} class={['action-bar', className]}>
	<div class="action-bar-inner">
		<div class="action-bar-summary">{@render summary?.()}</div>
		{#if children}<div class="action-bar-actions">{@render children()}</div>{/if}
	</div>
</div>

<style>
	@layer svelte-ui {
		/*
		 * Sticks to the bottom of the screen, where the thumbs are on a phone.
		 *
		 * --gutter           side padding, 16px by default (set by base.css)
		 * --section-max-width  width of the content, 1280px by default
		 */
		.action-bar {
			position: fixed;
			inset: auto 0 0;
			z-index: 20;
			padding: 12px var(--gutter, 16px) calc(12px + env(safe-area-inset-bottom));
			border-top: 1px solid var(--color-border);
			background-color: color-mix(in srgb, var(--color-bg) 92%, transparent);
			backdrop-filter: blur(12px);
			color: var(--color-text);
		}

		.action-bar-inner {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			max-width: var(--section-max-width, 1280px);
			margin: 0 auto;
		}

		.action-bar-summary {
			flex: 1;
			min-width: 0;
			font-variant-numeric: tabular-nums;
		}

		.action-bar-actions {
			display: flex;
			flex-shrink: 0;
			gap: 8px;
		}
	}
</style>
