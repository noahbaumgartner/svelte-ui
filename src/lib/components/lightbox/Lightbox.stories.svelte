<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn } from 'storybook/test';
	import Lightbox from './Lightbox.svelte';

	const src = 'https://picsum.photos/id/10/1200/640.jpg';
	const onclose = fn();

	const { Story } = defineMeta({
		title: 'Components/Lightbox',
		component: Lightbox,
		tags: ['autodocs'],
		parameters: { docs: { story: { inline: false, height: '420px' } } },
		argTypes: {
			src: { control: 'text' },
			alt: { control: 'text' },
			aspect: { control: 'number' },
			label: { control: 'text' },
			closeLabel: { control: 'text' },
			onclose: { control: false }
		},
		args: {
			src,
			alt: 'Forest',
			onclose
		}
	});
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<Lightbox {...args} />
	{/snippet}
</Story>

<Story name="Aspect" parameters={{ controls: { exclude: ['aspect', 'src'] } }}>
	{#snippet template(args)}
		<Lightbox
			{...args}
			src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3Crect width='4' height='3' fill='%23888'/%3E%3C/svg%3E"
			aspect={4 / 3}
		/>
	{/snippet}
</Story>

<Story name="Labels" parameters={{ controls: { exclude: ['label', 'closeLabel'] } }}>
	{#snippet template(args)}
		<Lightbox {...args} label="Bild" closeLabel="Schliessen" />
	{/snippet}
</Story>

<Story
	name="Test: closes on button and Escape"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		onclose.mockClear();
		await expect(canvas.getByRole('dialog', { name: 'Image' })).toBeVisible();
		await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
		await expect(onclose).toHaveBeenCalledOnce();
		await userEvent.keyboard('{Escape}');
		await expect(onclose).toHaveBeenCalledTimes(2);
	}}
>
	{#snippet template(args)}
		<Lightbox {...args} />
	{/snippet}
</Story>
