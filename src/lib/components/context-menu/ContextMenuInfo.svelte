<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { IconComponent } from '../../icon.js';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> & {
		/** The info row element. Bindable. */
		ref?: HTMLDivElement | null;
		/** Any icon component, e.g. from `@lucide/svelte`. */
		icon?: IconComponent;
		/** Second, smaller line below the main text, e.g. an email address. */
		description?: string;
		/** Replaces the icon with custom content, e.g. an `Avatar`. */
		leading?: Snippet;
		/** Shown at the end of the row, e.g. a value. */
		trailing?: Snippet;
		children: Snippet;
	};

	let {
		ref = $bindable(null),
		icon: Icon,
		description,
		leading,
		trailing,
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<div
	{...rest}
	bind:this={ref}
	role="presentation"
	class={['context-menu-info', { 'context-menu-info--leading': leading }, className]}
>
	{#if leading}
		{@render leading()}
	{:else if Icon}
		<Icon class="context-menu-info-icon" aria-hidden="true" />
	{/if}
	<span class="context-menu-info-text">
		<span class={['context-menu-info-label', { 'context-menu-info-label--title': description }]}>
			{@render children()}
		</span>
		{#if description}<span class="context-menu-info-description">{description}</span>{/if}
	</span>
	{@render trailing?.()}
</div>

<style>
	@layer svelte-ui {
		.context-menu-info {
			display: flex;
			align-items: center;
			gap: 10px;
			padding: 8px 10px;
			font-size: 13px;
			color: var(--color-text-muted);
			cursor: default;
		}

		.context-menu-info--leading {
			gap: 14px;
			padding: 10px;
		}

		.context-menu-info :global(.context-menu-info-icon) {
			width: 16px;
			height: 16px;
			flex-shrink: 0;
		}

		.context-menu-info-text {
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			min-width: 0;
		}

		.context-menu-info-label--title {
			font-weight: 500;
			color: var(--color-text);
		}

		.context-menu-info-description {
			font-size: 12px;
		}
	}
</style>
