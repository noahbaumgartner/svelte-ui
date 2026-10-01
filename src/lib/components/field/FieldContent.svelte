<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** Label, FieldDescription and FieldError next to the control in a horizontal Field. */
		children: Snippet;
		ref?: HTMLDivElement | null;
	};

	let { class: className, children, ref = $bindable(null), ...rest }: Props = $props();
</script>

<div {...rest} bind:this={ref} class={['field-content', className]}>
	{@render children()}
</div>

<style>
	@layer svelte-ui {
		.field-content {
			display: flex;
			flex: 1;
			flex-direction: column;
			gap: 4px;
			min-width: 0;
		}
	}
</style>
