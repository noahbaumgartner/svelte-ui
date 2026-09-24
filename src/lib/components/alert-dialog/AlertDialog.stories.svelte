<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn, waitFor } from 'storybook/test';
	import AlertDialog from './AlertDialog.svelte';
	import Button from '../button/Button.svelte';
	import { Trash } from '../../icons.js';

	const { Story } = defineMeta({
		title: 'Components/AlertDialog',
		component: AlertDialog,
		tags: ['autodocs'],
		argTypes: {
			open: { control: 'boolean' },
			title: { control: 'text' },
			description: { control: 'text' },
			trigger: { control: false },
			actions: { control: false },
			children: { control: false }
		},
		args: {
			open: false,
			title: 'Delete project?',
			description:
				'This permanently deletes the project and all of its files. This cannot be undone.'
		}
	});

	const row = 'display: flex; flex-wrap: wrap; gap: 8px; align-items: center;';
	const ondelete = fn();
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<AlertDialog {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary" icon={Trash}>Delete project</Button>
			{/snippet}
			{#snippet actions(close)}
				<Button onclick={close}>Delete</Button>
				<Button variant="ghost" onclick={close}>Cancel</Button>
			{/snippet}
		</AlertDialog>
	{/snippet}
</Story>

<Story name="Content" parameters={{ controls: { exclude: ['description'] } }}>
	{#snippet template(args)}
		<div style={row}>
			<AlertDialog {...args} description={undefined}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">Title only</Button>
				{/snippet}
				{#snippet actions(close)}
					<Button onclick={close}>Delete</Button>
					<Button variant="ghost" onclick={close}>Cancel</Button>
				{/snippet}
			</AlertDialog>
			<AlertDialog {...args}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">With description</Button>
				{/snippet}
				{#snippet actions(close)}
					<Button onclick={close}>Delete</Button>
					<Button variant="ghost" onclick={close}>Cancel</Button>
				{/snippet}
			</AlertDialog>
		</div>
	{/snippet}
</Story>

<Story name="Actions" parameters={{ controls: { exclude: ['actions'] } }}>
	{#snippet template(args)}
		<div style={row}>
			<AlertDialog {...args} title="Project deleted" description={undefined}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">One action</Button>
				{/snippet}
				{#snippet actions(close)}
					<Button onclick={close}>OK</Button>
				{/snippet}
			</AlertDialog>
			<AlertDialog {...args}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">Two actions</Button>
				{/snippet}
				{#snippet actions(close)}
					<Button onclick={close}>Delete</Button>
					<Button variant="ghost" onclick={close}>Cancel</Button>
				{/snippet}
			</AlertDialog>
			<AlertDialog
				{...args}
				title="Save changes?"
				description="Your changes will be lost if you leave without saving."
			>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">Three actions</Button>
				{/snippet}
				{#snippet actions(close)}
					<Button onclick={close}>Save</Button>
					<Button variant="ghost" onclick={close}>Don't save</Button>
					<Button variant="ghost" onclick={close}>Cancel</Button>
				{/snippet}
			</AlertDialog>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: opens on click and focuses last action"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'Delete project' }));
		const dialog = canvas.getByRole('alertdialog', { name: 'Delete project?' });
		await waitFor(() => expect(dialog).toBeVisible());
		await expect(dialog).toHaveAccessibleDescription(/permanently deletes/);
		await waitFor(() => expect(canvas.getByRole('button', { name: 'Cancel' })).toHaveFocus());
	}}
>
	{#snippet template(args)}
		<AlertDialog {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary">Delete project</Button>
			{/snippet}
			{#snippet actions(close)}
				<Button onclick={close}>Delete</Button>
				<Button variant="ghost" onclick={close}>Cancel</Button>
			{/snippet}
		</AlertDialog>
	{/snippet}
</Story>

<Story
	name="Test: action runs and closes"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		ondelete.mockClear();
		await userEvent.click(canvas.getByRole('button', { name: 'Delete project' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Delete' }));
		await expect(ondelete).toHaveBeenCalledOnce();
		await waitFor(() => expect(canvas.queryByRole('alertdialog')).toBeNull());
	}}
>
	{#snippet template(args)}
		<AlertDialog {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary">Delete project</Button>
			{/snippet}
			{#snippet actions(close)}
				<Button
					onclick={() => {
						ondelete();
						close();
					}}>Delete</Button
				>
				<Button variant="ghost" onclick={close}>Cancel</Button>
			{/snippet}
		</AlertDialog>
	{/snippet}
</Story>

<Story
	name="Test: close returns focus to trigger"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const trigger = canvas.getByRole('button', { name: 'Delete project' });
		await userEvent.click(trigger);
		await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
		await waitFor(() => expect(canvas.queryByRole('alertdialog')).toBeNull());
		await expect(trigger).toHaveFocus();
	}}
>
	{#snippet template(args)}
		<AlertDialog {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary">Delete project</Button>
			{/snippet}
			{#snippet actions(close)}
				<Button variant="ghost" onclick={close}>Cancel</Button>
			{/snippet}
		</AlertDialog>
	{/snippet}
</Story>

<Story
	name="Test: escape closes"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'Delete project' }));
		await waitFor(() => expect(canvas.getByRole('button', { name: 'Cancel' })).toHaveFocus());
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(canvas.queryByRole('alertdialog')).toBeNull());
	}}
>
	{#snippet template(args)}
		<AlertDialog {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary">Delete project</Button>
			{/snippet}
			{#snippet actions(close)}
				<Button variant="ghost" onclick={close}>Cancel</Button>
			{/snippet}
		</AlertDialog>
	{/snippet}
</Story>
