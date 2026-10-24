<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Lightbox from './Lightbox.svelte';

	const { Story } = defineMeta({
		title: 'Components/Lightbox',
		component: Lightbox,
		tags: ['autodocs']
	});
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<Lightbox
			{...args}
			src="https://picsum.photos/id/10/1200/640.jpg"
			alt="Forest"
			onclose={() => {}}
		/>
	{/snippet}
</Story>
