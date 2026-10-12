<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import MeshGradient from './MeshGradient.svelte';

	const { Story } = defineMeta({
		title: 'Components/MeshGradient',
		component: MeshGradient,
		tags: ['autodocs'],
		argTypes: {
			seed: { control: 'text' }
		},
		args: {
			colors: ['#d4d4d4', '#1a1a1a', '#bdbdbd'],
			seed: 'Portfolio'
		}
	});

	const palettes = [
		['#d4d4d4', '#1a1a1a', '#bdbdbd'],
		['#fde68a', '#f97316', '#a855f7'],
		['#bae6fd', '#0ea5e9', '#1e3a8a', '#e0f2fe']
	];
	const row = 'display: flex; flex-wrap: wrap; gap: 16px;';
	/* MeshGradient fills its container and has no radius of its own. */
	const frame = 'width: 200px; height: 200px;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<div style={frame}><MeshGradient {...args} /></div>
	{/snippet}
</Story>

<Story name="Colors" parameters={{ controls: { exclude: ['colors'] } }}>
	{#snippet template(args)}
		<div style={row}>
			{#each palettes as colors (colors.join())}
				<div style={frame}><MeshGradient {...args} {colors} /></div>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Seeds" parameters={{ controls: { exclude: ['seed'] } }}>
	{#snippet template(args)}
		<div style={row}>
			{#each ['Portfolio', 'Blog', 'Photos'] as seed (seed)}
				<div style={frame}><MeshGradient {...args} {seed} /></div>
			{/each}
		</div>
	{/snippet}
</Story>

<Story
	name="Test: renders one blob per colour"
	tags={['!dev', '!autodocs']}
	play={async ({ canvasElement }) => {
		await expect(canvasElement.querySelectorAll('.mesh-gradient-blob')).toHaveLength(3);
	}}
>
	{#snippet template(args)}
		<div style={frame}><MeshGradient {...args} /></div>
	{/snippet}
</Story>
