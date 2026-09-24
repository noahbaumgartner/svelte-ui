<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn } from 'storybook/test';
	import ColorPicker from './ColorPicker.svelte';

	const onselect = fn();

	const { Story } = defineMeta({
		title: 'Components/ColorPicker',
		component: ColorPicker,
		tags: ['autodocs'],
		argTypes: {
			value: { control: 'color' }
		},
		args: {
			value: '#3b82f6'
		}
	});

	const row = 'display: flex; flex-wrap: wrap; gap: 32px; align-items: flex-start;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<ColorPicker {...args} />
	{/snippet}
</Story>

<Story name="Values" parameters={{ controls: { exclude: ['value'] } }}>
	{#snippet template()}
		<div style={row}>
			{#each ['#ef4444', '#22c55e', '#000000', '#ffffff'] as value (value)}
				<ColorPicker {value} />
			{/each}
		</div>
	{/snippet}
</Story>

<Story
	name="Test: hex field and keyboard update the color"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		onselect.mockClear();
		const hex = canvas.getByRole('textbox', { name: 'Hex color' });
		await userEvent.clear(hex);
		await userEvent.type(hex, '#ff0000');
		await expect(onselect).toHaveBeenLastCalledWith('#ff0000');
		canvas.getByRole('slider', { name: 'Hue' }).focus();
		await userEvent.keyboard('{Shift>}{ArrowRight}{ArrowRight}{/Shift}');
		await expect(onselect).toHaveBeenLastCalledWith('#ff5500');
	}}
>
	{#snippet template(args)}
		<ColorPicker {...args} {onselect} />
	{/snippet}
</Story>
