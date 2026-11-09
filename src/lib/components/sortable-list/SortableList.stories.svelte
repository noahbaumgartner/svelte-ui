<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn, userEvent, within } from 'storybook/test';
	import Card from '../card/Card.svelte';
	import CardContent from '../card/CardContent.svelte';
	import CardHeader from '../card/CardHeader.svelte';
	import CardTitle from '../card/CardTitle.svelte';
	import SortableList from './SortableList.svelte';

	type Song = { id: number; title: string; artist: string };

	const songs: Song[] = [
		{ id: 1, title: 'Morning Light', artist: 'The Harbors' },
		{ id: 2, title: 'Paper Planes', artist: 'Juno Field' },
		{ id: 3, title: 'Low Tide', artist: 'The Harbors' },
		{ id: 4, title: 'Northbound', artist: 'Ada Wren' }
	];

	const { Story } = defineMeta({
		title: 'Components/SortableList',
		component: SortableList,
		tags: ['autodocs'],
		argTypes: { disabled: { control: 'boolean' } },
		args: { disabled: false }
	});

	const onreorder = fn();
	const row =
		'display: flex; align-items: center; gap: 8px; min-height: 48px; border-bottom: 1px solid var(--color-border); background: var(--color-bg); font-size: 14px;';
</script>

<Story
	name="Default"
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const handle = canvas.getByRole('button', { name: 'Move Morning Light' });
		handle.focus();
		await userEvent.keyboard('{ArrowDown}');
		await expect(onreorder).toHaveBeenCalled();
		await expect(canvas.getAllByRole('listitem')[1]).toHaveTextContent('Morning Light');
		await expect(canvas.getByRole('button', { name: 'Move Morning Light' })).toHaveFocus();
	}}
>
	{#snippet template(args)}
		<div style="max-width: 420px;">
			<SortableList
				{...args}
				items={songs}
				key={(song) => song.id}
				handleLabel={(song) => `Move ${song.title}`}
				{onreorder}
			>
				{#snippet item(song, handle)}
					<div style={row}>
						{@render handle()}
						<span style="flex: 1; font-weight: 500;">{song.title}</span>
						<span style="color: var(--color-text-muted);">{song.artist}</span>
					</div>
				{/snippet}
			</SortableList>
		</div>
	{/snippet}
</Story>

<Story name="Revealed on hover">
	{#snippet template(args)}
		<div style="max-width: 420px;">
			<SortableList
				{...args}
				revealHandles
				items={songs}
				key={(song) => song.id}
				handleLabel={(song) => `Move ${song.title}`}
			>
				{#snippet item(song, handle)}
					<div style={row}>
						{@render handle()}
						<span style="flex: 1; font-weight: 500;">{song.title}</span>
						<span style="color: var(--color-text-muted);">{song.artist}</span>
					</div>
				{/snippet}
			</SortableList>
		</div>
	{/snippet}
</Story>

<Story name="Cards">
	{#snippet template(args)}
		<div style="max-width: 420px;">
			<SortableList
				{...args}
				items={songs}
				key={(song) => song.id}
				handleLabel={(song) => `Move ${song.title}`}
				style="gap: 12px; --sortable-list-dragging-radius: 14px;"
			>
				{#snippet item(song, handle)}
					<Card>
						<CardHeader>
							<CardTitle>
								<span style="display: flex; align-items: center; gap: 4px;">
									{@render handle()}
									{song.title}
								</span>
							</CardTitle>
						</CardHeader>
						<CardContent>{song.artist}</CardContent>
					</Card>
				{/snippet}
			</SortableList>
		</div>
	{/snippet}
</Story>
