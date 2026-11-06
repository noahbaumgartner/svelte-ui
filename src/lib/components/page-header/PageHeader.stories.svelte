<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import PageHeader from './PageHeader.svelte';
	import Button from '../button/Button.svelte';
	import MediaPreview from '../media-preview/MediaPreview.svelte';

	const { Story } = defineMeta({
		title: 'Components/PageHeader',
		component: PageHeader,
		tags: ['autodocs'],
		argTypes: {
			eyebrow: { control: 'text' },
			title: { control: 'text' },
			description: { control: 'text' },
			children: { control: false },
			footer: { control: false }
		},
		args: {
			eyebrow: 'Portfolio',
			title: 'Hello, I am Noah',
			description: 'I build software.'
		}
	});
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<PageHeader {...args} />
	{/snippet}
</Story>

<Story name="Content" parameters={{ controls: { exclude: ['eyebrow', 'description'] } }}>
	{#snippet template(args)}
		<PageHeader {...args} />
		<PageHeader {...args} eyebrow={undefined} />
		<PageHeader {...args} description={undefined} />
		<PageHeader {...args} eyebrow={undefined} description={undefined} />
	{/snippet}
</Story>

<Story name="Snippets" parameters={{ controls: { exclude: ['title', 'description'] } }}>
	{#snippet template(args)}
		<PageHeader {...args}>
			{#snippet title()}Hello, <em>I am Noah</em>{/snippet}
			{#snippet description()}I build <strong>software</strong>.{/snippet}
		</PageHeader>
	{/snippet}
</Story>

<Story name="Children and footer" parameters={{ controls: { exclude: ['children', 'footer'] } }}>
	{#snippet template(args)}
		<PageHeader {...args}>
			<div style="margin-top: 24px; width: 100%;">
				<MediaPreview src="https://picsum.photos/id/10/1200/640.jpg" alt="Forest" />
			</div>
			{#snippet footer()}
				<div style="display: flex; justify-content: center; padding-bottom: 24px;">
					<Button variant="secondary">Contact</Button>
				</div>
			{/snippet}
		</PageHeader>
	{/snippet}
</Story>

<Story
	name="Test: renders heading and description"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent('Hello, I am Noah');
		await expect(canvas.getByText('Portfolio')).toBeVisible();
		await expect(canvas.getByText('I build software.')).toBeVisible();
	}}
>
	{#snippet template(args)}
		<PageHeader {...args} />
	{/snippet}
</Story>
