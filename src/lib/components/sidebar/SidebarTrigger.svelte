<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import PanelLeft from '@lucide/svelte/icons/panel-left';
	import Button from '../button/Button.svelte';
	import { getSidebarContext } from './context.js';

	type Props = Omit<ComponentProps<typeof Button>, 'href' | 'target' | 'rel' | 'type'> & {
		/** Accessible name of the button. */
		label?: string;
	};

	let { label = 'Toggle sidebar', icon = PanelLeft, onclick, ...rest }: Props = $props();

	const sidebar = getSidebarContext();
</script>

<Button
	variant="ghost"
	size="sm"
	{icon}
	{label}
	{...rest}
	aria-controls={sidebar.id}
	aria-expanded={sidebar.mobile ? sidebar.openMobile : sidebar.open}
	onclick={(event) => {
		sidebar.toggle();
		onclick?.(event);
	}}
/>
