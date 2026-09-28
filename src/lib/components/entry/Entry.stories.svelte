<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import Entry from './Entry.svelte';
	import Link from '../link/Link.svelte';
	import Badge from '../badge/Badge.svelte';

	const { Story } = defineMeta({
		title: 'Components/Entry',
		component: Entry,
		tags: ['autodocs'],
		argTypes: {
			title: { control: 'text' },
			meta: { control: 'text' }
		},
		args: {
			title: 'Master of Science in Engineering',
			meta: '2025 - Today'
		}
	});

	const description = 'Specialising in artificial intelligence and machine learning.';
	const stack = 'display: flex; flex-direction: column; gap: 16px; max-width: 640px;';
</script>

{#snippet link()}
	<Link href="https://www.zhaw.ch">Zurich University of Applied Sciences</Link>
{/snippet}

{#snippet badges()}
	<Badge>Svelte</Badge>
	<Badge>TypeScript</Badge>
{/snippet}

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<Entry {...args} footer={link}>{description}</Entry>
	{/snippet}
</Story>

<Story name="Content" parameters={{ controls: { exclude: ['meta'] } }}>
	{#snippet template(args)}
		<div style={stack}>
			<Entry {...args} footer={link}>{description}</Entry>
			<Entry {...args} footer={badges}>{description}</Entry>
			<Entry {...args}>{description}</Entry>
			<Entry {...args} meta={undefined} />
		</div>
	{/snippet}
</Story>

<Story
	name="Test: renders title as heading with footer"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		await expect(
			canvas.getByRole('heading', { level: 3, name: 'Master of Science in Engineering' })
		).toBeInTheDocument();
		await expect(canvas.getByText('2025 - Today')).toBeInTheDocument();
		await expect(
			canvas.getByRole('link', { name: 'Zurich University of Applied Sciences' })
		).toHaveAttribute('target', '_blank');
	}}
>
	{#snippet template(args)}
		<Entry {...args} footer={link}>{description}</Entry>
	{/snippet}
</Story>
