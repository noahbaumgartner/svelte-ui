<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn, userEvent } from 'storybook/test';
	import Steps from './Steps.svelte';

	const steps = [{ label: 'Table' }, { label: 'Items' }, { label: 'Send' }, { label: 'Pay' }];

	const { Story } = defineMeta({
		title: 'Components/Steps',
		component: Steps,
		tags: ['autodocs'],
		argTypes: {
			current: { control: { type: 'range', min: 0, max: 3 } },
			label: { control: 'text' }
		},
		args: { steps, current: 1, label: 'Order' }
	});
</script>

<Story name="Default" />

<Story name="Clickable" args={{ current: 2, onselect: fn() }} />

<Story
	name="Test: marks the current step and selects done steps"
	tags={['!dev', '!autodocs']}
	args={{ current: 2, onselect: fn() }}
	play={async ({ args, canvas }) => {
		const current = canvas.getByText('Send').closest('li');
		await expect(current).toHaveAttribute('aria-current', 'step');
		await userEvent.click(canvas.getByRole('button', { name: /Items/ }));
		await expect(args.onselect).toHaveBeenCalledWith(1);
		await expect(canvas.queryByRole('button', { name: /Pay/ })).toBeNull();
	}}
/>
