<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** `responsive` is vertical and switches to horizontal when the surrounding FieldGroup is wider than 448px. */
		orientation?: 'vertical' | 'horizontal' | 'responsive';
		/** A Label, the control, and optionally FieldDescription and FieldError. Horizontal fields wrap label and description in a FieldContent. */
		children: Snippet;
	};

	let { orientation = 'vertical', class: className, children, ...rest }: Props = $props();
</script>

<div {...rest} role="group" class={['field', `field--${orientation}`, className]}>
	{@render children()}
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
		font-size: 13px;
		color: var(--color-text);
	}

	.field--horizontal {
		flex-direction: row;
		align-items: center;
	}

	.field--horizontal > :global(.label) {
		flex: auto;
	}

	.field--horizontal:has(> :global(.field-content)) {
		align-items: flex-start;
	}

	.field--horizontal:has(> :global(.field-content)) > :global(:is(.checkbox, .radio)) {
		margin-top: 2px;
	}

	@container field-group (min-width: 448px) {
		.field--responsive {
			flex-direction: row;
			align-items: center;
		}

		.field--responsive > :global(:is(.label, .field-content)) {
			flex: auto;
		}

		.field--responsive:has(> :global(.field-content)) {
			align-items: flex-start;
		}
	}

	/* State follows the control, so there is no invalid or disabled prop to keep in sync */
	.field:has(:global([aria-invalid='true'])) :global(.label) {
		color: var(--color-destructive);
	}

	.field:has(:global(:is(.checkbox, .radio, .switch))) :global(.label) {
		cursor: pointer;
	}

	/* The control dims itself */
	.field:has(:global(:disabled)) > :global(:is(.label, .field-description, .field-content)) {
		opacity: 0.5;
	}

	.field:has(:global(:disabled)) :global(.label) {
		cursor: not-allowed;
	}
</style>
