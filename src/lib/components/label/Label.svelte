<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	type Props = Omit<HTMLLabelAttributes, 'children'> & {
		/** Set `for` to the control's id, or wrap the control. */
		children: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<label {...rest} class={['label', className]}>
	{@render children()}
</label>

<style>
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

	/* Checkboxes toggle on a label click, so show it */
	.label:has(:global(.checkbox)),
	:global(.checkbox) + .label {
		cursor: pointer;
	}

	/* Dim with a disabled control, whether wrapped or placed right before the label */
	.label:has(:global(:disabled)),
	:global(:disabled) + .label,
	:global(.checkbox:has(:disabled)) + .label {
		cursor: not-allowed;
		opacity: 0.5;
	}

	/* A wrapped control is already dimmed by the label */
	.label:has(:global(:disabled)) :global(:disabled) {
		opacity: 1;
	}
</style>
