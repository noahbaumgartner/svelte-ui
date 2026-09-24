<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, waitFor } from 'storybook/test';
	import Avatar from './Avatar.svelte';

	const sizes = ['sm', 'md', 'lg'] as const;

	const photo = `data:image/svg+xml,${encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#f97316"/><stop offset=".6" stop-color="#a855f7"/><stop offset="1" stop-color="#0ea5e9"/></linearGradient></defs><rect width="1" height="1" fill="url(#g)"/></svg>'
	)}`;

	const { Story } = defineMeta({
		title: 'Components/Avatar',
		component: Avatar,
		tags: ['autodocs'],
		argTypes: {
			size: { control: 'inline-radio', options: sizes },
			src: { control: 'text' },
			alt: { control: 'text' },
			fallback: { control: 'text' }
		},
		args: {
			size: 'md',
			src: photo,
			alt: 'Noah Baumgartner',
			fallback: 'NB'
		}
	});

	const row = 'display: flex; flex-wrap: wrap; gap: 8px; align-items: center;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<Avatar {...args} />
	{/snippet}
</Story>

<Story name="Sizes" parameters={{ controls: { exclude: ['size'] } }}>
	{#snippet template(args)}
		<div style={row}>
			{#each sizes as size (size)}
				<Avatar {...args} {size} />
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Content" parameters={{ controls: { exclude: ['src', 'fallback'] } }}>
	{#snippet template(args)}
		<div style={row}>
			<Avatar {...args} />
			<Avatar {...args} src={undefined} />
			<Avatar {...args} src={undefined} fallback={undefined} />
		</div>
	{/snippet}
</Story>

<Story
	name="Test: shows image with alt text"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		const image = canvas.getByRole('img', { name: 'Noah Baumgartner' });
		await expect(image.tagName).toBe('IMG');
	}}
>
	{#snippet template(args)}
		<Avatar {...args} />
	{/snippet}
</Story>

<Story
	name="Test: falls back when image fails to load"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		await waitFor(() => expect(canvas.getByText('NB')).toBeInTheDocument());
		await expect(canvas.getByRole('img', { name: 'Noah Baumgartner' }).tagName).toBe('SPAN');
	}}
>
	{#snippet template(args)}
		<Avatar {...args} src="data:image/png;base64,broken" />
	{/snippet}
</Story>
