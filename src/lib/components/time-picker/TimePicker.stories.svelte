<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn, within } from 'storybook/test';
	import TimePicker from './TimePicker.svelte';

	const onselect = fn();

	const { Story } = defineMeta({
		title: 'Components/TimePicker',
		component: TimePicker,
		tags: ['autodocs'],
		argTypes: {
			value: { control: 'text' },
			minuteStep: { control: 'number' }
		},
		args: {
			value: '09:30',
			minuteStep: 1
		}
	});

	const row = 'display: flex; flex-wrap: wrap; gap: 32px; align-items: flex-start;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<TimePicker {...args} />
	{/snippet}
</Story>

<Story name="Steps" parameters={{ controls: { exclude: ['minuteStep'] } }}>
	{#snippet template({ value })}
		<div style={row}>
			{#each [1, 5, 15] as minuteStep (minuteStep)}
				<TimePicker {value} {minuteStep} />
			{/each}
		</div>
	{/snippet}
</Story>

<Story
	name="Test: picks hour and minute"
	tags={['!dev', '!autodocs']}
	args={{ minuteStep: 15 }}
	play={async ({ canvas, userEvent }) => {
		onselect.mockClear();
		const hours = canvas.getByRole('group', { name: 'Hours' });
		const minutes = canvas.getByRole('group', { name: 'Minutes' });
		await userEvent.click(within(hours).getByRole('button', { name: '14' }));
		await expect(onselect).toHaveBeenLastCalledWith('14:30');
		await userEvent.click(within(minutes).getByRole('button', { name: '45' }));
		await expect(onselect).toHaveBeenLastCalledWith('14:45');
		await userEvent.keyboard('{ArrowUp}');
		await expect(onselect).toHaveBeenLastCalledWith('14:30');
	}}
>
	{#snippet template(args)}
		<TimePicker {...args} {onselect} />
	{/snippet}
</Story>
