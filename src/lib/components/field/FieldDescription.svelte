<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> & {
		/** Give it an id and reference it from the control's `aria-describedby`. */
		children: Snippet;
		ref?: HTMLParagraphElement | null;
	};

	let { class: className, children, ref = $bindable(null), ...rest }: Props = $props();
</script>

<p {...rest} bind:this={ref} class={['field-description', className]}>
	{@render children()}
</p>

<style>
	@layer svelte-ui {
		.field-description {
			margin: 0;
			font-size: 12px;
			line-height: 1.5;
			color: var(--color-text-muted);
		}

		.field-description :global(a) {
			color: inherit;
			text-decoration: underline;
			text-underline-offset: 3px;
		}

		.field-description :global(a:hover) {
			color: var(--color-text);
		}
	}
</style>
