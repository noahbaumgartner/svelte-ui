<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import Image from './Image.svelte';

	const photo = `data:image/svg+xml,${encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#f97316"/><stop offset=".6" stop-color="#a855f7"/><stop offset="1" stop-color="#0ea5e9"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/></svg>'
	)}`;

	const { Story } = defineMeta({
		title: 'Components/Image',
		component: Image,
		tags: ['autodocs'],
		argTypes: {
			src: { control: 'text' },
			alt: { control: 'text' },
			ratio: { control: 'text' },
			fit: { control: 'inline-radio', options: ['cover', 'contain'] }
		},
		args: {
			src: photo,
			alt: 'A gradient from orange to blue',
			width: 400,
			height: 300
		}
	});

	const frame = 'width: 240px;';
	const row = 'display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<div style={frame}><Image {...args} /></div>
	{/snippet}
</Story>

<Story name="Ratio" parameters={{ controls: { exclude: ['ratio'] } }}>
	{#snippet template(args)}
		<div style={row}>
			<div style={frame}><Image {...args} /></div>
			<div style={frame}><Image {...args} ratio={1} /></div>
			<div style={frame}><Image {...args} ratio="16 / 9" /></div>
		</div>
	{/snippet}
</Story>

<Story name="Fit" parameters={{ controls: { exclude: ['fit'] } }}>
	{#snippet template(args)}
		<div style={row}>
			<div style={frame}><Image {...args} ratio={1} fit="cover" /></div>
			<div style={frame}><Image {...args} ratio={1} fit="contain" /></div>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: renders with alt text and lazy loading"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		const image = canvas.getByRole('img', { name: 'A gradient from orange to blue' });
		await expect(image).toHaveAttribute('loading', 'lazy');
	}}
>
	{#snippet template(args)}
		<div style={frame}><Image {...args} /></div>
	{/snippet}
</Story>
