<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
		/** The nav element. Bindable. */
		ref?: HTMLElement | null;
		/** `BreadcrumbItem`s and `BreadcrumbEllipsis`es. */
		children: Snippet;
	};

	let { ref = $bindable(null), class: className, children, ...rest }: Props = $props();
</script>

<nav aria-label="Breadcrumb" {...rest} bind:this={ref} class={['breadcrumb', className]}>
	<ol class="breadcrumb-list">
		{@render children()}
	</ol>
</nav>

<style>
	@layer svelte-ui {
		.breadcrumb-list {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			gap: 6px;
			margin: 0;
			padding: 0;
			list-style: none;
			font-size: 13px;
			color: var(--color-text-muted);
			overflow-wrap: anywhere;
		}

		/* Each item renders its own trailing separator; the last one has nothing to separate */
		.breadcrumb-list :global(.breadcrumb-separator:last-child) {
			display: none;
		}
	}
</style>
