<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** Direction of the line. */
		orientation?: 'horizontal' | 'vertical';
		/** Purely visual line, hidden from assistive technology. Set to false when it separates content semantically. */
		decorative?: boolean;
		ref?: HTMLDivElement | null;
	};

	let {
		orientation = 'horizontal',
		decorative = true,
		ref = $bindable(null),
		class: className,
		...rest
	}: Props = $props();
</script>

<div
	{...rest}
	bind:this={ref}
	role={decorative ? 'none' : 'separator'}
	aria-orientation={decorative || orientation === 'horizontal' ? undefined : orientation}
	data-orientation={orientation}
	class={['separator', `separator--${orientation}`, className]}
></div>

<style>
	@layer svelte-ui {
		.separator {
			flex-shrink: 0;
			background-color: var(--color-border);
		}

		.separator--horizontal {
			height: 1px;
		}

		.separator--vertical {
			width: 1px;
			align-self: stretch;
		}

		@media (forced-colors: active) {
			.separator {
				background-color: CanvasText;
			}
		}
	}
</style>
