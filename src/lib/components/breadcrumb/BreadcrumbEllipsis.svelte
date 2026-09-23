<script lang="ts">
	import type { Snippet } from 'svelte';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import Button from '../button/Button.svelte';
	import ContextMenu from '../context-menu/ContextMenu.svelte';
	import BreadcrumbSeparator from './BreadcrumbSeparator.svelte';

	type Props = {
		/** Accessible name of the menu trigger. */
		label?: string;
		/** `ContextMenuItem`s for the collapsed items. */
		children: Snippet;
	};

	let { label = 'More', children }: Props = $props();
</script>

<li class="breadcrumb-ellipsis">
	<ContextMenu>
		{#snippet trigger(props)}
			<Button {...props} variant="ghost" size="sm" icon={Ellipsis} {label} />
		{/snippet}
		{@render children()}
	</ContextMenu>
</li>
<BreadcrumbSeparator />

<style>
	.breadcrumb-ellipsis {
		display: inline-flex;
	}
</style>
