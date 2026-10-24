<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Timeline from './Timeline.svelte';

	const items = [
		{
			period: '2023 - Today',
			title: 'Software Engineer',
			subtitle: 'Example Inc.',
			href: 'https://example.com',
			description: 'Working on a web application.'
		},
		{ period: '2019 - 2023', title: 'Apprentice', subtitle: 'Another Co.' }
	];

	const { Story } = defineMeta({
		title: 'Components/Timeline',
		component: Timeline,
		tags: ['autodocs']
	});
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<Timeline {...args} title="Experience" {items} />
	{/snippet}
</Story>
