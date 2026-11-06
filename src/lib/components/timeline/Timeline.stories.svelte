<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import Timeline from './Timeline.svelte';

	const items = [
		{
			period: '2023 - Today',
			title: 'Software Engineer',
			subtitle: 'Example Inc.',
			href: 'https://example.com',
			description: 'Working on a web application.'
		},
		{ period: '2019 - 2023', title: 'Apprentice', subtitle: 'Another Co.' }
	];

	const { Story } = defineMeta({
		title: 'Components/Timeline',
		component: Timeline,
		tags: ['autodocs'],
		argTypes: {
			title: { control: 'text' },
			items: { control: 'object' }
		},
		args: {
			title: 'Experience',
			items
		}
	});
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<Timeline {...args} />
	{/snippet}
</Story>

<Story name="Title" parameters={{ controls: { exclude: ['title'] } }}>
	{#snippet template(args)}
		<div style="display: grid; gap: 48px;">
			<Timeline {...args} title="Experience" />
			<Timeline {...args} title={undefined} />
		</div>
	{/snippet}
</Story>

<Story name="Items" parameters={{ controls: { exclude: ['items'] } }}>
	{#snippet template(args)}
		<Timeline
			{...args}
			items={[
				{ period: '2025', title: 'Title only' },
				{ period: '2024', title: 'With subtitle', subtitle: 'Example Inc.' },
				{
					period: '2023',
					title: 'With link',
					subtitle: 'Example Inc.',
					href: 'https://example.com'
				},
				{
					period: '2022',
					title: 'With description',
					subtitle: 'Example Inc.',
					description: 'Working on a web application.'
				}
			]}
		/>
	{/snippet}
</Story>

<Story
	name="Test: renders items and link"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent('Experience');
		await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(2);
		await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
		await expect(canvas.getByRole('link', { name: 'Example Inc.' })).toHaveAttribute(
			'href',
			'https://example.com'
		);
	}}
>
	{#snippet template(args)}
		<Timeline {...args} />
	{/snippet}
</Story>
