<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn, waitFor } from 'storybook/test';
	import ContextMenu from './ContextMenu.svelte';
	import ContextMenuItem from './ContextMenuItem.svelte';
	import Button from '../button/Button.svelte';
	import { ChevronDown, Copy, Monitor, Moon, Ellipsis, Pencil, Sun, Trash2 } from '../../icons.js';

	const aligns = ['start', 'center', 'end'] as const;

	const { Story } = defineMeta({
		title: 'Components/ContextMenu',
		component: ContextMenu,
		tags: ['autodocs'],
		argTypes: {
			align: { control: 'inline-radio', options: aligns },
			open: { control: 'boolean' },
			trigger: { control: false },
			children: { control: false }
		},
		args: {
			align: 'start',
			open: true
		},
		parameters: {
			docs: { story: { height: '240px' } }
		}
	});

	const stage = 'display: flex; gap: 200px; min-height: 200px; padding: 8px;';
	const onedit = fn();
</script>

<Story name="Items">
	{#snippet template({ align, open })}
		<div style={stage}>
			<ContextMenu {align} {open}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary" icon={Ellipsis} label="Actions" />
				{/snippet}
				<ContextMenuItem icon={Pencil} onclick={onedit}>Edit</ContextMenuItem>
				<ContextMenuItem icon={Copy}>Duplicate</ContextMenuItem>
				<ContextMenuItem icon={Trash2} disabled>Delete</ContextMenuItem>
			</ContextMenu>
		</div>
	{/snippet}
</Story>

<Story name="Selection">
	{#snippet template({ align, open })}
		<div style={stage}>
			<ContextMenu {align} {open}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary" icon={ChevronDown}>Theme</Button>
				{/snippet}
				<ContextMenuItem icon={Sun} selected={false}>Light</ContextMenuItem>
				<ContextMenuItem icon={Moon} selected={true}>Dark</ContextMenuItem>
				<ContextMenuItem icon={Monitor} selected={false}>System</ContextMenuItem>
			</ContextMenu>
		</div>
	{/snippet}
</Story>

<Story name="Alignment" parameters={{ controls: { exclude: ['align'] } }}>
	{#snippet template({ open })}
		<div style="{stage} justify-content: center;">
			{#each aligns as align (align)}
				<ContextMenu {open} {align}>
					{#snippet trigger(props)}
						<Button {...props} variant="secondary" icon={ChevronDown}>{align}</Button>
					{/snippet}
					<ContextMenuItem>First item</ContextMenuItem>
					<ContextMenuItem>Second item</ContextMenuItem>
				</ContextMenu>
			{/each}
		</div>
	{/snippet}
</Story>

<Story
	name="Test: opens on click and focuses first item"
	tags={['!dev', '!autodocs']}
	args={{ open: false }}
	play={async ({ canvas, userEvent }) => {
		const trigger = canvas.getByRole('button', { name: 'Actions' });
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await userEvent.click(trigger);
		await expect(canvas.getByRole('menu')).toBeInTheDocument();
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());
	}}
>
	{#snippet template({ align, open })}
		<ContextMenu {align} {open}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary" icon={Ellipsis} label="Actions" />
			{/snippet}
			<ContextMenuItem>Edit</ContextMenuItem>
			<ContextMenuItem>Duplicate</ContextMenuItem>
		</ContextMenu>
	{/snippet}
</Story>

<Story
	name="Test: arrow keys move focus and skip disabled items"
	tags={['!dev', '!autodocs']}
	args={{ open: false }}
	play={async ({ canvas, userEvent }) => {
		canvas.getByRole('button', { name: 'Actions' }).focus();
		await userEvent.keyboard('{ArrowDown}');
		await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());
		await userEvent.keyboard('{ArrowDown}');
		await expect(canvas.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
		await userEvent.keyboard('{ArrowDown}');
		await expect(canvas.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
		await userEvent.keyboard('{ArrowUp}');
		await expect(canvas.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
	}}
>
	{#snippet template({ align, open })}
		<ContextMenu {align} {open}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary" icon={Ellipsis} label="Actions" />
			{/snippet}
			<ContextMenuItem>Edit</ContextMenuItem>
			<ContextMenuItem>Duplicate</ContextMenuItem>
			<ContextMenuItem disabled>Delete</ContextMenuItem>
		</ContextMenu>
	{/snippet}
</Story>

<Story
	name="Test: escape closes and returns focus"
	tags={['!dev', '!autodocs']}
	args={{ open: false }}
	play={async ({ canvas, userEvent }) => {
		const trigger = canvas.getByRole('button', { name: 'Actions' });
		await userEvent.click(trigger);
		await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(canvas.queryByRole('menu')).toBeNull());
		await expect(trigger).toHaveFocus();
	}}
>
	{#snippet template({ align, open })}
		<ContextMenu {align} {open}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary" icon={Ellipsis} label="Actions" />
			{/snippet}
			<ContextMenuItem>Edit</ContextMenuItem>
		</ContextMenu>
	{/snippet}
</Story>

<Story
	name="Test: item click runs action and closes"
	tags={['!dev', '!autodocs']}
	args={{ open: false }}
	play={async ({ canvas, userEvent }) => {
		onedit.mockClear();
		await userEvent.click(canvas.getByRole('button', { name: 'Actions' }));
		await userEvent.click(canvas.getByRole('menuitem', { name: 'Edit' }));
		await expect(onedit).toHaveBeenCalledOnce();
		await waitFor(() => expect(canvas.queryByRole('menu')).toBeNull());
	}}
>
	{#snippet template({ align, open })}
		<ContextMenu {align} {open}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary" icon={Ellipsis} label="Actions" />
			{/snippet}
			<ContextMenuItem onclick={onedit}>Edit</ContextMenuItem>
		</ContextMenu>
	{/snippet}
</Story>

<Story
	name="Test: click outside closes"
	tags={['!dev', '!autodocs']}
	args={{ open: false }}
	play={async ({ canvas, canvasElement, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'Actions' }));
		await expect(canvas.getByRole('menu')).toBeInTheDocument();
		await userEvent.click(canvasElement);
		await waitFor(() => expect(canvas.queryByRole('menu')).toBeNull());
	}}
>
	{#snippet template({ align, open })}
		<ContextMenu {align} {open}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary" icon={Ellipsis} label="Actions" />
			{/snippet}
			<ContextMenuItem>Edit</ContextMenuItem>
		</ContextMenu>
	{/snippet}
</Story>

<Story
	name="Test: selected item gets focus"
	tags={['!dev', '!autodocs']}
	args={{ open: false }}
	play={async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'Theme' }));
		const dark = canvas.getByRole('menuitemradio', { name: 'Dark' });
		await expect(dark).toHaveAttribute('aria-checked', 'true');
		await waitFor(() => expect(dark).toHaveFocus());
	}}
>
	{#snippet template({ align, open })}
		<ContextMenu {align} {open}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary">Theme</Button>
			{/snippet}
			<ContextMenuItem selected={false}>Light</ContextMenuItem>
			<ContextMenuItem selected={true}>Dark</ContextMenuItem>
		</ContextMenu>
	{/snippet}
</Story>
