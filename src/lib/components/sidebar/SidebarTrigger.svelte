<script lang="ts">
	import PanelLeft from '@lucide/svelte/icons/panel-left';
	import Button from '../button/Button.svelte';
	import { getSidebarContext } from './context.js';

	type Props = {
		/** Accessible name of the button. */
		label?: string;
	};

	let { label = 'Toggle sidebar' }: Props = $props();

	const sidebar = getSidebarContext();
</script>

<Button
	variant="ghost"
	size="sm"
	icon={PanelLeft}
	{label}
	aria-controls={sidebar.id}
	aria-expanded={sidebar.mobile ? sidebar.openMobile : sidebar.open}
	onclick={sidebar.toggle}
/>
