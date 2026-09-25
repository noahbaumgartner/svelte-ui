<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = Omit<HTMLInputAttributes, 'type' | 'role'>;

	let { checked = $bindable(false), class: className, ...rest }: Props = $props();
</script>

<span class={['switch', className]}>
	<input {...rest} type="checkbox" role="switch" bind:checked />
	<span class="switch-thumb" aria-hidden="true"></span>
</span>

<style>
	.switch {
		position: relative;
		display: inline-flex;
		flex-shrink: 0;
		width: 36px;
		height: 22px;
	}

	input {
		appearance: none;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		margin: 0;
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 9px;
		outline: none;
		cursor: pointer;
		transition:
			background-color 200ms ease,
			border-color 200ms ease;
	}

	input:checked {
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

	/* Radius is the track's 9px minus the 4px inset, so the corners stay concentric */
	.switch-thumb {
		position: absolute;
		top: 4px;
		left: 4px;
		width: 14px;
		height: 14px;
		background-color: var(--color-base);
		border-radius: 5px;
		pointer-events: none;
		transition: transform 200ms ease;
	}

	input:checked + .switch-thumb {
		transform: translateX(14px);
	}

	input:disabled + .switch-thumb {
		opacity: 0.5;
	}

	@media (prefers-reduced-motion: reduce) {
		input,
		.switch-thumb {
			transition: none;
		}
	}
</style>
