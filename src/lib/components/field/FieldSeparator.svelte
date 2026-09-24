<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** Optional text in the middle of the line, e.g. "Or continue with". */
		children?: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<div
	{...rest}
	role="separator"
	class={['field-separator', { 'field-separator--with-content': children }, className]}
>
	{#if children}<span class="field-separator-content">{@render children()}</span>{/if}
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

	.field-separator::before,
	.field-separator--with-content::after {
		content: '';
		flex: 1;
		border-top: 1px solid var(--color-border);
	}
</style>
