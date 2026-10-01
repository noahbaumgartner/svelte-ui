<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	type Props = Omit<HTMLLabelAttributes, 'children'> & {
		/** Set `for` to the control's id, or wrap the control. */
		children: Snippet;
		ref?: HTMLLabelElement | null;
	};

	let { class: className, children, ref = $bindable(null), ...rest }: Props = $props();
</script>

<label {...rest} bind:this={ref} class={['label', className]}>
	{@render children()}
</label>

<style>
	@layer svelte-ui {
		.label {
			display: flex;
			align-items: center;
			gap: 8px;
			width: fit-content;
			font-size: 13px;
			font-weight: 500;
			line-height: 1.4;
			color: var(--color-text);
			user-select: none;
		}

		/* Checkboxes and switches toggle on a label click, so show it */
		.label:has(:global(:is(.checkbox, .switch))),
		:global(:is(.checkbox, .switch)) + .label {
			cursor: pointer;
		}

		/* Dim with a disabled control, whether wrapped or placed right before the label */
		.label:has(:global(:disabled)),
		:global(:disabled) + .label,
		:global(:is(.checkbox, .switch):has(:disabled)) + .label {
			cursor: not-allowed;
			opacity: 0.5;
		}

		/* A wrapped control is already dimmed by the label */
		.label:has(:global(:disabled)) :global(:disabled) {
			opacity: 1;
		}

		@media (forced-colors: active) {
			.label:has(:global(:disabled)),
			:global(:disabled) + .label,
			:global(:is(.checkbox, .switch):has(:disabled)) + .label {
				color: GrayText;
				opacity: 1;
			}
		}

		@media (pointer: coarse) {
			.label:has(:global(:is(.checkbox, .switch, .radio))),
			:global(:is(.checkbox, .switch, .radio)) + .label {
				min-height: 44px;
			}
		}
	}
</style>
