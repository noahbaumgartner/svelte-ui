<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	type Props = Omit<HTMLLabelAttributes, 'children'> & {
		/** Set `for` to the control's id, or wrap the control. */
		children: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<label {...rest} class={['field-label', className]}>
	{@render children()}
</label>

<style>
	.field-label {
		display: flex;
		align-items: center;
		gap: 8px;
		width: fit-content;
		font-size: 13px;
		font-weight: 500;
		line-height: 1.4;
		user-select: none;
	}
</style>
