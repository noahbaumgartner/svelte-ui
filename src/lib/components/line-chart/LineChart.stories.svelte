<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import LineChart from './LineChart.svelte';

	const hours = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];
	const data = hours.map((label, i) => ({
		label,
		value: [120, 340, 980, 1640, 1210, 860, 1420, 690, 210][i]
	}));

	const { Story } = defineMeta({
		title: 'Components/LineChart',
		component: LineChart,
		tags: ['autodocs'],
		argTypes: {
			height: { control: { type: 'range', min: 120, max: 480 } },
			area: { control: 'boolean' }
		},
		args: { data, label: 'Revenue per half hour', height: 240, format: (v: number) => `${v}` }
	});
</script>

<Story name="Default" />

<Story name="Single point" args={{ data: [{ label: '18:00', value: 50 }] }} />

<Story name="Empty" args={{ data: [], labels: { empty: 'No orders yet' } }} />

<Story
	name="Test: lists the data for screen readers"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		await expect(canvas.getByRole('img', { name: 'Revenue per half hour' })).toBeInTheDocument();
		await expect(canvas.getByRole('table')).toHaveTextContent('18:30');
		await expect(canvas.getAllByRole('row')).toHaveLength(hours.length + 1);
	}}
/>
