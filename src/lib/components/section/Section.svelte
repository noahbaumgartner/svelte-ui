<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
		/** The root element. Bindable. */
		ref?: HTMLElement | null;
		/**
		 * `contained` is an inset, rounded grey box; `full` is a grey band that runs edge to edge
		 * and keeps its content at `--section-max-width`.
		 */
		width?: 'contained' | 'full';
		/**
		 * Adds inner padding that grows with the viewport. On by default for `full`, off for
		 * `contained` (give the box your own padding via `class`).
		 */
		padded?: boolean;
		/** Fills the section with `--color-surface`. Off, it sits on the page background. */
		surface?: boolean;
		children?: Snippet;
	};

	let {
		ref = $bindable(null),
		width = 'contained',
		padded,
		surface = true,
		class: className,
		children,
		...rest
	}: Props = $props();

	let hasPadding = $derived(padded ?? width === 'full');
</script>

<section
	{...rest}
	bind:this={ref}
	class={[
		'section',
		`section--${width}`,
		{ 'section--padded': hasPadding, 'section--surface': surface },
		className
	]}
>
	{#if width === 'full'}
		<div class="section-content">{@render children?.()}</div>
	{:else}
		{@render children?.()}
	{/if}
</section>

<style>
	@layer svelte-ui {
		/*
		 * --section-inline         distance from the viewport edge
		 * --section-padding-block  inner padding when `padded`
		 * --section-max-width      width of the content, 1280px by default
		 * All three are overridable; the first two follow the viewport.
		 */
		.section {
			--section-gutter: var(--section-inline, 24px);
			--section-pad: var(--section-padding-block, 24px);
			box-sizing: border-box;
		}

		@media (min-width: 640px) {
			.section {
				--section-gutter: var(--section-inline, 40px);
				--section-pad: var(--section-padding-block, 40px);
			}
		}

		@media (min-width: 1024px) {
			.section {
				--section-gutter: var(--section-inline, 64px);
				--section-pad: var(--section-padding-block, 64px);
			}
		}

		.section--contained {
			width: min(100% - 2 * var(--section-gutter), var(--section-max-width, 1280px));
			margin-inline: auto;
			border-radius: 10px;
		}

		.section--contained.section--padded {
			padding: var(--section-pad);
		}

		.section--full {
			padding-inline: var(--section-gutter);
		}

		.section--surface {
			background-color: var(--color-surface);
		}

		.section--full.section--padded {
			padding-block: var(--section-pad);
		}

		.section-content {
			max-width: var(--section-max-width, 1280px);
			margin-inline: auto;
		}

		@media (forced-colors: active) {
			.section--contained.section--surface {
				border: 1px solid CanvasText;
			}
		}
	}
</style>
