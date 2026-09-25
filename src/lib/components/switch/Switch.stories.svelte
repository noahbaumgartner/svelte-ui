<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import Switch from './Switch.svelte';
	import Field from '../field/Field.svelte';
	import Label from '../label/Label.svelte';

	const { Story } = defineMeta({
		title: 'Components/Switch',
		component: Switch,
		tags: ['autodocs'],
		argTypes: {
			checked: { control: 'boolean' },
			disabled: { control: 'boolean' }
		},
		args: {
			checked: false,
			disabled: false
		}
	});

	const row = 'display: flex; flex-wrap: wrap; gap: 16px; align-items: center;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<Field orientation="horizontal">
			<Switch {...args} id="default-airplane" />
			<Label for="default-airplane">Airplane mode</Label>
		</Field>
	{/snippet}
</Story>

<Story name="States" parameters={{ controls: { exclude: ['checked', 'disabled'] } }}>
	{#snippet template()}
		<div style={row}>
			<Switch aria-label="Off" />
			<Switch aria-label="On" checked />
			<Switch aria-label="Invalid" aria-invalid="true" />
			<Switch aria-label="Disabled" disabled />
			<Switch aria-label="On and disabled" checked disabled />
		</div>
	{/snippet}
</Story>

<Story
	name="Test: toggles on label click"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const control = canvas.getByRole('switch', { name: 'Airplane mode' });
		await expect(control).not.toBeChecked();
		await userEvent.click(canvas.getByText('Airplane mode'));
		await expect(control).toBeChecked();
	}}
>
	{#snippet template(args)}
		<Field orientation="horizontal">
			<Switch {...args} id="test-airplane" />
			<Label for="test-airplane">Airplane mode</Label>
		</Field>
	{/snippet}
</Story>

<Story
	name="Test: toggles with keyboard"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const control = canvas.getByRole('switch', { name: 'Notifications' });
		await userEvent.tab();
		await expect(control).toHaveFocus();
		await userEvent.keyboard(' ');
		await expect(control).toBeChecked();
	}}
>
	{#snippet template(args)}
		<Switch {...args} aria-label="Notifications" />
	{/snippet}
</Story>
