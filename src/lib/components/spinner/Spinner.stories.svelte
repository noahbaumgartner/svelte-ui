<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import Spinner from './Spinner.svelte';

	const sizes = ['sm', 'md', 'lg'] as const;

	const { Story } = defineMeta({
		title: 'Components/Spinner',
		component: Spinner,
		tags: ['autodocs'],
		argTypes: {
			size: { control: 'inline-radio', options: sizes },
			label: { control: 'text' }
		},
		args: {
			size: 'md'
		}
	});

	const row = 'display: flex; flex-wrap: wrap; gap: 16px; align-items: center;';
</script>

<Story name="Default" tags={['!dev']} />

<Story name="Sizes" parameters={{ controls: { exclude: ['size'] } }}>
	{#snippet template(args)}
		<div style={row}>
			{#each sizes as size (size)}
				<Spinner {...args} {size} />
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Color">
	{#snippet template(args)}
		<div style={row}>
			<span style="color: var(--color-text);"><Spinner {...args} /></span>
			<span style="color: var(--color-text-secondary);"><Spinner {...args} /></span>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: spinner is announced as status"
	tags={['!dev', '!autodocs']}
	args={{ label: 'Saving' }}
	play={async ({ canvas }) => {
		await expect(canvas.getByRole('status', { name: 'Saving' })).toBeInTheDocument();
	}}
/>
