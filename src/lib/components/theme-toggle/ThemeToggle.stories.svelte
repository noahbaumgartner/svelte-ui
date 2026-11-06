<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import ThemeToggle from './ThemeToggle.svelte';

	const { Story } = defineMeta({
		title: 'Components/ThemeToggle',
		component: ThemeToggle,
		tags: ['autodocs'],
		argTypes: {
			labels: { control: 'object' }
		}
	});
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<ThemeToggle {...args} />
	{/snippet}
</Story>

<Story name="Labels" parameters={{ controls: { exclude: ['labels'] } }}>
	{#snippet template(args)}
		<ThemeToggle {...args} labels={{ light: 'Design: Hell', dark: 'Design: Dunkel' }} />
	{/snippet}
</Story>

<Story
	name="Test: toggles the theme"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		localStorage.removeItem('theme');
		const button = canvas.getByRole('button');
		const before = document.documentElement.dataset.theme;
		await userEvent.click(button);
		await expect(document.documentElement.dataset.theme).not.toBe(before);
		await expect(localStorage.getItem('theme')).toBe(document.documentElement.dataset.theme);
		await userEvent.click(button);
		await expect(localStorage.getItem('theme')).not.toBeNull();
		localStorage.removeItem('theme');
	}}
>
	{#snippet template(args)}
		<ThemeToggle {...args} />
	{/snippet}
</Story>
