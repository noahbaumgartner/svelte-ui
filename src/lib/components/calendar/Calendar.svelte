<script lang="ts">
	import { tick } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import Button from '../button/Button.svelte';
	import {
		addDays,
		addMonths,
		formatDate,
		formatMonth,
		formatWeek,
		parseDate,
		parseMonth,
		parseWeek,
		sameDay,
		startOfWeek
	} from './dates.js';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'onselect'> & {
		/** Picks a day (`YYYY-MM-DD`), an ISO week (`YYYY-Www`) or a month (`YYYY-MM`), matching the input types. */
		mode?: 'date' | 'week' | 'month';
		/** Bindable, in the format of the mode. */
		value?: string;
		/** Earliest selectable value, in the format of the mode. */
		min?: string;
		/** Latest selectable value, in the format of the mode. */
		max?: string;
		/** BCP 47 locale for month and weekday names. Defaults to the browser's. */
		locale?: string;
		onselect?: (value: string) => void;
	};

	let {
		mode = 'date',
		value = $bindable(''),
		min,
		max,
		locale,
		onselect,
		class: className,
		...rest
	}: Props = $props();

	const today = new Date();

	function parse(input: string | undefined) {
		if (mode === 'week') return parseWeek(input);
		if (mode === 'month') return parseMonth(input);
		return parseDate(input);
	}

	function format(date: Date) {
		if (mode === 'week') return formatWeek(date);
		if (mode === 'month') return formatMonth(date);
		return formatDate(date);
	}

	function outOfRange(date: Date) {
		const formatted = format(date);
		return (!!min && formatted < min) || (!!max && formatted > max);
	}

	let selected = $derived(parse(value));
	/** Day or month holding the roving focus; its month (or year) is the one shown. */
	let focused = $state(
		parse(value) ?? new Date(today.getFullYear(), today.getMonth(), today.getDate())
	);
	let gridEl: HTMLElement | undefined = $state();

	let title = $derived(
		mode === 'month'
			? String(focused.getFullYear())
			: new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(focused)
	);

	let weekdays = $derived(
		Array.from({ length: 7 }, (_, i) =>
			new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2024, 0, 1 + i))
		)
	);

	let weeks = $derived.by(() => {
		const start = startOfWeek(new Date(focused.getFullYear(), focused.getMonth(), 1));
		return Array.from({ length: 6 }, (_, w) =>
			Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d))
		);
	});

	let months = $derived(
		Array.from({ length: 12 }, (_, m) => new Date(focused.getFullYear(), m, 1))
	);

	const dayLabel = $derived(new Intl.DateTimeFormat(locale, { dateStyle: 'full' }));
	const monthLabel = $derived(new Intl.DateTimeFormat(locale, { month: 'short' }));
	const monthFullLabel = $derived(
		new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' })
	);

	function select(date: Date) {
		if (outOfRange(date)) return;
		focused = date;
		value = format(date);
		onselect?.(value);
	}

	function page(direction: 1 | -1) {
		focused =
			mode === 'month'
				? new Date(focused.getFullYear() + direction, focused.getMonth(), 1)
				: addMonths(focused, direction);
	}

	async function move(date: Date) {
		focused = date;
		await tick();
		gridEl?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
	}

	function handleKeydown(event: KeyboardEvent) {
		const columns = mode === 'month' ? 3 : 7;
		const unit =
			mode === 'month' ? (n: number) => addMonths(focused, n) : (n: number) => addDays(focused, n);
		const target = {
			ArrowLeft: unit(-1),
			ArrowRight: unit(1),
			ArrowUp: unit(-columns),
			ArrowDown: unit(columns),
			Home: mode === 'month' ? new Date(focused.getFullYear(), 0, 1) : startOfWeek(focused),
			End:
				mode === 'month'
					? new Date(focused.getFullYear(), 11, 1)
					: addDays(startOfWeek(focused), 6),
			PageUp:
				mode === 'month'
					? new Date(focused.getFullYear() - 1, focused.getMonth(), 1)
					: addMonths(focused, -1),
			PageDown:
				mode === 'month'
					? new Date(focused.getFullYear() + 1, focused.getMonth(), 1)
					: addMonths(focused, 1)
		}[event.key];

		if (target) {
			event.preventDefault();
			move(target);
		}
	}
</script>

<div {...rest} class={['calendar', `calendar--${mode}`, className]}>
	<div class="calendar-header">
		<Button
			variant="ghost"
			size="sm"
			icon={ChevronLeft}
			label={mode === 'month' ? 'Previous year' : 'Previous month'}
			onclick={() => page(-1)}
		/>
		<span class="calendar-title" aria-live="polite">{title}</span>
		<Button
			variant="ghost"
			size="sm"
			icon={ChevronRight}
			label={mode === 'month' ? 'Next year' : 'Next month'}
			onclick={() => page(1)}
		/>
	</div>

	{#if mode === 'month'}
		<div class="calendar-months" role="group" aria-label={title} bind:this={gridEl}>
			{#each months as month (month.getMonth())}
				{@const current = month.getMonth() === focused.getMonth()}
				<button
					type="button"
					class={[
						'calendar-cell',
						{
							'calendar-cell--selected': sameDay(month, selected),
							'calendar-cell--today':
								month.getMonth() === today.getMonth() && month.getFullYear() === today.getFullYear()
						}
					]}
					tabindex={current ? 0 : -1}
					aria-label={monthFullLabel.format(month)}
					aria-pressed={sameDay(month, selected)}
					disabled={outOfRange(month)}
					onclick={() => select(month)}
					onkeydown={handleKeydown}
				>
					{monthLabel.format(month)}
				</button>
			{/each}
		</div>
	{:else}
		<table
			class="calendar-grid"
			role="grid"
			aria-label={title}
			bind:this={gridEl}
			onkeydown={handleKeydown}
		>
			<thead>
				<tr>
					{#if mode === 'week'}<th class="calendar-weeknumber" scope="col"
							><span class="calendar-hidden">Week</span></th
						>{/if}
					{#each weekdays as weekday (weekday)}
						<th scope="col">{weekday}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each weeks as week (formatDate(week[0]))}
					{@const weekValue = formatWeek(week[0])}
					<tr class={{ 'calendar-row--selected': mode === 'week' && weekValue === value }}>
						{#if mode === 'week'}
							<th class="calendar-weeknumber" scope="row">{weekValue.slice(-2)}</th>
						{/if}
						{#each week as day (formatDate(day))}
							<td
								role="gridcell"
								aria-selected={mode === 'week' ? weekValue === value : sameDay(day, selected)}
							>
								<button
									type="button"
									class={[
										'calendar-cell',
										{
											'calendar-cell--outside': day.getMonth() !== focused.getMonth(),
											'calendar-cell--selected': mode === 'date' && sameDay(day, selected),
											'calendar-cell--today': sameDay(day, today)
										}
									]}
									tabindex={sameDay(day, focused) ? 0 : -1}
									aria-label={dayLabel.format(day)}
									disabled={outOfRange(day)}
									onclick={() => select(day)}
								>
									{day.getDate()}
								</button>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<style>
	.calendar {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: fit-content;
		font-size: 13px;
		color: var(--color-text);
		user-select: none;
	}

	.calendar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}

	.calendar-title {
		font-weight: 600;
		text-transform: capitalize;
	}

	.calendar-grid {
		border-collapse: collapse;
		border-spacing: 0;
		table-layout: fixed;
	}

	.calendar-grid th {
		height: 28px;
		padding: 0;
		font-size: 12px;
		font-weight: 400;
		color: var(--color-text-muted);
	}

	.calendar-grid td {
		width: 32px;
		padding: 1px 0;
	}

	.calendar-weeknumber {
		width: 28px;
		padding-right: 4px;
		font-variant-numeric: tabular-nums;
	}

	.calendar-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.calendar-months {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 4px;
		width: 224px;
	}

	.calendar-cell {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
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
		transition:
			background-color 200ms ease,
			color 200ms ease;
	}

	.calendar-months .calendar-cell {
		width: 100%;
		height: 40px;
		text-transform: capitalize;
	}

	.calendar-cell:hover:not(:disabled) {
		background-color: var(--color-surface);
	}

	.calendar-cell:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: -2px;
	}

	.calendar-cell--outside {
		color: var(--color-text-faint);
	}

	.calendar-cell--today {
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	.calendar-cell:disabled {
		cursor: not-allowed;
		opacity: 0.35;
	}

	.calendar-cell--selected,
	.calendar-cell--selected:hover:not(:disabled),
	.calendar-row--selected .calendar-cell,
	.calendar-row--selected .calendar-cell:hover:not(:disabled) {
		color: var(--color-accent-foreground);
		background-color: var(--color-accent);
	}

	.calendar-cell--selected:focus-visible,
	.calendar-row--selected .calendar-cell:focus-visible {
		outline-color: var(--color-accent-foreground);
	}

	/* Week mode: a row reads as one pill */
	.calendar--week tbody tr:hover .calendar-cell:not(:disabled) {
		background-color: var(--color-surface);
	}

	.calendar--week tbody tr.calendar-row--selected .calendar-cell {
		background-color: var(--color-accent);
	}

	.calendar--week .calendar-cell {
		width: 100%;
		border-radius: 0;
	}

	.calendar--week td:nth-child(2) .calendar-cell {
		border-start-start-radius: 8px;
		border-end-start-radius: 8px;
	}

	.calendar--week td:last-child .calendar-cell {
		border-start-end-radius: 8px;
		border-end-end-radius: 8px;
	}
</style>
