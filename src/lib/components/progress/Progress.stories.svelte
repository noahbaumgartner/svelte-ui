<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import Progress from './Progress.svelte';

	const sizes = ['sm', 'md'] as const;

	const { Story } = defineMeta({
		title: 'Components/Progress',
		component: Progress,
		tags: ['autodocs'],
		argTypes: {
			value: { control: { type: 'range', min: 0, max: 100 } },
			max: { control: 'number' },
			size: { control: 'inline-radio', options: sizes },
			label: { control: 'text' }
		},
		args: {
			value: 60,
			max: 100,
			size: 'md',
			label: 'Uploading'
		}
	});

	const column = 'display: flex; flex-direction: column; gap: 16px; max-width: 320px;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<div style={column}><Progress {...args} /></div>
	{/snippet}
</Story>

<Story name="Sizes" parameters={{ controls: { exclude: ['size'] } }}>
	{#snippet template(args)}
		<div style={column}>
			{#each sizes as size (size)}
				<Progress {...args} {size} />
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Values" parameters={{ controls: { exclude: ['value'] } }}>
	{#snippet template(args)}
		<div style={column}>
			{#each [0, 25, 50, 100] as value (value)}
				<Progress {...args} {value} />
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Indeterminate" parameters={{ controls: { exclude: ['value', 'max'] } }}>
	{#snippet template(args)}
		<div style={column}><Progress {...args} value={undefined} /></div>
	{/snippet}
</Story>

<Story
	name="Test: reports its value and clamps it"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		await expect(canvas.getByRole('progressbar', { name: 'Uploading' })).toHaveAttribute(
			'aria-valuenow',
			'3'
		);
		await expect(canvas.getByRole('progressbar', { name: 'Over' })).toHaveAttribute(
			'aria-valuenow',
			'4'
		);
		await expect(canvas.getByRole('progressbar', { name: 'Unknown' })).not.toHaveAttribute(
			'aria-valuenow'
		);
	}}
>
	{#snippet template(args)}
		<div style={column}>
			<Progress {...args} value={3} max={4} />
			<Progress {...args} value={9} max={4} label="Over" />
			<Progress {...args} value={undefined} label="Unknown" />
		</div>
	{/snippet}
</Story>
