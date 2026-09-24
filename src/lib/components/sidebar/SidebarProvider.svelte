<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { setSidebarContext } from './context.js';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** Whether the sidebar is expanded on desktop. Bindable. */
		open?: boolean;
		/** A `Sidebar` and a `SidebarInset`. Size them with the `--sidebar-width`, `--sidebar-width-icon` and `--sidebar-height` custom properties. */
		children: Snippet;
	};

	let { open = $bindable(true), class: className, children, ...rest }: Props = $props();

	const id = $props.id();
	let mobile = $state(false);
	let openMobile = $state(false);

	setSidebarContext({
		id: `${id}-sidebar`,
		get open() {
			return open;
		},
		get mobile() {
			return mobile;
		},
		get openMobile() {
			return openMobile;
		},
		toggle: () => {
			if (mobile) openMobile = !openMobile;
			else open = !open;
		},
		closeMobile: () => (openMobile = false)
	});

	$effect(() => {
		const query = window.matchMedia('(max-width: 767px)');
		const update = () => {
			mobile = query.matches;
			openMobile = false;
		};
		update();
		query.addEventListener('change', update);
		return () => query.removeEventListener('change', update);
	});
</script>

<div {...rest} class={['sidebar-provider', className]}>
	{@render children()}
</div>

<style>
	.sidebar-provider {
		--sidebar-width: 256px;
		--sidebar-width-icon: 48px;
		--sidebar-height: 100svh;
		display: flex;
		width: 100%;
		min-height: var(--sidebar-height);
	}
</style>
