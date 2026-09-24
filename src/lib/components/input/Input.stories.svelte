<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, waitFor, within } from 'storybook/test';
	import Input from './Input.svelte';

	const types = [
		'text',
		'email',
		'password',
		'tel',
		'url',
		'search',
		'number',
		'date',
		'time',
		'datetime-local',
		'month',
		'week',
		'color',
		'file'
	] as const;

	const { Story } = defineMeta({
		title: 'Components/Input',
		component: Input,
		tags: ['autodocs'],
		argTypes: {
			type: {
				control: 'select',
				options: types
			},
			placeholder: { control: 'text' },
			disabled: { control: 'boolean' }
		},
		args: {
			type: 'text',
			placeholder: 'Ada Lovelace',
			disabled: false
		}
	});

	const column = 'display: flex; flex-direction: column; gap: 12px; width: 280px;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<Input {...args} aria-label="Name" style="width: 280px;" />
	{/snippet}
</Story>

<Story name="Types" parameters={{ controls: { exclude: ['type'] } }}>
	{#snippet template(args)}
		<div style={column}>
			{#each types as type (type)}
				<Input {...args} {type} aria-label={type} placeholder={type} />
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="States" parameters={{ controls: { exclude: ['disabled'] } }}>
	{#snippet template(args)}
		<div style={column}>
			<Input {...args} aria-label="Empty" />
			<Input {...args} aria-label="Filled" value="Ada Lovelace" />
			<Input {...args} aria-label="Invalid" value="ada lovelace" aria-invalid="true" />
			<Input {...args} aria-label="Disabled" value="Ada Lovelace" disabled />
		</div>
	{/snippet}
</Story>

<Story
	name="Test: accepts typing"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const input = canvas.getByRole('textbox', { name: 'Name' });
		await userEvent.type(input, 'Ada');
		await expect(input).toHaveValue('Ada');
	}}
>
	{#snippet template(args)}
		<Input {...args} aria-label="Name" placeholder={undefined} />
	{/snippet}
</Story>

<Story
	name="Test: number buttons step the value"
	tags={['!dev', '!autodocs']}
	args={{ type: 'number' }}
	play={async ({ canvas, userEvent }) => {
		const input = canvas.getByRole('spinbutton', { name: 'Quantity' });
		await userEvent.click(canvas.getByRole('button', { name: 'Increase' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Increase' }));
		await expect(input).toHaveValue(3);
		await userEvent.click(canvas.getByRole('button', { name: 'Decrease' }));
		await expect(input).toHaveValue(2);
		await expect(input).toHaveFocus();
	}}
>
	{#snippet template(args)}
		<Input {...args} aria-label="Quantity" value={1} placeholder={undefined} />
	{/snippet}
</Story>

<Story
	name="Test: date picker fills the input"
	tags={['!dev', '!autodocs']}
	args={{ type: 'date' }}
	play={async ({ canvas, userEvent }) => {
		const input = canvas.getByLabelText('Start date');
		await userEvent.click(canvas.getByRole('button', { name: 'Choose date' }));
		const dialog = await canvas.findByRole('dialog', { name: 'Choose date' });
		await userEvent.click(within(dialog).getByRole('button', { name: /September 15, 2026/ }));
		await expect(input).toHaveValue('2026-09-15');
		await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
		await expect(input).toHaveFocus();
	}}
>
	{#snippet template(args)}
		<Input
			{...args}
			aria-label="Start date"
			value="2026-09-01"
			placeholder={undefined}
			lang="en-US"
		/>
	{/snippet}
</Story>

<Story
	name="Test: color opens the color picker"
	tags={['!dev', '!autodocs']}
	args={{ type: 'color' }}
	play={async ({ canvas, userEvent }) => {
		const input = canvas.getByLabelText('Brand color');
		await userEvent.click(input);
		const dialog = await canvas.findByRole('dialog', { name: 'Choose color' });
		const hex = within(dialog).getByRole('textbox', { name: 'Hex color' });
		await userEvent.clear(hex);
		await userEvent.type(hex, '#22c55e');
		await expect(input).toHaveValue('#22c55e');
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
	}}
>
	{#snippet template(args)}
		<Input {...args} aria-label="Brand color" value="#3b82f6" placeholder={undefined} />
	{/snippet}
</Story>
