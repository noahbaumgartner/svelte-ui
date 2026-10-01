<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** Fields, FieldSets and FieldSeparators. */
		children: Snippet;
		ref?: HTMLDivElement | null;
	};

	let { class: className, children, ref = $bindable(null), ...rest }: Props = $props();
</script>

<div {...rest} bind:this={ref} class={['field-group', className]}>
	{@render children()}
</div>

<style>
	@layer svelte-ui {
		.field-group {
			container: field-group / inline-size;
			display: flex;
			flex-direction: column;
			gap: 24px;
			width: 100%;
		}

		/* Tighter spacing for lists of checkboxes or radios */
		.field-group:has(> :global(.field--horizontal)):not(:has(> :global(:not(.field--horizontal)))) {
			gap: 12px;
		}
	}
</style>
