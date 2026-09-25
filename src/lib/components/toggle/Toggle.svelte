<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Button from '../button/Button.svelte';

	type Props = Omit<
		ComponentProps<typeof Button>,
		'href' | 'target' | 'rel' | 'type' | 'variant'
	> & {
		pressed?: boolean;
	};

	let { pressed = $bindable(false), class: className, onclick, ...rest }: Props = $props();
</script>

<Button
	{...rest}
	variant="secondary"
	aria-pressed={pressed}
	class={['toggle', className]}
	onclick={(event) => {
		pressed = !pressed;
		onclick?.(event);
	}}
/>

<style>
	:global(.button.toggle[aria-pressed='true']),
	:global(.button.toggle[aria-pressed='true']:hover:not(:disabled)) {
		background-color: var(--color-surface-active);
	}
</style>
