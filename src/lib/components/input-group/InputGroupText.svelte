<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
		/** Text and icons, e.g. a currency or a URL prefix. */
		children: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<span {...rest} class={['input-group-text', className]}>
	{@render children()}
</span>

<style>
	.input-group-text {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		color: var(--color-text-muted);
		white-space: nowrap;
	}
</style>
