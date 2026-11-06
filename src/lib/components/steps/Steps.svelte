<script module lang="ts">
	export type StepsItem = {
		label: string;
	};
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Check from '../../internal/icons/Check.svelte';

	type Props = Omit<HTMLAttributes<HTMLOListElement>, 'children' | 'onselect'> & {
		/** The steps of a multi-step flow, in order. */
		steps: StepsItem[];
		/** Zero-based index of the current step. Earlier steps show as done. */
		current: number;
		/** Accessible name of the list, e.g. what the flow does. */
		label?: string;
		/** Called with the index when a completed step is clicked. Without it steps are not clickable. */
		onselect?: (index: number) => void;
		labels?: { done?: string; current?: string };
		ref?: HTMLOListElement | null;
	};

	let {
		steps,
		current,
		label = 'Progress',
		onselect,
		labels,
		class: className,
		ref = $bindable(null),
		...rest
	}: Props = $props();

	let doneLabel = $derived(labels?.done ?? 'done');
	let currentLabel = $derived(labels?.current ?? 'current step');
</script>

<ol {...rest} bind:this={ref} aria-label={label} class={['steps', className]}>
	{#each steps as step, index (index)}
		{@const state = index < current ? 'done' : index === current ? 'current' : 'upcoming'}
		<li
			class={['steps-item', `steps-item--${state}`]}
			aria-current={state === 'current' ? 'step' : undefined}
		>
			{#if state === 'done' && onselect}
				<button type="button" class="steps-trigger" onclick={() => onselect(index)}>
					<span class="steps-marker" aria-hidden="true"><Check /></span>
					<span class="steps-label">{step.label}</span>
					<span class="steps-sr">({doneLabel})</span>
				</button>
			{:else}
				<span class="steps-trigger">
					<span class="steps-marker" aria-hidden="true">
						{#if state === 'done'}<Check />{:else}{index + 1}{/if}
					</span>
					<span class="steps-label">{step.label}</span>
					{#if state === 'done'}<span class="steps-sr">({doneLabel})</span>{/if}
					{#if state === 'current'}<span class="steps-sr">({currentLabel})</span>{/if}
				</span>
			{/if}
		</li>
	{/each}
</ol>

<style>
	@layer svelte-ui {
		.steps {
			display: flex;
			gap: 4px;
			margin: 0;
			padding: 0;
			list-style: none;
		}

		.steps-item {
			flex: 1 1 0;
			min-width: 0;
		}

		.steps-trigger {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 6px;
			width: 100%;
			padding: 8px 0 0;
			border: none;
			border-top: 3px solid var(--color-border);
			background: none;
			color: var(--color-text-muted);
			font: inherit;
			font-size: 13px;
			text-align: left;
		}

		button.steps-trigger {
			cursor: pointer;
		}

		button.steps-trigger:hover .steps-label {
			color: var(--color-text);
		}

		button.steps-trigger:focus-visible {
			outline: 2px solid var(--color-accent);
			outline-offset: 2px;
			border-radius: 2px;
		}

		.steps-item--done .steps-trigger,
		.steps-item--current .steps-trigger {
			border-top-color: var(--color-accent);
			color: var(--color-text-secondary);
		}

		.steps-item--current .steps-trigger {
			color: var(--color-text);
			font-weight: 600;
		}

		.steps-marker {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 22px;
			height: 22px;
			border-radius: 999px;
			background-color: var(--color-surface);
			color: var(--color-text-muted);
			font-size: 12px;
			font-weight: 600;
		}

		.steps-marker :global(svg) {
			width: 13px;
			height: 13px;
		}

		.steps-item--done .steps-marker,
		.steps-item--current .steps-marker {
			background-color: var(--color-accent);
			color: var(--color-accent-foreground);
		}

		.steps-label {
			overflow: hidden;
			max-width: 100%;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.steps-sr {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}

		@media (max-width: 480px) {
			.steps-item:not(.steps-item--current) .steps-label {
				display: none;
			}
		}

		@media (forced-colors: active) {
			.steps-item--done .steps-trigger,
			.steps-item--current .steps-trigger {
				border-top-color: Highlight;
			}

			.steps-marker {
				border: 1px solid CanvasText;
			}
		}
	}
</style>
