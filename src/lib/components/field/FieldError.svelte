<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** Messages from validation. Duplicates are dropped, several render as a list. */
		errors?: (string | undefined)[];
		/** Custom content instead of `errors`. */
		children?: Snippet;
		ref?: HTMLDivElement | null;
	};

	let { errors = [], class: className, children, ref = $bindable(null), ...rest }: Props = $props();

	let messages = $derived([...new Set(errors.filter(Boolean))]);
</script>

{#if children || messages.length}
	<div {...rest} bind:this={ref} role="alert" class={['field-error', className]}>
		{#if children}
			{@render children()}
		{:else if messages.length === 1}
			{messages[0]}
		{:else}
			<ul>
				{#each messages as message (message)}<li>{message}</li>{/each}
			</ul>
		{/if}
	</div>
{/if}

<style>
	@layer svelte-ui {
		.field-error {
			font-size: 12px;
			line-height: 1.5;
			color: var(--color-destructive);
		}

		ul {
			display: flex;
			flex-direction: column;
			gap: 2px;
			margin: 0;
			padding-left: 16px;
		}

		@media (forced-colors: active) {
			.field-error {
				color: CanvasText;
			}
		}
	}
</style>
