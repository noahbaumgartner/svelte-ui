<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import BarChart from './BarChart.svelte';

	const items = [
		{ label: 'Beer', value: 412 },
		{ label: 'Fries', value: 298 },
		{ label: 'Sausage', value: 241 },
		{ label: 'Lemonade', value: 160 },
		{ label: 'Coffee', value: 54 }
	];

	const { Story } = defineMeta({
		title: 'Components/BarChart',
		component: BarChart,
		tags: ['autodocs'],
		args: { items, label: 'Items sold' }
	});
</script>

<Story name="Default" />

<Story
	name="With detail"
	args={{ items: items.map((item) => ({ ...item, detail: `${Math.round(item.value / 11.65)}%` })) }}
/>

<Story name="Empty" args={{ items: [], labels: { empty: 'Nothing sold yet' } }} />

<Story
	name="Test: shows one row per item with its value"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		await expect(canvas.getAllByRole('listitem')).toHaveLength(items.length);
		await expect(canvas.getByText('Beer')).toBeInTheDocument();
		await expect(canvas.getByText('412')).toBeInTheDocument();
	}}
/>
