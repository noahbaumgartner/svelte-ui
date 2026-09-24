<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import Kbd from './Kbd.svelte';
	import KbdGroup from './KbdGroup.svelte';
	import Button from '../button/Button.svelte';
	import { ArrowDown, ArrowUp, CornerDownLeft } from '../../icons.js';

	const { Story } = defineMeta({
		title: 'Components/Kbd',
		component: Kbd,
		tags: ['autodocs'],
		argTypes: {
			children: { control: false }
		}
	});

	const row = 'display: flex; flex-wrap: wrap; gap: 16px; align-items: center;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template()}
		<Kbd>⌘</Kbd>
	{/snippet}
</Story>

<Story name="Content">
	{#snippet template()}
		<div style={row}>
			<Kbd>⌘</Kbd>
			<Kbd>⇧</Kbd>
			<Kbd>⌥</Kbd>
			<Kbd>⌃</Kbd>
			<Kbd>Ctrl</Kbd>
			<Kbd>Esc</Kbd>
			<Kbd><CornerDownLeft aria-hidden="true" /></Kbd>
		</div>
	{/snippet}
</Story>

<Story name="Group">
	{#snippet template()}
		<div style="display: flex; flex-direction: column; gap: 12px;">
			<KbdGroup>
				<Kbd>⌘</Kbd>
				<Kbd>K</Kbd>
			</KbdGroup>
			<KbdGroup>
				<Kbd>Ctrl</Kbd>
				<span>+</span>
				<Kbd>B</Kbd>
			</KbdGroup>
			<KbdGroup>
				<Kbd><ArrowUp aria-label="Up" /></Kbd>
				<Kbd><ArrowDown aria-label="Down" /></Kbd>
				<span>to navigate</span>
			</KbdGroup>
		</div>
	{/snippet}
</Story>

<Story name="In Button">
	{#snippet template()}
		<div style={row}>
			<Button>Save <Kbd>⌘S</Kbd></Button>
			<Button variant="secondary">Accept <Kbd><CornerDownLeft aria-hidden="true" /></Kbd></Button>
			<Button variant="outline">Cancel <Kbd>Esc</Kbd></Button>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: renders kbd elements"
	tags={['!dev', '!autodocs']}
	play={async ({ canvasElement }) => {
		const group = canvasElement.querySelector('kbd.kbd-group');
		await expect(group).not.toBeNull();
		await expect(group!.querySelectorAll('kbd.kbd')).toHaveLength(2);
		await expect(group).toHaveTextContent('⌘ K');
	}}
>
	{#snippet template()}
		<KbdGroup>
			<Kbd>⌘</Kbd>
			<Kbd>K</Kbd>
		</KbdGroup>
	{/snippet}
</Story>
