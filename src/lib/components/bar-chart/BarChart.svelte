<script module lang="ts">
	export type BarChartItem = {
		label: string;
		value: number;
		/** Optional secondary text after the value, e.g. a share or a second figure. */
		detail?: string;
	};
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
		/** Bars from top to bottom (horizontal) or left to right (vertical), in the given order. */
		items: BarChartItem[];
		/** Accessible name of the chart. */
		label: string;
		/** Formats the value shown next to each bar. */
		format?: (value: number) => string;
		/** Value of a full-length bar. Defaults to the largest value. */
		max?: number;
		/** Horizontal bars in rows, or vertical columns side by side. */
		orientation?: 'horizontal' | 'vertical';
		/** Height of the columns in px (vertical only). */
		height?: number;
		labels?: { empty?: string };
		ref?: HTMLElement | null;
	};

	let {
		items,
		label,
		format = (value) => String(value),
		max,
		orientation = 'horizontal',
		height = 200,
		labels,
		class: className,
		ref = $bindable(null),
		...rest
	}: Props = $props();

	let scale = $derived(max ?? Math.max(0, ...items.map((item) => item.value)));

	const share = (value: number) => (scale === 0 ? 0 : Math.max(0, (value / scale) * 100));
</script>

<figure {...rest} bind:this={ref} class={['bar-chart', className]}>
	<figcaption class="bar-chart-sr">{label}</figcaption>
	{#if items.length === 0}
		<div class="bar-chart-empty">{labels?.empty ?? 'No data'}</div>
	{:else}
		{#if orientation === 'vertical'}
			<ul class="bar-chart-columns">
				{#each items as item, index (index)}
					<li class="bar-chart-column">
						<span class="bar-chart-value">{format(item.value)}</span>
						{#if item.detail}<span class="bar-chart-detail">{item.detail}</span>{/if}
						<span class="bar-chart-track" aria-hidden="true" style:height="{height}px">
							<span class="bar-chart-bar" style:height="{share(item.value)}%"></span>
						</span>
						<span class="bar-chart-label" title={item.label}>{item.label}</span>
					</li>
				{/each}
			</ul>
		{:else}
			<ul class="bar-chart-list">
				{#each items as item, index (index)}
					<li class="bar-chart-row">
						<span class="bar-chart-label" title={item.label}>{item.label}</span>
						<span class="bar-chart-track" aria-hidden="true">
							<span class="bar-chart-bar" style:width="{share(item.value)}%"></span>
						</span>
						<span class="bar-chart-value">
							{format(item.value)}
							{#if item.detail}<span class="bar-chart-detail">{item.detail}</span>{/if}
						</span>
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
</figure>

<style>
	@layer svelte-ui {
		.bar-chart {
			margin: 0;
		}

		.bar-chart-list {
			display: grid;
			grid-template-columns: minmax(80px, max-content) 1fr auto;
			gap: 10px 12px;
			align-items: center;
			margin: 0;
			padding: 0;
			list-style: none;
		}

		.bar-chart-row {
			display: contents;
		}

		.bar-chart-label {
			overflow: hidden;
			max-width: 220px;
			color: var(--color-text-secondary);
			font-size: 14px;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.bar-chart-track {
			height: 20px;
			border-radius: 6px;
			background-color: var(--color-surface);
			overflow: hidden;
		}

		.bar-chart-bar {
			display: block;
			height: 100%;
			border-radius: 6px;
			background-color: var(--color-accent);
			transition: width 300ms ease;
		}

		.bar-chart-value {
			color: var(--color-text);
			font-size: 14px;
			font-weight: 600;
			font-variant-numeric: tabular-nums;
			text-align: right;
			white-space: nowrap;
		}

		.bar-chart-detail {
			margin-left: 6px;
			color: var(--color-text-muted);
			font-weight: 400;
		}

		/* Vertical: columns share the width; too many of them scroll sideways. */
		.bar-chart-columns {
			display: flex;
			gap: 8px;
			margin: 0;
			padding: 0;
			overflow-x: auto;
			list-style: none;
		}

		.bar-chart-column {
			display: flex;
			flex: 1 1 0;
			flex-direction: column;
			align-items: center;
			gap: 4px;
			min-width: 56px;
			max-width: 120px;
		}

		.bar-chart-column .bar-chart-value {
			text-align: center;
		}

		.bar-chart-column .bar-chart-detail {
			margin-left: 0;
			font-size: 12px;
			white-space: nowrap;
		}

		.bar-chart-column .bar-chart-track {
			display: flex;
			align-items: flex-end;
			width: 100%;
			margin-top: 4px;
		}

		.bar-chart-column .bar-chart-bar {
			width: 100%;
			transition: height 300ms ease;
		}

		.bar-chart-column .bar-chart-label {
			max-width: 100%;
			font-size: 13px;
			text-align: center;
		}

		.bar-chart-empty {
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 120px;
			border: 1px dashed var(--color-border);
			border-radius: 12px;
			color: var(--color-text-muted);
			font-size: 14px;
		}

		.bar-chart-sr {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}

		@media (max-width: 480px) {
			.bar-chart-label {
				max-width: 110px;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			.bar-chart-bar {
				transition: none;
			}
		}

		@media (forced-colors: active) {
			.bar-chart-track {
				border: 1px solid CanvasText;
			}

			.bar-chart-bar {
				forced-color-adjust: none;
				background-color: Highlight;
			}
		}
	}
</style>
