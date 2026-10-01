<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLiAttributes } from 'svelte/elements';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import Button from '../button/Button.svelte';
	import ContextMenu from '../context-menu/ContextMenu.svelte';
	import BreadcrumbSeparator from './BreadcrumbSeparator.svelte';

	type Props = Omit<HTMLLiAttributes, 'children'> & {
		/** The li element. Bindable. */
		ref?: HTMLLIElement | null;
		/** Accessible name of the menu trigger. */
		label?: string;
		/** `ContextMenuItem`s for the collapsed items. */
		children: Snippet;
	};

	let {
		ref = $bindable(null),
		label = 'More',
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<li {...rest} bind:this={ref} class={['breadcrumb-ellipsis', className]}>
	<ContextMenu>
		{#snippet trigger(props)}
			<Button {...props} variant="ghost" size="sm" icon={Ellipsis} {label} />
		{/snippet}
		{@render children()}
	</ContextMenu>
</li>
<BreadcrumbSeparator />

<style>
	@layer svelte-ui {
		.breadcrumb-ellipsis {
			display: inline-flex;
		}
	}
</style>
