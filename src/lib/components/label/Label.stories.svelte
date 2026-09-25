<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import Label from './Label.svelte';
	import Checkbox from '../checkbox/Checkbox.svelte';
	import Input from '../input/Input.svelte';

	const { Story } = defineMeta({
		title: 'Components/Label',
		component: Label,
		tags: ['autodocs'],
		argTypes: {
			children: { control: false }
		}
	});

	const row = 'display: flex; align-items: center; gap: 8px;';
	const column = 'display: flex; flex-direction: column; gap: 8px; width: 280px;';
	const stack = 'display: flex; flex-direction: column; gap: 24px;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template()}
		<div style={row}>
			<Checkbox id="default-terms" />
			<Label for="default-terms">Accept terms and conditions</Label>
		</div>
	{/snippet}
</Story>

<Story name="Content">
	{#snippet template()}
		<div style={stack}>
			<div style={column}>
				<Label for="content-email">Email</Label>
				<Input id="content-email" type="email" placeholder="you@example.com" />
			</div>
			<div style={row}>
				<Checkbox id="content-updates" checked />
				<Label for="content-updates">Send me product updates</Label>
			</div>
			<Label>
				<Checkbox />
				Wrapping the control works without an id
			</Label>
		</div>
	{/snippet}
</Story>

<Story name="States">
	{#snippet template()}
		<div style={stack}>
			<div style={row}>
				<Checkbox id="states-disabled" disabled />
				<Label for="states-disabled">Disabled checkbox</Label>
			</div>
			<Label>
				<Checkbox disabled checked />
				Disabled, wrapped
			</Label>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: labels its control"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const checkbox = canvas.getByRole('checkbox', { name: 'Accept terms' });
		await userEvent.click(canvas.getByText('Accept terms'));
		await expect(checkbox).toBeChecked();
		await userEvent.click(canvas.getByText('Email'));
		await expect(canvas.getByRole('textbox', { name: 'Email' })).toHaveFocus();
	}}
>
	{#snippet template()}
		<div style={stack}>
			<div style={row}>
				<Checkbox id="test-terms" />
				<Label for="test-terms">Accept terms</Label>
			</div>
			<div style={column}>
				<Label for="test-email">Email</Label>
				<Input id="test-email" type="email" />
			</div>
		</div>
	{/snippet}
</Story>
