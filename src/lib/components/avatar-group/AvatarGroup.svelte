<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** The root element. Bindable. */
		ref?: HTMLDivElement | null;
		/** Accessible name for the group, e.g. "Members". */
		label?: string;
		/** How many more there are than the Avatars shown; rendered as "+3" at the end. */
		more?: number;
		/** Size of the "+3"; match it to the Avatars' `size`. */
		size?: 'sm' | 'md' | 'lg';
		/** Replaces the "+3" content, given the `more` count. */
		overflow?: Snippet<[count: number]>;
		/** Avatars, overlapping each other. */
		children: Snippet;
	};

	let {
		ref = $bindable(null),
		label,
		more = 0,
		size = 'md',
		overflow,
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<div {...rest} bind:this={ref} role="group" aria-label={label} class={['avatar-group', className]}>
	{@render children()}
	{#if more > 0}
		<span class={['avatar-group-more', `avatar-group-more--${size}`]}>
			{#if overflow}{@render overflow(more)}{:else}+{more}{/if}
		</span>
	{/if}
</div>

<style>
	@layer svelte-ui {
		.avatar-group {
			display: inline-flex;
			align-items: center;
		}

		/* The ring in the page colour separates the overlapping avatars */
		.avatar-group > :global(*) {
			box-shadow: 0 0 0 2px var(--color-bg);
		}

		.avatar-group > :global(:not(:first-child)) {
			margin-inline-start: -6px;
		}

		.avatar-group-more {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
			flex-shrink: 0;
			padding: 0 6px;
			font-weight: 500;
			font-variant-numeric: tabular-nums;
			color: var(--color-text-secondary);
			background-color: var(--color-surface);
			user-select: none;
		}

		/* Same sizes and corners as Avatar */
		.avatar-group-more--sm {
			min-width: 24px;
			height: 24px;
			border-radius: 8px;
			font-size: 10px;
		}

		.avatar-group-more--md {
			min-width: 32px;
			height: 32px;
			border-radius: 10px;
			font-size: 12px;
		}

		.avatar-group-more--lg {
			min-width: 40px;
			height: 40px;
			border-radius: 12px;
			font-size: 14px;
		}

		@media (forced-colors: active) {
			.avatar-group > :global(*) {
				outline: 2px solid Canvas;
			}

			.avatar-group-more {
				border: 1px solid CanvasText;
			}
		}
	}
</style>
