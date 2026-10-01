<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { LucideIcon } from '@lucide/svelte';

	type Props = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
		/** The root element. Bindable. */
		ref?: HTMLSpanElement | null;
		variant?: 'primary' | 'secondary';
		/** Any Lucide icon (import from `svelte-ui/icons`). */
		icon?: LucideIcon;
		children: Snippet;
	};

	let {
		ref = $bindable(null),
		variant = 'secondary',
		icon: Icon,
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<span {...rest} bind:this={ref} class={['badge', `badge--${variant}`, className]}>
	{#if Icon}<Icon class="badge-icon" aria-hidden="true" />{/if}
	{@render children()}
</span>

<style>
	@layer svelte-ui {
		.badge {
			display: inline-flex;
			align-items: center;
			gap: 4px;
			width: fit-content;
			padding: 2px 8px;
			font-family: inherit;
			font-size: 12px;
			border-radius: 6px;
			user-select: none;
		}

		.badge--primary {
			background-color: var(--color-accent);
			color: var(--color-accent-foreground);
		}

		.badge--secondary {
			background-color: var(--color-surface);
			color: var(--color-text);
		}

		.badge :global(.badge-icon) {
			width: 12px;
			height: 12px;
			flex-shrink: 0;
		}

		@media (forced-colors: active) {
			.badge {
				border: 1px solid ButtonText;
			}

			.badge--primary {
				border-color: Highlight;
				border-width: 2px;
			}
		}
	}
</style>
