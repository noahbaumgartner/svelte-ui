<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { LucideIcon } from '@lucide/svelte';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> & {
		/** Any Lucide icon (import from `svelte-ui/icons`). */
		icon?: LucideIcon;
		title: string;
		description?: string;
		/** `outline` has a dashed border, for empty areas that can be filled. */
		variant?: 'secondary' | 'outline';
		/** Optional actions below the text, e.g. a Button that creates the first entry. */
		children?: Snippet;
	};

	let {
		icon: Icon,
		title,
		description,
		variant = 'secondary',
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<div {...rest} class={['empty-state', `empty-state--${variant}`, className]}>
	{#if Icon}<Icon class="empty-state-icon" aria-hidden="true" />{/if}
	<p class="empty-state-title">{title}</p>
	{#if description}<p class="empty-state-description">{description}</p>{/if}
	{#if children}<div class="empty-state-actions">{@render children()}</div>{/if}
</div>

<style>
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		box-sizing: border-box;
		padding: 32px 16px;
		font-size: 13px;
		line-height: 1.5;
		color: var(--color-text);
		text-align: center;
		border-radius: 14px;
	}

	.empty-state--secondary {
		background-color: var(--color-surface);
		border: 1px solid transparent;
	}

	.empty-state--outline {
		border: 1px dashed var(--color-border-strong);
	}

	.empty-state :global(.empty-state-icon) {
		width: 20px;
		height: 20px;
		margin-bottom: 4px;
		color: var(--color-text-muted);
	}

	p {
		max-width: 44ch;
		margin: 0;
	}

	.empty-state-title {
		font-weight: 500;
	}

	.empty-state-description {
		color: var(--color-text-muted);
	}

	.empty-state-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
		margin-top: 8px;
	}
</style>
