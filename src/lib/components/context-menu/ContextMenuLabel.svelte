<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> & {
		/** The label element. Bindable. */
		ref?: HTMLDivElement | null;
		children: Snippet;
	};

	let { ref = $bindable(null), class: className, children, ...rest }: Props = $props();
</script>

<div {...rest} bind:this={ref} role="presentation" class={['context-menu-label', className]}>
	{@render children()}
</div>

<style>
	@layer svelte-ui {
		.context-menu-label {
			padding: 6px 10px 4px;
			font-size: 11px;
			font-weight: 500;
			letter-spacing: 0.02em;
			color: var(--color-text-muted);
		}
	}
</style>
