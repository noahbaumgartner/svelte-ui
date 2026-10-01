<script module lang="ts">
	export type TimePickerLabels = {
		/** Accessible name of the hours column. */
		hours?: string;
		/** Accessible name of the minutes column. */
		minutes?: string;
		/** Accessible name of the AM/PM column. */
		period?: string;
		am?: string;
		pm?: string;
	};
</script>

<script lang="ts">
	import { tick } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'onselect'> & {
		/** Bindable, `HH:MM` in 24-hour time like `<input type="time">`. */
		value?: string;
		/** Minutes between the offered values. */
		minuteStep?: number;
		/** BCP 47 tag used for numerals, AM/PM text and the 12/24-hour default. Without it the picker shows 24 hours. */
		locale?: string;
		/** Forces 12-hour (`true`) or 24-hour (`false`) columns, overriding the locale. */
		hour12?: boolean;
		/** Accessible names of the columns and the AM/PM text. */
		labels?: TimePickerLabels;
		onselect?: (value: string) => void;
		ref?: HTMLDivElement | null;
	};

	let {
		value = $bindable(''),
		minuteStep = 1,
		locale,
		hour12,
		labels,
		onselect,
		ref = $bindable(null),
		class: className,
		...rest
	}: Props = $props();

	type Column = 'hour' | 'minute' | 'period';
	type Entry = { id: number; text: string };

	let twelve = $derived(
		hour12 ??
			(locale !== undefined &&
				['h11', 'h12'].includes(
					new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions().hourCycle ?? ''
				))
	);

	let format = $derived(
		new Intl.NumberFormat(locale, { minimumIntegerDigits: 2, useGrouping: false }).format
	);
	let formatPlain = $derived(new Intl.NumberFormat(locale, { useGrouping: false }).format);

	function dayPeriod(hour: number, fallback: string) {
		if (locale === undefined) return fallback;
		return (
			new Intl.DateTimeFormat(locale, { hour: 'numeric', hour12: true })
				.formatToParts(new Date(2000, 0, 1, hour))
				.find((part) => part.type === 'dayPeriod')?.value ?? fallback
		);
	}

	let hoursLabel = $derived(labels?.hours ?? 'Hours');
	let minutesLabel = $derived(labels?.minutes ?? 'Minutes');
	let periodLabel = $derived(labels?.period ?? 'AM/PM');
	let amLabel = $derived(labels?.am ?? dayPeriod(9, 'AM'));
	let pmLabel = $derived(labels?.pm ?? dayPeriod(15, 'PM'));

	let hourEntries: Entry[] = $derived(
		twelve
			? Array.from({ length: 12 }, (_, i) => {
					const id = i === 0 ? 12 : i;
					return { id, text: formatPlain(id) };
				})
			: Array.from({ length: 24 }, (_, i) => ({ id: i, text: format(i) }))
	);
	let minuteEntries: Entry[] = $derived(
		Array.from({ length: Math.ceil(60 / Math.max(1, minuteStep)) }, (_, i) => {
			const id = i * Math.max(1, minuteStep);
			return { id, text: format(id) };
		})
	);
	let periodEntries: Entry[] = $derived([
		{ id: 0, text: amLabel },
		{ id: 1, text: pmLabel }
	]);

	let hour = $derived(value ? Number(value.slice(0, 2)) : undefined);
	let minute = $derived(value ? Number(value.slice(3, 5)) : undefined);
	let period = $derived(hour === undefined ? undefined : hour >= 12 ? 1 : 0);
	let shownHour = $derived(hour === undefined ? undefined : twelve ? hour % 12 || 12 : hour);

	let columnEls: Partial<Record<Column, HTMLElement>> = $state({});

	function set(nextHour: number, nextMinute: number) {
		value = `${String(nextHour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')}`;
		onselect?.(value);
	}

	function choose(column: Column, id: number) {
		if (column === 'minute') return set(hour ?? 0, id);
		if (column === 'period') return set(((hour ?? 0) % 12) + id * 12, minute ?? 0);
		set(twelve ? (id % 12) + (period ?? 0) * 12 : id, minute ?? 0);
	}

	function center(column: HTMLElement | undefined) {
		const item = column?.querySelector<HTMLElement>('[tabindex="0"]');
		if (column && item)
			column.scrollTop = item.offsetTop - (column.clientHeight - item.offsetHeight) / 2;
	}

	$effect(() => {
		void value;
		tick().then(() => {
			center(columnEls.hour);
			center(columnEls.minute);
		});
	});

	async function handleKeydown(event: KeyboardEvent, column: Column) {
		const list = { hour: hourEntries, minute: minuteEntries, period: periodEntries }[column];
		const selected = { hour: shownHour, minute, period }[column];
		const found = list.findIndex((entry) => entry.id === (selected ?? list[0].id));
		const current = found === -1 ? 0 : found;
		const next = {
			ArrowUp: current - 1,
			ArrowDown: current + 1,
			Home: 0,
			End: list.length - 1
		}[event.key];
		if (next === undefined) return;

		event.preventDefault();
		choose(column, list[Math.min(list.length - 1, Math.max(0, next))].id);
		await tick();
		columnEls[column]?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
	}
</script>

{#snippet columnItems(list: Entry[], current: number | undefined, column: Column)}
	{#each list as item, i (item.id)}
		<button
			type="button"
			class={['time-picker-item', { 'time-picker-item--selected': item.id === current }]}
			tabindex={item.id === current || (current === undefined && i === 0) ? 0 : -1}
			aria-pressed={item.id === current}
			onclick={() => choose(column, item.id)}
			onkeydown={(event) => handleKeydown(event, column)}
		>
			{item.text}
		</button>
	{/each}
{/snippet}

<div {...rest} bind:this={ref} class={['time-picker', className]}>
	<div class="time-picker-column" role="group" aria-label={hoursLabel} bind:this={columnEls.hour}>
		{@render columnItems(hourEntries, shownHour, 'hour')}
	</div>
	<div
		class="time-picker-column"
		role="group"
		aria-label={minutesLabel}
		bind:this={columnEls.minute}
	>
		{@render columnItems(minuteEntries, minute, 'minute')}
	</div>
	{#if twelve}
		<div
			class="time-picker-column"
			role="group"
			aria-label={periodLabel}
			bind:this={columnEls.period}
		>
			{@render columnItems(periodEntries, period, 'period')}
		</div>
	{/if}
</div>

<style>
	@layer svelte-ui {
		.time-picker {
			display: flex;
			gap: 4px;
			height: 232px;
			font-size: 13px;
			color: var(--color-text);
			user-select: none;
		}

		.time-picker-column {
			display: flex;
			flex-direction: column;
			gap: 2px;
			width: 48px;
			padding: 0 2px;
			overflow-y: auto;
			scrollbar-width: none;
			scroll-snap-type: y proximity;
		}

		.time-picker-column + .time-picker-column {
			padding-left: 6px;
			border-left: 1px solid var(--color-border);
		}

		.time-picker-item {
			flex-shrink: 0;
			height: 28px;
			padding: 0;
			font-family: inherit;
			font-size: 13px;
			font-variant-numeric: tabular-nums;
			color: var(--color-text);
			background-color: transparent;
			border: none;
			border-radius: 8px;
			outline: none;
			cursor: pointer;
			scroll-snap-align: center;
			transition: background-color 200ms ease;
		}

		.time-picker-item:hover {
			background-color: var(--color-surface);
		}

		.time-picker-item:focus-visible {
			outline: 2px solid var(--color-accent);
			outline-offset: -2px;
		}

		.time-picker-item--selected,
		.time-picker-item--selected:hover {
			color: var(--color-accent-foreground);
			background-color: var(--color-accent);
		}

		.time-picker-item--selected:focus-visible {
			outline-color: var(--color-accent-foreground);
		}

		@media (pointer: coarse) {
			.time-picker-column {
				width: 56px;
			}

			.time-picker-item {
				min-height: 44px;
			}
		}

		@media (forced-colors: active) {
			.time-picker-item {
				color: ButtonText;
			}

			.time-picker-item--selected,
			.time-picker-item--selected:hover {
				color: HighlightText;
				background-color: Highlight;
			}

			.time-picker-item:hover:not(.time-picker-item--selected) {
				outline: 1px solid Highlight;
				outline-offset: -1px;
			}

			.time-picker-item:focus-visible,
			.time-picker-item--selected:focus-visible {
				outline: 2px solid CanvasText;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			.time-picker-item {
				transition: none;
			}

			.time-picker-column {
				scroll-behavior: auto;
			}
		}
	}
</style>
