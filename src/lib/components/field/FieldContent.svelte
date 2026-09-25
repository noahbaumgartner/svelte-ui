<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** Label, FieldDescription and FieldError next to the control in a horizontal Field. */
		children: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<div {...rest} class={['field-content', className]}>
	{@render children()}
</div>

<style>
	.field-content {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}
</style>
