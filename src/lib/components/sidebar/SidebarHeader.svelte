<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import X from '@lucide/svelte/icons/x';
	import Button from '../button/Button.svelte';
	import { getSidebarContext } from './context.js';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		children: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();

	const sidebar = getSidebarContext();
</script>

<div {...rest} class={['sidebar-header', className]}>
	<div class="sidebar-header-content">
		{@render children()}
	</div>
	{#if sidebar.mobile}
		<Button
			variant="ghost"
			size="sm"
			icon={X}
			label="Close sidebar"
			onclick={sidebar.closeMobile}
		/>
	{/if}
</div>

<style>
	.sidebar-header {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px;
	}

	.sidebar-header-content {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}
</style>
