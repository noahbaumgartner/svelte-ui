<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLDetailsAttributes } from 'svelte/elements';
	import { ChevronDown } from '@lucide/svelte';
	import { getAccordionContext } from './context.js';

	type Props = Omit<HTMLDetailsAttributes, 'children' | 'title' | 'name'> & {
		/** Whether the item is expanded. Bindable. */
		open?: boolean;
		/** The details element. Bindable. */
		ref?: HTMLDetailsElement | null;
		/** The always visible heading that toggles the item. */
		title: string;
		/** Replaces the title text, e.g. to add an icon or badge. */
		heading?: Snippet;
		/** The content shown while the item is open. */
		children: Snippet;
	};

	let {
		open = $bindable(false),
		ref = $bindable(null),
		title,
		heading,
		class: className,
		children,
		...rest
	}: Props = $props();

	const accordion = getAccordionContext();
</script>

<details
	{...rest}
	bind:this={ref}
	bind:open
	name={accordion.name}
	class={['accordion-item', className]}
>
	<summary class="accordion-trigger">
		<span class="accordion-title">
			{#if heading}{@render heading()}{:else}{title}{/if}
		</span>
		<ChevronDown class="accordion-chevron" aria-hidden="true" />
	</summary>
	<div class="accordion-content">{@render children()}</div>
</details>

<style>
	@layer svelte-ui {
		.accordion-item {
			font-size: 13px;
			color: var(--color-text);
			border-bottom: 1px solid var(--color-border);
			/* Lets the height animate to and from `auto` where the browser supports it */
			interpolate-size: allow-keywords;
		}

		.accordion-item:last-child {
			border-bottom: 0;
		}

		.accordion-trigger {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			padding: 14px 0;
			font-weight: 500;
			list-style: none;
			border-radius: 6px;
			outline: none;
			cursor: pointer;
			user-select: none;
		}

		.accordion-trigger::-webkit-details-marker {
			display: none;
		}

		.accordion-trigger:hover .accordion-title {
			text-decoration: underline;
			text-underline-offset: 3px;
		}

		.accordion-trigger:focus-visible {
			outline: 2px solid var(--color-accent);
			outline-offset: 2px;
		}

		.accordion-trigger :global(.accordion-chevron) {
			width: 16px;
			height: 16px;
			flex-shrink: 0;
			color: var(--color-text-muted);
			transition: rotate 200ms ease;
		}

		.accordion-item[open] > .accordion-trigger :global(.accordion-chevron) {
			rotate: 180deg;
		}

		.accordion-item::details-content {
			block-size: 0;
			overflow: clip;
			transition:
				block-size 200ms ease,
				content-visibility 200ms allow-discrete;
		}

		.accordion-item[open]::details-content {
			block-size: auto;
		}

		.accordion-content {
			padding-bottom: 14px;
			line-height: 1.5;
			color: var(--color-text-secondary);
		}

		@media (pointer: coarse) {
			.accordion-trigger {
				min-height: 44px;
				box-sizing: border-box;
			}
		}

		@media (forced-colors: active) {
			.accordion-trigger:focus-visible {
				outline-color: Highlight;
			}

			.accordion-item {
				border-bottom-color: CanvasText;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			.accordion-item::details-content,
			.accordion-trigger :global(.accordion-chevron) {
				transition: none;
			}
		}
	}
</style>
