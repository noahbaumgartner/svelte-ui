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
	@layer svelte-ui {
		:global(.button.toggle[aria-pressed='true']),
		:global(.button.toggle[aria-pressed='true']:hover:not(:disabled)) {
			background-color: var(--color-surface-active);
		}

		@media (forced-colors: active) {
			:global(.button.toggle[aria-pressed='true']),
			:global(.button.toggle[aria-pressed='true']:hover:not(:disabled)) {
				background-color: Highlight;
				color: HighlightText;
			}

			:global(.button.toggle[aria-pressed='false']) {
				border: 1px solid ButtonText;
			}
		}
	}
</style>
