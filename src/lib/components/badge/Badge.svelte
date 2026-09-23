<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { LucideIcon } from '@lucide/svelte';

	type Props = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
		variant?: 'primary' | 'secondary';
		/** Any Lucide icon (import from `svelte-ui/icons`). */
		icon?: LucideIcon;
		children: Snippet;
	};

	let { variant = 'secondary', icon: Icon, class: className, children, ...rest }: Props = $props();
</script>

<span {...rest} class={['badge', `badge--${variant}`, className]}>
	{#if Icon}<Icon class="badge-icon" aria-hidden="true" />{/if}
	{@render children()}
</span>

<style>
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
		background-color: var(--color-ink);
		color: var(--color-base);
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
</style>
