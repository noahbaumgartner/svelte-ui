<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import ButtonGroup from './ButtonGroup.svelte';
	import Button from '../button/Button.svelte';
	import ContextMenu from '../context-menu/ContextMenu.svelte';
	import ContextMenuItem from '../context-menu/ContextMenuItem.svelte';
	import {
		AlignCenter,
		AlignLeft,
		AlignRight,
		ChevronDown,
		ChevronLeft,
		ChevronRight,
		Copy,
		Pencil,
		Trash
	} from '../../icons.js';

	const orientations = ['horizontal', 'vertical'] as const;
	const variants = ['secondary', 'outline', 'primary'] as const;

	const { Story } = defineMeta({
		title: 'Components/ButtonGroup',
		component: ButtonGroup,
		tags: ['autodocs'],
		argTypes: {
			orientation: { control: 'inline-radio', options: orientations },
			label: { control: 'text' },
			children: { control: false }
		},
		args: {
			orientation: 'horizontal',
			label: 'Text alignment'
		},
		parameters: {
			docs: { story: { height: '200px' } }
		}
	});

	const row = 'display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template({ orientation, label })}
		<ButtonGroup {orientation} {label}>
			<Button variant="secondary" icon={AlignLeft}>Left</Button>
			<Button variant="secondary" icon={AlignCenter}>Center</Button>
			<Button variant="secondary" icon={AlignRight}>Right</Button>
		</ButtonGroup>
	{/snippet}
</Story>

<Story name="Variants">
	{#snippet template({ orientation, label })}
		<div style={row}>
			{#each variants as variant (variant)}
				<ButtonGroup {orientation} {label}>
					<Button {variant} icon={AlignLeft}>Left</Button>
					<Button {variant} icon={AlignCenter}>Center</Button>
					<Button {variant} icon={AlignRight}>Right</Button>
				</ButtonGroup>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Orientations" parameters={{ controls: { exclude: ['orientation'] } }}>
	{#snippet template({ label })}
		<div style={row}>
			{#each orientations as orientation (orientation)}
				<ButtonGroup {orientation} {label}>
					<Button variant="secondary" icon={AlignLeft}>Left</Button>
					<Button variant="secondary" icon={AlignCenter}>Center</Button>
					<Button variant="secondary" icon={AlignRight}>Right</Button>
				</ButtonGroup>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Content" parameters={{ controls: { exclude: ['label'] } }}>
	{#snippet template({ orientation })}
		<div style={row}>
			<ButtonGroup {orientation} label="Pagination">
				<Button variant="secondary" icon={ChevronLeft} label="Previous" />
				<Button variant="secondary" icon={ChevronRight} label="Next" />
			</ButtonGroup>
			<ButtonGroup {orientation} label="Save">
				<Button>Save</Button>
				<ContextMenu align="end">
					{#snippet trigger(props)}
						<Button {...props} icon={ChevronDown} label="More save options" />
					{/snippet}
					<ContextMenuItem icon={Copy}>Save as copy</ContextMenuItem>
					<ContextMenuItem icon={Pencil}>Save and rename</ContextMenuItem>
					<ContextMenuItem icon={Trash}>Discard changes</ContextMenuItem>
				</ContextMenu>
			</ButtonGroup>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: exposes a labelled group"
	tags={['!dev', '!autodocs']}
	args={{ orientation: 'vertical' }}
	play={async ({ canvas }) => {
		await expect(canvas.getByRole('group', { name: 'Text alignment' })).toBeVisible();
		await expect(canvas.getAllByRole('button')).toHaveLength(3);
	}}
>
	{#snippet template({ orientation, label })}
		<ButtonGroup {orientation} {label}>
			<Button variant="secondary">Left</Button>
			<Button variant="secondary">Center</Button>
			<Button variant="secondary">Right</Button>
		</ButtonGroup>
	{/snippet}
</Story>
