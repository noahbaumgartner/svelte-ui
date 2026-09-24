<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** Heading of the group. Hidden while the sidebar is collapsed to icons. */
		label?: string;
		/** Usually a `SidebarMenu`. */
		children: Snippet;
	};

	let { label, class: className, children, ...rest }: Props = $props();

	const id = $props.id();
</script>

<div
	{...rest}
	role="group"
	aria-labelledby={label ? `${id}-label` : undefined}
	class={['sidebar-group', className]}
>
	{#if label}<div id="{id}-label" class="sidebar-group-label">{label}</div>{/if}
	{@render children()}
</div>

<style>
	.sidebar-group {
		display: flex;
		flex-direction: column;
		min-width: 0;
		padding: 8px;
	}

	.sidebar-group-label {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		height: 32px;
		padding: 0 8px;
		overflow: hidden;
		font-size: 12px;
		font-weight: 500;
		color: var(--color-text-muted);
		white-space: nowrap;
		transition:
			margin-top 200ms ease,
			opacity 200ms ease;
	}

	:global(.sidebar--collapsed-icon) .sidebar-group-label {
		margin-top: -32px;
		opacity: 0;
	}
</style>
