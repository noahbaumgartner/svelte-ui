<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import { PersonStanding } from '@lucide/svelte';
	import PreviewCard from './PreviewCard.svelte';
	import MeshGradient from '../mesh-gradient/MeshGradient.svelte';

	const orientations = ['vertical', 'horizontal'] as const;

	const { Story } = defineMeta({
		title: 'Components/PreviewCard',
		component: PreviewCard,
		tags: ['autodocs'],
		argTypes: {
			orientation: { control: 'inline-radio', options: orientations },
			href: { control: 'text' },
			title: { control: 'text' },
			description: { control: 'text' },
			meta: { control: 'text' }
		},
		args: {
			orientation: 'vertical',
			href: '/posts/portfolio',
			title: 'Portfolio',
			description: 'Personal portfolio with a project overview and information about me.',
			meta: 'August 2026',
			icon: PersonStanding
		}
	});

	const colors = ['#d4d4d4', '#1a1a1a', '#bdbdbd'];
</script>

{#snippet mesh()}
	<MeshGradient {colors} seed="Portfolio" />
{/snippet}

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<div style="max-width: 360px;">
			<PreviewCard {...args} media={mesh} />
		</div>
	{/snippet}
</Story>

<Story name="Orientations" parameters={{ controls: { exclude: ['orientation'] } }}>
	{#snippet template(args)}
		<div style="display: flex; flex-direction: column; gap: 40px; max-width: 640px;">
			<div style="max-width: 360px;">
				<PreviewCard {...args} orientation="vertical" media={mesh} />
			</div>
			<PreviewCard {...args} orientation="horizontal" media={mesh} />
		</div>
	{/snippet}
</Story>

<Story name="Content" parameters={{ controls: { exclude: ['icon', 'description', 'meta'] } }}>
	{#snippet template(args)}
		<div style="display: flex; flex-direction: column; gap: 24px; max-width: 640px;">
			<PreviewCard {...args} orientation="horizontal" media={mesh} />
			<PreviewCard {...args} orientation="horizontal" icon={undefined} media={mesh} />
			<PreviewCard
				{...args}
				orientation="horizontal"
				description={undefined}
				meta={undefined}
				media={mesh}
			/>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: renders as a link with its text"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		const link = canvas.getByRole('link');
		await expect(link).toHaveAttribute('href', '/posts/portfolio');
		await expect(link).toHaveTextContent('Portfolio:');
		await expect(link).toHaveTextContent('August 2026');
	}}
>
	{#snippet template(args)}
		<PreviewCard {...args} media={mesh} />
	{/snippet}
</Story>

<Story
	name="Test: renders without link"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		await expect(canvas.queryByRole('link')).toBeNull();
	}}
>
	{#snippet template(args)}
		<PreviewCard {...args} href={undefined} media={mesh} />
	{/snippet}
</Story>
