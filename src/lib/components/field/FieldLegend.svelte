<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLLegendElement>, 'children'> & {
		/** `label` matches a FieldLabel, for a group of checkboxes or radios. */
		variant?: 'legend' | 'label';
		children: Snippet;
	};

	let { variant = 'legend', class: className, children, ...rest }: Props = $props();
</script>

<legend {...rest} class={['field-legend', `field-legend--${variant}`, className]}>
	{@render children()}
</legend>

<style>
	.field-legend {
		margin-bottom: 12px;
		padding: 0;
		font-weight: 600;
		line-height: 1.4;
	}

	.field-legend--legend {
		font-size: 15px;
	}

	.field-legend--label {
		font-size: 13px;
		font-weight: 500;
	}
</style>
