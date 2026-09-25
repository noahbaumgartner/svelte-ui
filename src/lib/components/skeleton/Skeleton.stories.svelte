<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import Skeleton from './Skeleton.svelte';
	import Card from '../card/Card.svelte';
	import CardContent from '../card/CardContent.svelte';
	import CardHeader from '../card/CardHeader.svelte';

	const { Story } = defineMeta({
		title: 'Components/Skeleton',
		component: Skeleton,
		tags: ['autodocs']
	});

	const column = 'display: flex; flex-direction: column; gap: 8px;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template()}
		<div style="display: flex; align-items: center; gap: 12px;">
			<Skeleton style="width: 40px; height: 40px; border-radius: 9999px;" />
			<div style={column}>
				<Skeleton style="width: 200px; height: 14px;" />
				<Skeleton style="width: 160px; height: 14px;" />
			</div>
		</div>
	{/snippet}
</Story>

<Story name="Shapes">
	{#snippet template()}
		<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
			<Skeleton style="width: 32px; height: 32px; border-radius: 9999px;" />
			<Skeleton style="width: 160px; height: 14px;" />
			<Skeleton style="width: 96px; height: 32px;" />
			<Skeleton style="width: 120px; height: 80px;" />
		</div>
	{/snippet}
</Story>

<Story name="In Card">
	{#snippet template()}
		<Card style="max-width: 320px;">
			<CardHeader>
				<Skeleton style="width: 60%; height: 16px;" />
				<Skeleton style="width: 40%; height: 12px;" />
			</CardHeader>
			<CardContent>
				<Skeleton style="height: 140px; border-radius: 10px;" />
			</CardContent>
			<CardContent>
				<div style={column}>
					<Skeleton style="height: 12px;" />
					<Skeleton style="height: 12px;" />
					<Skeleton style="width: 80%; height: 12px;" />
				</div>
			</CardContent>
		</Card>
	{/snippet}
</Story>

<Story
	name="Test: skeleton is hidden from assistive technology"
	tags={['!dev', '!autodocs']}
	play={async ({ canvasElement }) => {
		const skeleton = canvasElement.querySelector('.skeleton');
		await expect(skeleton).toHaveAttribute('aria-hidden', 'true');
		await expect(skeleton).toBeEmptyDOMElement();
	}}
>
	{#snippet template()}
		<Skeleton style="width: 100px; height: 14px;" />
	{/snippet}
</Story>
