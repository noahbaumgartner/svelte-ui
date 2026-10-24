<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import MediaPreview from './MediaPreview.svelte';

	const { Story } = defineMeta({
		title: 'Components/MediaPreview',
		component: MediaPreview,
		tags: ['autodocs']
	});
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<MediaPreview {...args} src="https://picsum.photos/id/10/1200/640.jpg" alt="Forest" />
	{/snippet}
</Story>
