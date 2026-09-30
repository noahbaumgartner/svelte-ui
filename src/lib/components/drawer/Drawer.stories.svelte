<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fireEvent, fn, waitFor } from 'storybook/test';
	import Drawer from './Drawer.svelte';
	import Button from '../button/Button.svelte';
	import Field from '../field/Field.svelte';
	import Label from '../label/Label.svelte';
	import Input from '../input/Input.svelte';
	import { Send, UserPlus } from '../../icons.js';

	const { Story } = defineMeta({
		title: 'Components/Drawer',
		component: Drawer,
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
			title: 'Share document',
			description: 'People with access can view and comment.'
		}
	});

	const row = 'display: flex; flex-wrap: wrap; gap: 8px; align-items: center;';
	const line =
		'display: flex; justify-content: space-between; gap: 16px; padding: 10px 0; border-bottom: 1px solid var(--color-border);';
	const people = [
		{ name: 'Ada Lovelace', role: 'Owner' },
		{ name: 'Grace Hopper', role: 'Can edit' },
		{ name: 'Alan Turing', role: 'Can view' }
	];
	const onsend = fn();
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<Drawer {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary" icon={UserPlus}>Share</Button>
			{/snippet}
			{#each people as person (person.name)}
				<div style={line}>
					<span>{person.name}</span>
					<span style="color: var(--color-text-muted);">{person.role}</span>
				</div>
			{/each}
			{#snippet actions(close)}
				<Button variant="outline" onclick={close}>Cancel</Button>
				<Button icon={Send} onclick={close}>Send invite</Button>
			{/snippet}
		</Drawer>
	{/snippet}
</Story>

<Story name="Content" parameters={{ controls: { exclude: ['description'] } }}>
	{#snippet template(args)}
		<div style={row}>
			<Drawer {...args} description={undefined}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">Title only</Button>
				{/snippet}
			</Drawer>
			<Drawer {...args}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">With description</Button>
				{/snippet}
			</Drawer>
			<Drawer {...args}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">With content</Button>
				{/snippet}
				<Field>
					<Label for="content-email">Email</Label>
					<Input id="content-email" type="email" placeholder="name@example.com" />
				</Field>
			</Drawer>
			<Drawer {...args} title="Release notes" description="Version 2.0">
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">Long content</Button>
				{/snippet}
				{#each { length: 30 }, i (i)}
					<p>Paragraph {i + 1} of the release notes, long enough to make the drawer scroll.</p>
				{/each}
				{#snippet actions(close)}
					<Button onclick={close}>Done</Button>
				{/snippet}
			</Drawer>
		</div>
	{/snippet}
</Story>

<Story name="Actions" parameters={{ controls: { exclude: ['actions'] } }}>
	{#snippet template(args)}
		<div style={row}>
			<Drawer {...args}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">No actions</Button>
				{/snippet}
			</Drawer>
			<Drawer {...args}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">One action</Button>
				{/snippet}
				{#snippet actions(close)}
					<Button onclick={close}>Done</Button>
				{/snippet}
			</Drawer>
			<Drawer {...args}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">Two actions</Button>
				{/snippet}
				{#snippet actions(close)}
					<Button variant="outline" onclick={close}>Cancel</Button>
					<Button icon={Send} onclick={close}>Send invite</Button>
				{/snippet}
			</Drawer>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: opens on click and focuses content"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'Open' }));
		const drawer = canvas.getByRole('dialog', { name: 'Share document' });
		await waitFor(() => expect(drawer).toBeVisible());
		await expect(drawer).toHaveAccessibleDescription(/view and comment/);
		await waitFor(() => expect(canvas.getByRole('textbox', { name: 'Email' })).toHaveFocus());
	}}
>
	{#snippet template(args)}
		<Drawer {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary">Open</Button>
			{/snippet}
			<Field>
				<Label for="test-email">Email</Label>
				<Input id="test-email" type="email" />
			</Field>
		</Drawer>
	{/snippet}
</Story>

<Story
	name="Test: action runs and closes"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		onsend.mockClear();
		await userEvent.click(canvas.getByRole('button', { name: 'Open' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Send' }));
		await expect(onsend).toHaveBeenCalledOnce();
		await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
	}}
>
	{#snippet template(args)}
		<Drawer {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary">Open</Button>
			{/snippet}
			{#snippet actions(close)}
				<Button
					onclick={() => {
						onsend();
						close();
					}}>Send</Button
				>
			{/snippet}
		</Drawer>
	{/snippet}
</Story>

<Story
	name="Test: handle closes and returns focus to trigger"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const trigger = canvas.getByRole('button', { name: 'Open' });
		await userEvent.click(trigger);
		await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
		await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
		await expect(trigger).toHaveFocus();
	}}
>
	{#snippet template(args)}
		<Drawer {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary">Open</Button>
			{/snippet}
		</Drawer>
	{/snippet}
</Story>

<Story
	name="Test: escape closes"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'Open' }));
		await waitFor(() => expect(canvas.getByRole('dialog')).toBeVisible());
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
	}}
>
	{#snippet template(args)}
		<Drawer {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary">Open</Button>
			{/snippet}
		</Drawer>
	{/snippet}
</Story>

<Story
	name="Test: backdrop click closes"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'Open' }));
		const drawer = canvas.getByRole('dialog');
		await waitFor(() => expect(drawer).toBeVisible());
		await userEvent.pointer({
			keys: '[MouseLeft]',
			target: drawer,
			coords: { clientX: 1, clientY: 1 }
		});
		await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
	}}
>
	{#snippet template(args)}
		<Drawer {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary">Open</Button>
			{/snippet}
		</Drawer>
	{/snippet}
</Story>

<Story
	name="Test: dragging down closes, a short drag snaps back"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'Open' }));
		const drawer = canvas.getByRole('dialog');
		await waitFor(() => expect(drawer).toBeVisible());
		const title = canvas.getByRole('heading', { name: 'Share document' });

		// Slow and short: stays open
		await fireEvent.pointerDown(title, { clientX: 100, clientY: 100, button: 0 });
		await fireEvent.pointerMove(title, { clientX: 110, clientY: 110 });
		await new Promise((resolve) => setTimeout(resolve, 100));
		await fireEvent.pointerUp(title, { clientX: 110, clientY: 110 });
		await expect(drawer).toBeVisible();

		await fireEvent.pointerDown(title, { clientX: 100, clientY: 100, button: 0 });
		await fireEvent.pointerMove(title, { clientX: 600, clientY: 600 });
		await fireEvent.pointerUp(title, { clientX: 600, clientY: 600 });
		await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
	}}
>
	{#snippet template(args)}
		<Drawer {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary">Open</Button>
			{/snippet}
		</Drawer>
	{/snippet}
</Story>
