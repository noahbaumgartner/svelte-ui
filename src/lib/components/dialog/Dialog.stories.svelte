<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn, waitFor } from 'storybook/test';
	import Dialog from './Dialog.svelte';
	import Button from '../button/Button.svelte';
	import Field from '../field/Field.svelte';
	import FieldDescription from '../field/FieldDescription.svelte';
	import FieldGroup from '../field/FieldGroup.svelte';
	import Label from '../label/Label.svelte';
	import Input from '../input/Input.svelte';
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
			actions: { control: false },
			loading: { control: 'boolean' }
		},
		args: {
			open: false,
			title: 'Edit profile',
			description: 'Changes are visible to everyone in your workspace.',
			loading: false
		}
	});

	const row = 'display: flex; flex-wrap: wrap; gap: 8px; align-items: center;';
	const onsave = fn();
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<Dialog {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary" icon={Pencil}>Edit profile</Button>
			{/snippet}
			<FieldGroup>
				<Field>
					<Label for="default-name">Name</Label>
					<Input id="default-name" value="Noah Baumgartner" />
				</Field>
				<Field>
					<Label for="default-username">Username</Label>
					<Input
						id="default-username"
						value="noah"
						aria-describedby="default-username-description"
					/>
					<FieldDescription id="default-username-description">
						Used in your profile URL.
					</FieldDescription>
				</Field>
			</FieldGroup>
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
				<Field>
					<Label for="content-name">Name</Label>
					<Input id="content-name" value="Noah Baumgartner" />
				</Field>
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

<Story name="States" parameters={{ controls: { exclude: ['loading'] } }}>
	{#snippet template(args)}
		<div style={row}>
			<Dialog {...args}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">Ready</Button>
				{/snippet}
				<Field>
					<Label for="states-ready-name">Name</Label>
					<Input id="states-ready-name" value="Noah Baumgartner" />
				</Field>
				{#snippet actions(close)}
					<Button variant="ghost" onclick={close}>Cancel</Button>
					<Button onclick={close}>Save</Button>
				{/snippet}
			</Dialog>
			<Dialog {...args} loading>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">Loading</Button>
				{/snippet}
				<Field>
					<Label for="states-loading-name">Name</Label>
					<Input id="states-loading-name" value="Noah Baumgartner" />
				</Field>
				{#snippet actions(close)}
					<Button variant="ghost" onclick={close}>Cancel</Button>
					<Button onclick={close}>Save</Button>
				{/snippet}
			</Dialog>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: loading makes content inert and shows spinner"
	tags={['!dev', '!autodocs']}
	args={{ open: true, loading: true }}
	play={async ({ canvas }) => {
		const dialog = canvas.getByRole('dialog', { name: 'Edit profile' });
		await waitFor(() => expect(dialog).toBeVisible());
		await expect(dialog).toHaveAttribute('aria-busy', 'true');
		await expect(canvas.getByRole('status', { name: 'Loading' })).toBeVisible();
		await expect(canvas.getByRole('button', { name: 'Save' }).closest('[inert]')).not.toBeNull();
		await expect(canvas.getByRole('textbox', { name: 'Name' }).closest('[inert]')).not.toBeNull();
		await expect(canvas.getByRole('button', { name: 'Close' })).toBeEnabled();
	}}
>
	{#snippet template(args)}
		<Dialog {...args}>
			<Field>
				<Label for="test-loading-name">Name</Label>
				<Input id="test-loading-name" value="Noah Baumgartner" />
			</Field>
			{#snippet actions(close)}
				<Button onclick={close}>Save</Button>
			{/snippet}
		</Dialog>
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
			<Field>
				<Label for="test-name">Name</Label>
				<Input id="test-name" value="Noah Baumgartner" />
			</Field>
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
