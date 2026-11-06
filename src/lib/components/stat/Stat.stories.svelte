<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import Stat from './Stat.svelte';

	const { Story } = defineMeta({
		title: 'Components/Stat',
		component: Stat,
		tags: ['autodocs'],
		argTypes: {
			size: { control: 'inline-radio', options: ['md', 'lg'] },
			variant: { control: 'inline-radio', options: ['outline', 'secondary'] },
			hint: { control: 'text' }
		},
		args: { label: 'Revenue', value: 'CHF 4’280.50', hint: '312 orders', size: 'md' }
	});

	const row =
		'display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;';
</script>

<Story name="Default" />

<Story name="Group">
	{#snippet template(args)}
		<div style={row}>
			<Stat {...args} />
			<Stat {...args} label="Items sold" value={1204} hint={undefined} />
			<Stat {...args} variant="secondary" label="Open" value="CHF 86.00" />
		</div>
	{/snippet}
</Story>

<Story
	name="Test: exposes label and value as a description list"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		await expect(canvas.getByRole('term')).toHaveTextContent('Revenue');
		await expect(canvas.getAllByRole('definition')[0]).toHaveTextContent('CHF 4’280.50');
	}}
/>
