<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import TableOfContents from './TableOfContents.svelte';

	let container: HTMLElement | undefined = $state();
	let variantsContainer: HTMLElement | undefined = $state();
	let testContainer: HTMLElement | undefined = $state();

	const variants = ['sidebar', 'mobile'] as const;

	const { Story } = defineMeta({
		title: 'Components/TableOfContents',
		component: TableOfContents,
		tags: ['autodocs'],
		argTypes: {
			variant: { control: 'inline-radio', options: variants },
			container: { control: false }
		},
		args: {
			variant: 'sidebar'
		}
	});
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<div bind:this={container}>
			<h2>First</h2>
			<h2>Second</h2>
		</div>
		<TableOfContents {...args} {container} />
	{/snippet}
</Story>

<Story name="Variants" parameters={{ controls: { exclude: ['variant'] } }}>
	{#snippet template(args)}
		<div bind:this={variantsContainer}>
			<h2>First</h2>
			<h2>Second</h2>
		</div>
		<div style="display: grid; gap: 24px;">
			{#each variants as variant (variant)}
				<TableOfContents {...args} {variant} container={variantsContainer} />
			{/each}
		</div>
	{/snippet}
</Story>

<Story
	name="Test: lists the headings"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		const nav = await canvas.findByRole('navigation', { name: 'Inhaltsverzeichnis' });
		await expect(nav).toBeVisible();
		await expect(canvas.getByRole('link', { name: 'First' })).toHaveAttribute('href', '#first');
		await expect(canvas.getByRole('link', { name: 'Second' })).toHaveAttribute('href', '#second');
	}}
>
	{#snippet template(args)}
		<div bind:this={testContainer}>
			<h2>First</h2>
			<h2>Second</h2>
		</div>
		<TableOfContents {...args} container={testContainer} />
	{/snippet}
</Story>
