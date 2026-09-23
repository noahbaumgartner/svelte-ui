<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LucideIcon } from '@lucide/svelte';
	import Check from '@lucide/svelte/icons/check';
	import { getMenuContext } from './context.js';

	type Props = {
		/** Any Lucide icon (import from `svelte-ui/icons`). */
		icon?: LucideIcon;
		/** Makes the item a radio option; `true` marks it as the current choice. */
		selected?: boolean;
		disabled?: boolean;
		onclick?: () => void;
		children: Snippet;
	};

	let { icon: Icon, selected, disabled = false, onclick, children }: Props = $props();

	const menu = getMenuContext();

	function handleClick() {
		onclick?.();
		menu.close();
	}
</script>

<button
	type="button"
	tabindex="-1"
	role={selected === undefined ? 'menuitem' : 'menuitemradio'}
	aria-checked={selected}
	{disabled}
	class={['context-menu-item', { 'context-menu-item--selected': selected }]}
	onclick={handleClick}
>
	{#if Icon}<Icon class="context-menu-item-icon" aria-hidden="true" />{/if}
	<span class="context-menu-item-label">{@render children()}</span>
	{#if selected !== undefined}
		<span class="context-menu-item-check">
			{#if selected}<Check aria-hidden="true" />{/if}
		</span>
	{/if}
</button>

<style>
	.context-menu-item {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 8px 10px;
		background-color: transparent;
		border: none;
		border-radius: 6px;
		font: inherit;
		font-size: 13px;
		color: var(--color-text);
		text-align: left;
		outline: none;
		cursor: pointer;
		transition: background-color 150ms ease;
	}

	.context-menu-item:hover:not(:disabled),
	.context-menu-item:focus-visible {
		background-color: var(--color-surface);
	}

	.context-menu-item:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.context-menu-item--selected {
		background-color: var(--color-surface);
		font-weight: 600;
	}

	.context-menu-item--selected:hover,
	.context-menu-item--selected:focus-visible {
		background-color: var(--color-surface-hover);
	}

	.context-menu-item :global(.context-menu-item-icon) {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}

	.context-menu-item-label {
		flex-grow: 1;
	}

	.context-menu-item-check {
		display: flex;
		width: 14px;
		height: 14px;
		flex-shrink: 0;
	}

	.context-menu-item-check :global(svg) {
		width: 14px;
		height: 14px;
	}
</style>
