<script lang="ts">
	import { tick } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'onselect'> & {
		/** Bindable, `HH:MM` in 24-hour time like `<input type="time">`. */
		value?: string;
		/** Minutes between the offered values. */
		minuteStep?: number;
		onselect?: (value: string) => void;
	};

	let {
		value = $bindable(''),
		minuteStep = 1,
		onselect,
		class: className,
		...rest
	}: Props = $props();

	const pad = (n: number) => String(n).padStart(2, '0');
	const hours = Array.from({ length: 24 }, (_, i) => i);
	let minutes = $derived(
		Array.from(
			{ length: Math.ceil(60 / Math.max(1, minuteStep)) },
			(_, i) => i * Math.max(1, minuteStep)
		)
	);

	let hour = $derived(value ? Number(value.slice(0, 2)) : undefined);
	let minute = $derived(value ? Number(value.slice(3, 5)) : undefined);

	let hoursEl: HTMLElement | undefined = $state();
	let minutesEl: HTMLElement | undefined = $state();

	function set(nextHour: number, nextMinute: number) {
		value = `${pad(nextHour)}:${pad(nextMinute)}`;
		onselect?.(value);
	}

	function center(column: HTMLElement | undefined) {
		const item = column?.querySelector<HTMLElement>('[tabindex="0"]');
		if (column && item)
			column.scrollTop = item.offsetTop - (column.clientHeight - item.offsetHeight) / 2;
	}

	$effect(() => {
		void value;
		tick().then(() => {
			center(hoursEl);
			center(minutesEl);
		});
	});

	async function handleKeydown(event: KeyboardEvent, column: 'hour' | 'minute') {
		const list = column === 'hour' ? hours : minutes;
		const current = list.indexOf((column === 'hour' ? hour : minute) ?? list[0]);
		const next = {
			ArrowUp: current - 1,
			ArrowDown: current + 1,
			Home: 0,
			End: list.length - 1
		}[event.key];
		if (next === undefined) return;

		event.preventDefault();
		const clamped = list[Math.min(list.length - 1, Math.max(0, next))];
		if (column === 'hour') set(clamped, minute ?? 0);
		else set(hour ?? 0, clamped);
		await tick();
		(column === 'hour' ? hoursEl : minutesEl)
			?.querySelector<HTMLElement>('[tabindex="0"]')
			?.focus();
	}
</script>

{#snippet columnItems(list: number[], current: number | undefined, column: 'hour' | 'minute')}
	{#each list as item, i (item)}
		<button
			type="button"
			class={['time-picker-item', { 'time-picker-item--selected': item === current }]}
			tabindex={item === current || (current === undefined && i === 0) ? 0 : -1}
			aria-pressed={item === current}
			onclick={() => (column === 'hour' ? set(item, minute ?? 0) : set(hour ?? 0, item))}
			onkeydown={(event) => handleKeydown(event, column)}
		>
			{pad(item)}
		</button>
	{/each}
{/snippet}

<div {...rest} class={['time-picker', className]}>
	<div class="time-picker-column" role="group" aria-label="Hours" bind:this={hoursEl}>
		{@render columnItems(hours, hour, 'hour')}
	</div>
	<div class="time-picker-column" role="group" aria-label="Minutes" bind:this={minutesEl}>
		{@render columnItems(minutes, minute, 'minute')}
	</div>
</div>

<style>
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
		outline: 2px solid var(--color-ink);
		outline-offset: -2px;
	}

	.time-picker-item--selected,
	.time-picker-item--selected:hover {
		color: var(--color-base);
		background-color: var(--color-ink);
	}

	.time-picker-item--selected:focus-visible {
		outline-color: var(--color-base);
	}
</style>
