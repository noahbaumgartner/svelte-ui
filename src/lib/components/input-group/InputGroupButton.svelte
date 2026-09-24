<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Button from '../button/Button.svelte';

	type Props = Omit<ComponentProps<typeof Button>, 'size'>;

	let { variant = 'ghost', class: className, ...rest }: Props = $props();
</script>

<Button {...rest} {variant} size="sm" class={['input-group-button', className]} />

<style>
	:global(.button.input-group-button) {
		height: 24px;
		border-radius: 6px;
	}

	:global(.button.input-group-button.button--icon-only) {
		width: 24px;
	}
</style>
