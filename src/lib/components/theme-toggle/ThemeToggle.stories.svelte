<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ThemeToggle from './ThemeToggle.svelte';

	const { Story } = defineMeta({
		title: 'Components/ThemeToggle',
		component: ThemeToggle,
		tags: ['autodocs']
	});
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<ThemeToggle {...args} />
	{/snippet}
</Story>
