<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import Separator from './Separator.svelte';

	const orientations = ['horizontal', 'vertical'] as const;

	const { Story } = defineMeta({
		title: 'Components/Separator',
		component: Separator,
		tags: ['autodocs'],
		argTypes: {
			orientation: { control: 'inline-radio', options: orientations },
			decorative: { control: 'boolean' }
		},
		args: {
			orientation: 'horizontal',
			decorative: true
		}
	});

	const column = 'display: flex; flex-direction: column; gap: 12px; max-width: 320px;';
	const row = 'display: flex; align-items: center; gap: 12px; height: 20px;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template({ orientation, decorative })}
		<div style={orientation === 'vertical' ? row : column}>
			<span>Svelte UI</span>
			<Separator {orientation} {decorative} />
			<span>Components</span>
		</div>
	{/snippet}
</Story>

<Story name="Orientations" parameters={{ controls: { exclude: ['orientation'] } }}>
	{#snippet template({ decorative })}
		<div style={column}>
			<div>
				<strong>Svelte UI</strong>
				<div style="color: var(--color-text-muted);">An open-source component library.</div>
			</div>
			<Separator {decorative} />
			<div style={row}>
				<span>Blog</span>
				<Separator orientation="vertical" {decorative} />
				<span>Docs</span>
				<Separator orientation="vertical" {decorative} />
				<span>Source</span>
			</div>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: decorative separator is hidden from assistive technology"
	tags={['!dev', '!autodocs']}
	play={async ({ canvasElement }) => {
		const separator = canvasElement.querySelector('.separator');
		await expect(separator).toHaveAttribute('role', 'none');
		await expect(separator).not.toHaveAttribute('aria-orientation');
	}}
>
	{#snippet template()}
		<Separator />
	{/snippet}
</Story>

<Story
	name="Test: semantic vertical separator exposes its orientation"
	tags={['!dev', '!autodocs']}
	play={async ({ canvasElement }) => {
		const separator = canvasElement.querySelector('.separator');
		await expect(separator).toHaveAttribute('role', 'separator');
		await expect(separator).toHaveAttribute('aria-orientation', 'vertical');
		await expect(getComputedStyle(separator!).width).toBe('1px');
	}}
>
	{#snippet template()}
		<div style={row}>
			<span>A</span>
			<Separator orientation="vertical" decorative={false} />
			<span>B</span>
		</div>
	{/snippet}
</Story>
