<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn, waitFor } from 'storybook/test';
	import Dialog from './Dialog.svelte';
	import Button from '../button/Button.svelte';
	import { Pencil } from '../../icons.js';

	const { Story } = defineMeta({
		title: 'Components/Dialog',
		component: Dialog,
		tags: ['autodocs'],
		argTypes: {
			open: { control: 'boolean' },
			title: { control: 'text' },
			description: { control: 'text' },
			trigger: { control: false },
			children: { control: false },
			actions: { control: false }
		},
		args: {
			open: false,
			title: 'Edit profile',
			description: 'Changes are visible to everyone in your workspace.'
		}
	});

	const row = 'display: flex; flex-wrap: wrap; gap: 8px; align-items: center;';
	const field = 'display: grid; gap: 6px;';
	const input =
		'box-sizing: border-box; width: 100%; height: 32px; padding: 0 10px; font: inherit; color: inherit; background: var(--color-bg); border: 1px solid var(--color-border-strong); border-radius: 8px;';
	const onsave = fn();
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<Dialog {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary" icon={Pencil}>Edit profile</Button>
			{/snippet}
			<label style={field}>
				Name
				<input style={input} value="Noah Baumgartner" />
			</label>
			{#snippet actions(close)}
				<Button variant="ghost" onclick={close}>Cancel</Button>
				<Button onclick={close}>Save</Button>
			{/snippet}
		</Dialog>
	{/snippet}
</Story>

<Story name="Content" parameters={{ controls: { exclude: ['description'] } }}>
	{#snippet template(args)}
		<div style={row}>
			<Dialog {...args} title="Keyboard shortcuts" description={undefined}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">Title only</Button>
				{/snippet}
			</Dialog>
			<Dialog {...args}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">With description</Button>
				{/snippet}
			</Dialog>
			<Dialog {...args}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">With content</Button>
				{/snippet}
				<label style={field}>
					Name
					<input style={input} value="Noah Baumgartner" />
				</label>
			</Dialog>
			<Dialog {...args} title="Release notes" description="Version 2.0">
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">Long content</Button>
				{/snippet}
				{#each { length: 30 }, i (i)}
					<p>Paragraph {i + 1} of the release notes, long enough to make the dialog scroll.</p>
				{/each}
				{#snippet actions(close)}
					<Button onclick={close}>Done</Button>
				{/snippet}
			</Dialog>
		</div>
	{/snippet}
</Story>

<Story name="Actions" parameters={{ controls: { exclude: ['actions'] } }}>
	{#snippet template(args)}
		<div style={row}>
			<Dialog {...args}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">No actions</Button>
				{/snippet}
			</Dialog>
			<Dialog {...args}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">One action</Button>
				{/snippet}
				{#snippet actions(close)}
					<Button onclick={close}>Done</Button>
				{/snippet}
			</Dialog>
			<Dialog {...args}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">Two actions</Button>
				{/snippet}
				{#snippet actions(close)}
					<Button variant="ghost" onclick={close}>Cancel</Button>
					<Button onclick={close}>Save</Button>
				{/snippet}
			</Dialog>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: opens on click and focuses content"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'Edit profile' }));
		const dialog = canvas.getByRole('dialog', { name: 'Edit profile' });
		await waitFor(() => expect(dialog).toBeVisible());
		await expect(dialog).toHaveAccessibleDescription(/visible to everyone/);
		await waitFor(() => expect(canvas.getByRole('textbox', { name: 'Name' })).toHaveFocus());
	}}
>
	{#snippet template(args)}
		<Dialog {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary">Edit profile</Button>
			{/snippet}
			<label style={field}>
				Name
				<input style={input} value="Noah Baumgartner" />
			</label>
			{#snippet actions(close)}
				<Button onclick={close}>Save</Button>
			{/snippet}
		</Dialog>
	{/snippet}
</Story>

<Story
	name="Test: action runs and closes"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		onsave.mockClear();
		await userEvent.click(canvas.getByRole('button', { name: 'Edit profile' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
		await expect(onsave).toHaveBeenCalledOnce();
		await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
	}}
>
	{#snippet template(args)}
		<Dialog {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary">Edit profile</Button>
			{/snippet}
			{#snippet actions(close)}
				<Button
					onclick={() => {
						onsave();
						close();
					}}>Save</Button
				>
			{/snippet}
		</Dialog>
	{/snippet}
</Story>

<Story
	name="Test: close button closes and returns focus to trigger"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const trigger = canvas.getByRole('button', { name: 'Edit profile' });
		await userEvent.click(trigger);
		await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
		await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
		await expect(trigger).toHaveFocus();
	}}
>
	{#snippet template(args)}
		<Dialog {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary">Edit profile</Button>
			{/snippet}
		</Dialog>
	{/snippet}
</Story>

<Story
	name="Test: escape closes"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'Edit profile' }));
		await waitFor(() => expect(canvas.getByRole('dialog')).toBeVisible());
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
	}}
>
	{#snippet template(args)}
		<Dialog {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary">Edit profile</Button>
			{/snippet}
		</Dialog>
	{/snippet}
</Story>

<Story
	name="Test: backdrop click closes"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'Edit profile' }));
		const dialog = canvas.getByRole('dialog');
		await waitFor(() => expect(dialog).toBeVisible());
		await userEvent.pointer({
			keys: '[MouseLeft]',
			target: dialog,
			coords: { clientX: 1, clientY: 1 }
		});
		await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
	}}
>
	{#snippet template(args)}
		<Dialog {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary">Edit profile</Button>
			{/snippet}
		</Dialog>
	{/snippet}
</Story>
