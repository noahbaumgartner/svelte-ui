<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> & {
		/** The separator element. Bindable. */
		ref?: HTMLDivElement | null;
	};

	let { ref = $bindable(null), class: className, ...rest }: Props = $props();
</script>

<div
	{...rest}
	bind:this={ref}
	role="separator"
	class={['context-menu-separator', className]}
></div>

<style>
	@layer svelte-ui {
		.context-menu-separator {
			height: 1px;
			margin: 2px 0;
			flex-shrink: 0;
			background-color: var(--color-border);
		}

		@media (forced-colors: active) {
			.context-menu-separator {
				background-color: CanvasText;
			}
		}
	}
</style>
