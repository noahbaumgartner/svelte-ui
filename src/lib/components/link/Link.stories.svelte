<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import Link from './Link.svelte';

	const { Story } = defineMeta({
		title: 'Components/Link',
		component: Link,
		tags: ['autodocs'],
		argTypes: {
			href: { control: 'text' },
			children: { control: false }
		},
		args: {
			href: 'https://svelte.dev'
		}
	});
</script>

<Story name="Inline">
	{#snippet template({ href })}
		<p style="max-width: 480px; margin: 0;">
			This library is built with <Link {href}>Svelte</Link> and uses icons from
			<Link href="https://lucide.dev">Lucide</Link>.
		</p>
	{/snippet}
</Story>

<Story name="Text sizes">
	{#snippet template({ href })}
		<div style="display: grid; gap: 12px;">
			<h2 style="margin: 0; font-size: 28px;"><Link {href}>Heading</Link></h2>
			<p style="margin: 0; font-size: 16px;"><Link {href}>Body text</Link></p>
			<small style="font-size: 12px;"><Link {href}>Small print</Link></small>
		</div>
	{/snippet}
</Story>

<Story name="Targets" parameters={{ controls: { exclude: ['href'] } }}>
	{#snippet template()}
		<div style="display: flex; gap: 16px;">
			<Link href="#section">Internal link</Link>
			<Link href="https://svelte.dev">External link</Link>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: inherits font size and color"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		const link = canvas.getByRole('link');
		const style = getComputedStyle(link);
		await expect(style.fontSize).toBe('23px');
		await expect(style.color).toBe('rgb(255, 0, 0)');
	}}
>
	{#snippet template({ href })}
		<p style="font-size: 23px; color: rgb(255, 0, 0);"><Link {href}>Link</Link></p>
	{/snippet}
</Story>

<Story
	name="Test: external link opens in new tab"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		const link = canvas.getByRole('link');
		await expect(link).toHaveAttribute('target', '_blank');
		await expect(link).toHaveAttribute('rel', 'noopener');
	}}
>
	{#snippet template()}
		<Link href="https://svelte.dev">Svelte</Link>
	{/snippet}
</Story>

<Story
	name="Test: internal link stays in tab"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		const link = canvas.getByRole('link');
		await expect(link).not.toHaveAttribute('target');
		await expect(link).not.toHaveAttribute('rel');
	}}
>
	{#snippet template()}
		<Link href="/about">About</Link>
	{/snippet}
</Story>
