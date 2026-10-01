<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import X from '@lucide/svelte/icons/x';
	import Button from '../button/Button.svelte';
	import { getSidebarContext } from './context.js';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		children: Snippet;
		ref?: HTMLDivElement | null;
		/** Accessible name of the close button shown on mobile. */
		labels?: { close?: string };
	};

	let { ref = $bindable(null), labels, class: className, children, ...rest }: Props = $props();

	const sidebar = getSidebarContext();
</script>

<div {...rest} bind:this={ref} class={['sidebar-header', className]}>
	<div class="sidebar-header-content">
		{@render children()}
	</div>
	{#if sidebar.mobile}
		<Button
			variant="ghost"
			size="sm"
			icon={X}
			label={labels?.close ?? 'Close sidebar'}
			onclick={sidebar.closeMobile}
		/>
	{/if}
</div>

<style>
	@layer svelte-ui {
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
	}
</style>
