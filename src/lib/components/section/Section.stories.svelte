<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import Section from './Section.svelte';

	const { Story } = defineMeta({
		title: 'Components/Section',
		component: Section,
		tags: ['autodocs'],
		argTypes: {
			width: { control: 'inline-radio', options: ['contained', 'full'] },
			padded: { control: 'boolean' },
			surface: { control: 'boolean' }
		},
		args: {
			width: 'contained'
		}
	});

	const content = 'min-height: 120px; display: grid; place-items: center; padding: 24px;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<Section {...args}>
			<div style={content}>Content</div>
		</Section>
	{/snippet}
</Story>

<Story name="Contained" parameters={{ controls: { exclude: ['width'] } }}>
	{#snippet template(args)}
		<Section {...args} width="contained">
			<div style={content}>An inset, rounded box that keeps the page gutters.</div>
		</Section>
	{/snippet}
</Story>

<Story name="Full" parameters={{ controls: { exclude: ['width'] } }}>
	{#snippet template(args)}
		<Section {...args} width="full">
			<div style={content}>A band from edge to edge; the content stays at the max width.</div>
		</Section>
	{/snippet}
</Story>

<Story name="Surface" parameters={{ controls: { exclude: ['surface'] } }}>
	{#snippet template(args)}
		<div style="display: grid; gap: 16px;">
			<Section {...args} surface>
				<div style={content}>With the surface colour.</div>
			</Section>
			<Section {...args} surface={false}>
				<div style={content}>On the page background.</div>
			</Section>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: renders a section with its content"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		await expect(canvas.getByText('Content')).toBeInTheDocument();
	}}
>
	{#snippet template(args)}
		<Section {...args}>
			<div style={content}>Content</div>
		</Section>
	{/snippet}
</Story>
