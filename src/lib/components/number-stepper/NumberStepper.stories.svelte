<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn } from 'storybook/test';
	import NumberStepper from './NumberStepper.svelte';

	const sizes = ['sm', 'md', 'lg'] as const;

	const { Story } = defineMeta({
		title: 'Components/NumberStepper',
		component: NumberStepper,
		tags: ['autodocs'],
		argTypes: {
			value: { control: 'number' },
			min: { control: 'number' },
			max: { control: 'number' },
			step: { control: 'number' },
			size: { control: 'inline-radio', options: sizes },
			disabled: { control: 'boolean' },
			label: { control: 'text' }
		},
		args: {
			value: 2,
			min: 0,
			max: 10,
			step: 1,
			size: 'sm',
			disabled: false,
			label: 'Guests'
		}
	});

	const row = 'display: flex; flex-wrap: wrap; gap: 24px; align-items: center;';
	const onchange = fn();
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<NumberStepper {...args} />
	{/snippet}
</Story>

<Story name="Sizes" parameters={{ controls: { exclude: ['size'] } }}>
	{#snippet template(args)}
		<div style={row}>
			{#each sizes as size (size)}
				<NumberStepper {...args} {size} label="Guests {size}" />
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="States" parameters={{ controls: { exclude: ['value', 'disabled'] } }}>
	{#snippet template(args)}
		<div style={row}>
			<NumberStepper {...args} value={args.min} label="At the minimum" />
			<NumberStepper {...args} value={args.max} label="At the maximum" />
			<NumberStepper {...args} disabled label="Disabled" />
		</div>
	{/snippet}
</Story>

<Story
	name="Test: counts up and down within its limits"
	tags={['!dev', '!autodocs']}
	args={{ value: 1, max: 2 }}
	play={async ({ canvas, userEvent }) => {
		onchange.mockClear();
		const group = canvas.getByRole('group', { name: 'Guests' });
		const value = canvas.getByRole('status');
		const increase = canvas.getByRole('button', { name: 'Increase Guests' });
		const decrease = canvas.getByRole('button', { name: 'Decrease Guests' });
		await expect(group).toBeVisible();
		await userEvent.click(increase);
		await expect(value).toHaveTextContent('2');
		await expect(onchange).toHaveBeenLastCalledWith(2);
		await expect(increase).toBeDisabled();
		await userEvent.click(decrease);
		await userEvent.click(decrease);
		await expect(value).toHaveTextContent('0');
		await expect(decrease).toBeDisabled();
	}}
>
	{#snippet template(args)}
		<NumberStepper {...args} {onchange} />
	{/snippet}
</Story>
