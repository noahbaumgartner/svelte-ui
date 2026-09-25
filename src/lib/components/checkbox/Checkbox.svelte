<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Check, Minus } from '@lucide/svelte';

	type Props = Omit<HTMLInputAttributes, 'type'>;

	let {
		checked = $bindable(false),
		indeterminate = $bindable(false),
		class: className,
		...rest
	}: Props = $props();
</script>

<span class={['checkbox', className]}>
	<input {...rest} type="checkbox" bind:checked bind:indeterminate />
	{#if indeterminate}
		<Minus class="checkbox-icon" aria-hidden="true" />
	{:else}
		<Check class="checkbox-icon" aria-hidden="true" />
	{/if}
</span>

<style>
	.checkbox {
		position: relative;
		display: inline-flex;
		flex-shrink: 0;
		width: 16px;
		height: 16px;
	}

	input {
		appearance: none;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		margin: 0;
		background-color: transparent;
		border: 1px solid var(--color-border-strong);
		border-radius: 5px;
		outline: none;
		cursor: pointer;
		transition:
			background-color 200ms ease,
			border-color 200ms ease;
	}

	input:checked,
	input:indeterminate {
		background-color: var(--color-ink);
		border-color: var(--color-ink);
	}

	input:focus-visible {
		outline: 2px solid var(--color-ink);
		outline-offset: 2px;
	}

	input[aria-invalid='true'] {
		border-color: var(--color-destructive);
	}

	input:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.checkbox :global(.checkbox-icon) {
		position: absolute;
		inset: 2px;
		width: 12px;
		height: 12px;
		color: var(--color-base);
		stroke-width: 3;
		pointer-events: none;
		opacity: 0;
	}

	input:checked + :global(.checkbox-icon),
	input:indeterminate + :global(.checkbox-icon) {
		opacity: 1;
	}

	input:disabled + :global(.checkbox-icon) {
		opacity: 0;
	}

	input:checked:disabled + :global(.checkbox-icon),
	input:indeterminate:disabled + :global(.checkbox-icon) {
		opacity: 0.5;
	}
</style>
