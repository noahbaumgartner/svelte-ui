<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import Checkbox from './Checkbox.svelte';
	import Field from '../field/Field.svelte';
	import FieldLabel from '../field/FieldLabel.svelte';

	const { Story } = defineMeta({
		title: 'Components/Checkbox',
		component: Checkbox,
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
			<Checkbox {...args} id="default-terms" />
			<FieldLabel for="default-terms">Accept terms and conditions</FieldLabel>
		</Field>
	{/snippet}
</Story>

<Story name="States" parameters={{ controls: { exclude: ['checked', 'disabled'] } }}>
	{#snippet template()}
		<div style={row}>
			<Checkbox aria-label="Unchecked" />
			<Checkbox aria-label="Checked" checked />
			<Checkbox aria-label="Invalid" aria-invalid="true" />
			<Checkbox aria-label="Disabled" disabled />
			<Checkbox aria-label="Checked and disabled" checked disabled />
		</div>
	{/snippet}
</Story>

<Story
	name="Test: toggles on label click"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const checkbox = canvas.getByRole('checkbox', { name: 'Accept terms' });
		await expect(checkbox).not.toBeChecked();
		await userEvent.click(canvas.getByText('Accept terms'));
		await expect(checkbox).toBeChecked();
	}}
>
	{#snippet template(args)}
		<Field orientation="horizontal">
			<Checkbox {...args} id="test-terms" />
			<FieldLabel for="test-terms">Accept terms</FieldLabel>
		</Field>
	{/snippet}
</Story>
