<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import MediaPreview from './MediaPreview.svelte';

	const image = 'https://picsum.photos/id/10/1200/640.jpg';
	const video = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
	const ratios = ['15 / 8', '16 / 9', '1 / 1'];

	const { Story } = defineMeta({
		title: 'Components/MediaPreview',
		component: MediaPreview,
		tags: ['autodocs'],
		argTypes: {
			src: { control: 'text' },
			alt: { control: 'text' },
			aspectRatio: { control: 'select', options: ratios },
			playLabel: { control: 'text' },
			pauseLabel: { control: 'text' }
		},
		args: {
			src: image,
			alt: 'Forest',
			aspectRatio: '15 / 8'
		}
	});

	const grid =
		'display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<MediaPreview {...args} />
	{/snippet}
</Story>

<Story name="Media" parameters={{ controls: { exclude: ['src', 'alt'] } }}>
	{#snippet template(args)}
		<div style={grid}>
			<MediaPreview {...args} src={image} alt="Image" />
			<MediaPreview {...args} src={video} alt="Video" />
		</div>
	{/snippet}
</Story>

<Story name="Aspect ratios" parameters={{ controls: { exclude: ['aspectRatio'] } }}>
	{#snippet template(args)}
		<div style={grid}>
			{#each ratios as aspectRatio (aspectRatio)}
				<MediaPreview {...args} {aspectRatio} />
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Labels" parameters={{ controls: { exclude: ['src', 'playLabel', 'pauseLabel'] } }}>
	{#snippet template(args)}
		<MediaPreview {...args} src={video} playLabel="Abspielen" pauseLabel="Pausieren" />
	{/snippet}
</Story>

<Story
	name="Test: images have no play button"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		await expect(canvas.getByRole('img', { name: 'Forest' })).toBeVisible();
		await expect(canvas.queryByRole('button')).toBeNull();
	}}
>
	{#snippet template(args)}
		<MediaPreview {...args} />
	{/snippet}
</Story>

<Story
	name="Test: video toggles between pause and play"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
		await expect(canvas.getByRole('button', { name: 'Play' })).toBeVisible();
		await userEvent.click(canvas.getByRole('button', { name: 'Play' }));
		await expect(canvas.getByRole('button', { name: 'Pause' })).toBeVisible();
	}}
>
	{#snippet template(args)}
		<MediaPreview {...args} src={video} />
	{/snippet}
</Story>
