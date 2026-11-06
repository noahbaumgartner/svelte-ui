<script module lang="ts">
	export type ChartPoint = {
		/** Shown on the x axis and in the tooltip, e.g. a time. */
		label: string;
		value: number;
	};
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
		data: ChartPoint[];
		/** Accessible name of the chart, also the caption of the data table for screen readers. */
		label: string;
		/** Formats values on the y axis and in the tooltip. */
		format?: (value: number) => string;
		/** Height of the plot in px. Width follows the container. */
		height?: number;
		/** Fills the area under the line. */
		area?: boolean;
		labels?: { empty?: string; valueColumn?: string; labelColumn?: string };
		ref?: HTMLElement | null;
	};

	let {
		data,
		label,
		format = (value) => String(value),
		height = 240,
		area = true,
		labels,
		class: className,
		ref = $bindable(null),
		...rest
	}: Props = $props();

	const padding = { top: 16, right: 16, bottom: 28, left: 56 };

	let width = $state(0);
	let active = $state<number | null>(null);

	let plotWidth = $derived(Math.max(0, width - padding.left - padding.right));
	let plotHeight = $derived(Math.max(0, height - padding.top - padding.bottom));
	let scale = $derived(niceScale(Math.max(0, ...data.map((point) => point.value))));
	let max = $derived(scale.max);
	let ticks = $derived(Array.from({ length: scale.lines + 1 }, (_, i) => scale.step * i));

	let points = $derived(
		data.map((point, index) => ({
			...point,
			x:
				padding.left +
				(data.length === 1 ? plotWidth / 2 : (plotWidth / (data.length - 1)) * index),
			y: padding.top + plotHeight - (max === 0 ? 0 : (point.value / max) * plotHeight)
		}))
	);

	let linePath = $derived(points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' '));
	let areaPath = $derived(
		points.length > 1
			? `${linePath} L${points.at(-1)!.x},${padding.top + plotHeight} L${points[0].x},${padding.top + plotHeight} Z`
			: ''
	);

	/** Only every n-th label fits on the x axis. */
	let labelEvery = $derived(Math.max(1, Math.ceil(data.length / Math.max(1, plotWidth / 64))));

	/** Round tick steps (1, 2, 2.5, 5 × 10ⁿ) with 3–5 grid lines and the least empty space on top. */
	function niceScale(value: number) {
		if (value <= 0) return { max: 0, step: 0, lines: 4 };
		let best = { max: Infinity, step: 0, lines: 4 };
		for (const lines of [3, 4, 5]) {
			const raw = value / lines;
			const magnitude = 10 ** Math.floor(Math.log10(raw));
			const step = ([1, 2, 2.5, 5, 10].find((s) => s * magnitude >= raw) ?? 10) * magnitude;
			if (step * lines < best.max) best = { max: step * lines, step, lines };
		}
		return best;
	}

	function pick(event: PointerEvent) {
		if (points.length === 0) return;
		const svg = event.currentTarget as SVGSVGElement;
		const x = event.clientX - svg.getBoundingClientRect().left;
		let nearest = 0;
		for (let i = 1; i < points.length; i += 1) {
			if (Math.abs(points[i].x - x) < Math.abs(points[nearest].x - x)) nearest = i;
		}
		active = nearest;
	}

	function keydown(event: KeyboardEvent) {
		if (points.length === 0) return;
		const current = active ?? -1;
		if (event.key === 'ArrowRight') active = Math.min(points.length - 1, current + 1);
		else if (event.key === 'ArrowLeft') active = Math.max(0, current < 0 ? 0 : current - 1);
		else if (event.key === 'Home') active = 0;
		else if (event.key === 'End') active = points.length - 1;
		else if (event.key === 'Escape') active = null;
		else return;
		event.preventDefault();
	}

	let activePoint = $derived(active === null ? null : (points[active] ?? null));
</script>

<figure {...rest} bind:this={ref} class={['line-chart', className]} bind:clientWidth={width}>
	{#if data.length === 0}
		<div class="line-chart-empty" style:height="{height}px">{labels?.empty ?? 'No data'}</div>
	{:else if width > 0}
		<!-- The pointer/keyboard cursor is an extra; the data table below carries the content. -->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
		<svg
			{width}
			{height}
			role="img"
			aria-label={label}
			tabindex="0"
			onpointermove={pick}
			onpointerleave={() => (active = null)}
			onkeydown={keydown}
			onblur={() => (active = null)}
		>
			{#each ticks as tick (tick)}
				{@const y = padding.top + plotHeight - (max === 0 ? 0 : (tick / max) * plotHeight)}
				<line class="line-chart-grid" x1={padding.left} x2={width - padding.right} y1={y} y2={y} />
				<text
					class="line-chart-tick"
					x={padding.left - 8}
					{y}
					text-anchor="end"
					dominant-baseline="middle">{format(tick)}</text
				>
			{/each}
			{#each points as point, index (index)}
				{#if index % labelEvery === 0}
					<text class="line-chart-tick" x={point.x} y={height - 8} text-anchor="middle"
						>{point.label}</text
					>
				{/if}
			{/each}
			{#if area && areaPath}<path class="line-chart-area" d={areaPath} />{/if}
			<path class="line-chart-line" d={linePath} />
			{#if points.length <= 40}
				{#each points as point, index (index)}
					<circle class="line-chart-dot" cx={point.x} cy={point.y} r="3" />
				{/each}
			{/if}
			{#if activePoint}
				<line
					class="line-chart-cursor"
					x1={activePoint.x}
					x2={activePoint.x}
					y1={padding.top}
					y2={padding.top + plotHeight}
				/>
				<circle
					class="line-chart-dot line-chart-dot--active"
					cx={activePoint.x}
					cy={activePoint.y}
					r="5"
				/>
			{/if}
		</svg>
		{#if activePoint}
			<div
				class="line-chart-tooltip"
				role="status"
				style:left="{Math.min(Math.max(activePoint.x, 70), width - 70)}px"
				style:top="{activePoint.y}px"
			>
				<span class="line-chart-tooltip-label">{activePoint.label}</span>
				<strong>{format(activePoint.value)}</strong>
			</div>
		{/if}
	{/if}
	<table class="line-chart-sr">
		<caption>{label}</caption>
		<thead>
			<tr>
				<th scope="col">{labels?.labelColumn ?? 'Label'}</th>
				<th scope="col">{labels?.valueColumn ?? 'Value'}</th>
			</tr>
		</thead>
		<tbody>
			{#each data as point, index (index)}
				<tr><td>{point.label}</td><td>{format(point.value)}</td></tr>
			{/each}
		</tbody>
	</table>
</figure>

<style>
	@layer svelte-ui {
		.line-chart {
			position: relative;
			width: 100%;
			margin: 0;
		}

		.line-chart svg {
			display: block;
			overflow: visible;
			touch-action: pan-y;
		}

		.line-chart svg:focus-visible {
			outline: 2px solid var(--color-accent);
			outline-offset: 4px;
			border-radius: 4px;
		}

		.line-chart-grid {
			stroke: var(--color-border);
			stroke-width: 1;
		}

		.line-chart-tick {
			fill: var(--color-text-muted);
			font-size: 11px;
			font-variant-numeric: tabular-nums;
		}

		.line-chart-area {
			fill: var(--color-accent);
			opacity: 0.08;
		}

		.line-chart-line {
			fill: none;
			stroke: var(--color-accent);
			stroke-width: 2;
			stroke-linejoin: round;
			stroke-linecap: round;
		}

		.line-chart-dot {
			fill: var(--color-bg);
			stroke: var(--color-accent);
			stroke-width: 2;
		}

		.line-chart-dot--active {
			fill: var(--color-accent);
		}

		.line-chart-cursor {
			stroke: var(--color-border-strong);
			stroke-dasharray: 3 3;
		}

		.line-chart-tooltip {
			position: absolute;
			display: flex;
			flex-direction: column;
			gap: 2px;
			padding: 6px 10px;
			border: 1px solid var(--color-border);
			border-radius: 8px;
			background-color: var(--color-bg);
			box-shadow: 0 4px 16px color-mix(in srgb, var(--color-shadow) 10%, transparent);
			color: var(--color-text);
			font-size: 12px;
			pointer-events: none;
			translate: -50% calc(-100% - 12px);
			white-space: nowrap;
		}

		.line-chart-tooltip-label {
			color: var(--color-text-muted);
		}

		.line-chart-empty {
			display: flex;
			align-items: center;
			justify-content: center;
			border: 1px dashed var(--color-border);
			border-radius: 12px;
			color: var(--color-text-muted);
			font-size: 14px;
		}

		.line-chart-sr {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}

		@media (forced-colors: active) {
			.line-chart-line,
			.line-chart-dot {
				stroke: CanvasText;
			}

			.line-chart-dot--active {
				fill: Highlight;
			}
		}
	}
</style>
