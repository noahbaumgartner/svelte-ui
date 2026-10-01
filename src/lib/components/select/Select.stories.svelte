<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn, waitFor } from 'storybook/test';
	import Select from './Select.svelte';
	import Dialog from '../dialog/Dialog.svelte';
	import Field from '../field/Field.svelte';
	import FieldDescription from '../field/FieldDescription.svelte';
	import Label from '../label/Label.svelte';

	const roles = [
		{ value: 'owner', label: 'Owner' },
		{ value: 'editor', label: 'Editor' },
		{ value: 'viewer', label: 'Viewer' },
		{ value: 'guest', label: 'Guest', disabled: true }
	];

	const { Story } = defineMeta({
		title: 'Components/Select',
		component: Select,
		tags: ['autodocs'],
		argTypes: {
			value: { control: 'select', options: [undefined, ...roles.map((role) => role.value)] },
			options: { control: 'object' },
			placeholder: { control: 'text' },
			name: { control: 'text' },
			disabled: { control: 'boolean' },
			labels: { control: 'object' }
		},
		args: {
			value: 'editor',
			options: roles,
			placeholder: 'Choose a role',
			disabled: false
		}
	});

	const timezones = Array.from({ length: 25 }, (_, i) => {
		const offset = i - 12;
		return { value: offset, label: `UTC${offset < 0 ? '−' : '+'}${Math.abs(offset)}` };
	});

	const column = 'display: flex; flex-direction: column; gap: 16px; max-width: 240px;';
	const onchange = fn();
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<div style={column}>
			<Select {...args} aria-label="Role" />
		</div>
	{/snippet}
</Story>

<Story name="States" parameters={{ controls: { exclude: ['value', 'disabled'] } }}>
	{#snippet template(args)}
		<div style={column}>
			<Select {...args} aria-label="Chosen" />
			<Select {...args} value={undefined} aria-label="Placeholder" />
			<Select {...args} aria-label="Invalid" aria-invalid="true" />
			<Select {...args} aria-label="Disabled" disabled />
		</div>
	{/snippet}
</Story>

<Story name="Many options" parameters={{ controls: { exclude: ['options', 'value'] } }}>
	{#snippet template(args)}
		<div style={column}>
			<Select
				placeholder={args.placeholder}
				disabled={args.disabled}
				options={timezones}
				value={1}
				aria-label="Time zone"
			/>
		</div>
	{/snippet}
</Story>

<Story name="Empty" parameters={{ controls: { exclude: ['options', 'value', 'labels'] } }}>
	{#snippet template(args)}
		<div style={column}>
			<Select {...args} options={[]} value={undefined} labels={{ empty: 'Nothing to choose' }} />
		</div>
	{/snippet}
</Story>

<Story name="Composition">
	{#snippet template(args)}
		<div style={column}>
			<Field>
				<Label for="composition-role">Role</Label>
				<Select {...args} id="composition-role" aria-describedby="composition-role-description" />
				<FieldDescription id="composition-role-description">
					Editors can change the document, viewers can only comment.
				</FieldDescription>
			</Field>
		</div>
	{/snippet}
</Story>

<Story name="In a dialog">
	{#snippet template(args)}
		<Dialog open title="Invite" description="The list is not clipped by the dialog.">
			<Field>
				<Label for="dialog-role">Role</Label>
				<Select {...args} id="dialog-role" />
			</Field>
		</Dialog>
	{/snippet}
</Story>

<Story
	name="Test: chooses an option on click"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		onchange.mockClear();
		const trigger = canvas.getByRole('combobox', { name: 'Role' });
		await expect(trigger).toHaveTextContent('Editor');
		await userEvent.click(trigger);
		await expect(canvas.getByRole('option', { name: 'Editor' })).toHaveAttribute(
			'aria-selected',
			'true'
		);
		await expect(canvas.getByRole('option', { name: 'Guest' })).toBeDisabled();
		await userEvent.click(canvas.getByRole('option', { name: 'Viewer' }));
		await expect(onchange).toHaveBeenCalledOnce();
		await expect(onchange).toHaveBeenLastCalledWith('viewer');
		await expect(trigger).toHaveTextContent('Viewer');
		await waitFor(() => expect(canvas.queryByRole('listbox')).toBeNull());
		await expect(trigger).toHaveFocus();
	}}
>
	{#snippet template(args)}
		<div style={column}>
			<Select {...args} {onchange} aria-label="Role" />
		</div>
	{/snippet}
</Story>

<Story
	name="Test: keyboard opens, moves, types ahead and chooses"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const trigger = canvas.getByRole('combobox', { name: 'Role' });
		trigger.focus();
		await userEvent.keyboard('{ArrowDown}');
		await waitFor(() => expect(canvas.getByRole('option', { name: 'Editor' })).toHaveFocus());
		await userEvent.keyboard('{ArrowDown}');
		await expect(canvas.getByRole('option', { name: 'Viewer' })).toHaveFocus();
		// The disabled option is skipped
		await userEvent.keyboard('{ArrowDown}');
		await expect(canvas.getByRole('option', { name: 'Owner' })).toHaveFocus();
		await userEvent.keyboard('v');
		await expect(canvas.getByRole('option', { name: 'Viewer' })).toHaveFocus();
		await userEvent.keyboard('{Enter}');
		await expect(trigger).toHaveTextContent('Viewer');
		await expect(trigger).toHaveFocus();
	}}
>
	{#snippet template(args)}
		<div style={column}>
			<Select {...args} aria-label="Role" />
		</div>
	{/snippet}
</Story>

<Story
	name="Test: escape closes and keeps the value"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const trigger = canvas.getByRole('combobox', { name: 'Role' });
		await userEvent.click(trigger);
		await waitFor(() => expect(canvas.getByRole('listbox')).toBeVisible());
		await userEvent.keyboard('{ArrowDown}{Escape}');
		await waitFor(() => expect(canvas.queryByRole('listbox')).toBeNull());
		await expect(trigger).toHaveTextContent('Editor');
		await expect(trigger).toHaveFocus();
	}}
>
	{#snippet template(args)}
		<div style={column}>
			<Select {...args} aria-label="Role" />
		</div>
	{/snippet}
</Story>

<Story
	name="Test: submits its value with a form"
	tags={['!dev', '!autodocs']}
	play={async ({ canvasElement }) => {
		const form = canvasElement.querySelector('form')!;
		await expect(new FormData(form).get('role')).toBe('editor');
	}}
>
	{#snippet template(args)}
		<form style={column}>
			<Select {...args} name="role" aria-label="Role" />
		</form>
	{/snippet}
</Story>
