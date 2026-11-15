<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import ActionBar from './ActionBar.svelte';
	import Button from '../button/Button.svelte';

	const { Story } = defineMeta({
		title: 'Components/ActionBar',
		component: ActionBar,
		tags: ['autodocs'],
		parameters: { layout: 'fullscreen' },
		argTypes: {
			summary: { control: false },
			children: { control: false }
		}
	});
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<ActionBar {...args}>
			{#snippet summary()}
				<strong>CHF 24.50</strong>
				<span style="color: var(--color-text-muted)"> · 3 items</span>
			{/snippet}
			<Button variant="secondary" size="lg">Back</Button>
			<Button size="lg">Review</Button>
		</ActionBar>
	{/snippet}
</Story>

<Story name="Summary only">
	{#snippet template(args)}
		<ActionBar {...args}>
			{#snippet summary()}Three items selected{/snippet}
		</ActionBar>
	{/snippet}
</Story>

<Story
	name="Sticks to the bottom"
	play={async ({ canvasElement }) => {
		const bar = canvasElement.querySelector('.action-bar');
		await expect(bar).not.toBeNull();
		await expect(getComputedStyle(bar!).position).toBe('fixed');
	}}
>
	{#snippet template(args)}
		<p style="padding: 24px;">The bar stays at the bottom edge of the viewport.</p>
		<ActionBar {...args}>
			{#snippet summary()}Summary{/snippet}
			<Button size="lg">Continue</Button>
		</ActionBar>
	{/snippet}
</Story>
