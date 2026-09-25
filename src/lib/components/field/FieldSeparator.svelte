<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Separator from '../separator/Separator.svelte';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** Optional text in the middle of the line, e.g. "Or continue with". */
		children?: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<div {...rest} role="separator" class={['field-separator', className]}>
	<Separator style="flex: 1;" />
	{#if children}
		<span class="field-separator-content">{@render children()}</span>
		<Separator style="flex: 1;" />
	{/if}
</div>

<style>
	.field-separator {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 20px;
		font-size: 13px;
		color: var(--color-text-muted);
	}
</style>
