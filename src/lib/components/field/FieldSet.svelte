<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLFieldsetAttributes } from 'svelte/elements';

	type Props = Omit<HTMLFieldsetAttributes, 'children'> & {
		/** A FieldLegend, optionally a FieldDescription, then a FieldGroup. `disabled` disables every control inside. */
		children: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<fieldset {...rest} class={['field-set', className]}>
	{@render children()}
</fieldset>

<style>
	.field-set {
		display: flex;
		flex-direction: column;
		gap: 24px;
		min-width: 0;
		margin: 0;
		padding: 0;
		border: none;
		color: var(--color-text);
	}

	/* The legend sits outside the flex layout, so only its own margin spaces it */
	.field-set > :global(.field-legend + .field-description) {
		margin-top: -8px;
	}
</style>
