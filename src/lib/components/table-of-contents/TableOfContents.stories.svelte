<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TableOfContents from './TableOfContents.svelte';

	let container: HTMLElement | undefined = $state();

	const { Story } = defineMeta({
		title: 'Components/TableOfContents',
		component: TableOfContents,
		tags: ['autodocs']
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
