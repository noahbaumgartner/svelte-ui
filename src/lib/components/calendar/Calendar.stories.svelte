<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn } from 'storybook/test';
	import Calendar from './Calendar.svelte';

	const modes = ['date', 'week', 'month'] as const;
	const onselect = fn();

	const { Story } = defineMeta({
		title: 'Components/Calendar',
		component: Calendar,
		tags: ['autodocs'],
		argTypes: {
			mode: { control: 'inline-radio', options: modes },
			value: { control: 'text' },
			min: { control: 'text' },
			max: { control: 'text' },
			locale: { control: 'text' }
		},
		args: {
			mode: 'date',
			value: '2026-09-14',
			locale: 'en-US'
		}
	});

	const row = 'display: flex; flex-wrap: wrap; gap: 32px; align-items: flex-start;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<Calendar {...args} />
	{/snippet}
</Story>

<Story name="Modes" parameters={{ controls: { exclude: ['mode', 'value', 'min', 'max'] } }}>
	{#snippet template({ locale })}
		<div style={row}>
			<Calendar {locale} mode="date" value="2026-09-14" />
			<Calendar {locale} mode="week" value="2026-W38" />
			<Calendar {locale} mode="month" value="2026-09" />
		</div>
	{/snippet}
</Story>

<Story name="Range" parameters={{ controls: { exclude: ['min', 'max'] } }}>
	{#snippet template(args)}
		<Calendar {...args} min="2026-09-07" max="2026-09-25" />
	{/snippet}
</Story>

<Story
	name="Test: selects a day with mouse and keyboard"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		onselect.mockClear();
		await userEvent.click(canvas.getByRole('button', { name: 'Tuesday, September 15, 2026' }));
		await expect(onselect).toHaveBeenLastCalledWith('2026-09-15');
		await userEvent.keyboard('{ArrowDown}{Enter}');
		await expect(onselect).toHaveBeenLastCalledWith('2026-09-22');
		await userEvent.click(canvas.getByRole('button', { name: 'Next month' }));
		await expect(canvas.getByText('October 2026')).toBeVisible();
	}}
>
	{#snippet template(args)}
		<Calendar {...args} {onselect} />
	{/snippet}
</Story>

<Story
	name="Test: week mode selects the ISO week"
	tags={['!dev', '!autodocs']}
	args={{ mode: 'week', value: '' }}
	play={async ({ canvas, userEvent }) => {
		onselect.mockClear();
		await userEvent.click(canvas.getByRole('button', { name: 'Thursday, September 24, 2026' }));
		await expect(onselect).toHaveBeenLastCalledWith('2026-W39');
	}}
>
	{#snippet template(args)}
		<Calendar {...args} {onselect} />
	{/snippet}
</Story>
