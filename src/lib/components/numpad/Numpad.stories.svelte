<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent } from 'storybook/test';
	import Numpad from './Numpad.svelte';

	const { Story } = defineMeta({
		title: 'Components/Numpad',
		component: Numpad,
		tags: ['autodocs'],
		argTypes: {
			decimals: { control: { type: 'number', min: 0, max: 3 } },
			separator: { control: 'inline-radio', options: ['.', ','] },
			disabled: { control: 'boolean' }
		},
		args: { decimals: 2, label: 'Amount' }
	});
</script>

<script lang="ts">
	let value = $state('');
</script>

<Story name="Default">
	{#snippet template(args)}
		<div style="max-width: 280px; display: grid; gap: 12px;">
			<output style="font-size: 28px; text-align: right;">{value || '0'}</output>
			<Numpad {...args} bind:value />
		</div>
	{/snippet}
</Story>

<Story name="Integers" args={{ decimals: 0 }} />

<Story
	name="Test: types digits, one separator and limits decimals"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		for (const key of ['1', '2', '.', '.', '5', '0', '9']) {
			await userEvent.click(canvas.getByRole('button', { name: key }));
		}
		await expect(canvas.getByTestId('value')).toHaveTextContent('12.50');
		await userEvent.click(canvas.getByRole('button', { name: 'Delete' }));
		await expect(canvas.getByTestId('value')).toHaveTextContent('12.5');
	}}
>
	{#snippet template(args)}
		<output data-testid="value">{value}</output>
		<Numpad {...args} bind:value />
	{/snippet}
</Story>
