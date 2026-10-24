<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import PageHeader from './PageHeader.svelte';

	const { Story } = defineMeta({
		title: 'Components/PageHeader',
		component: PageHeader,
		tags: ['autodocs']
	});
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<PageHeader
			{...args}
			eyebrow="Portfolio"
			title="Hello, I am Noah"
			description="I build software."
		/>
	{/snippet}
</Story>
