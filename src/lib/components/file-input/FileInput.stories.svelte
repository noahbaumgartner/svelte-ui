<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import FileInput from './FileInput.svelte';

	const { Story } = defineMeta({
		title: 'Components/FileInput',
		component: FileInput,
		tags: ['autodocs'],
		argTypes: {
			accept: { control: 'text' },
			multiple: { control: 'boolean' },
			disabled: { control: 'boolean' }
		},
		args: {
			accept: 'image/*',
			multiple: false,
			disabled: false
		}
	});

	const column = 'display: flex; flex-direction: column; gap: 12px; width: 320px;';
	const photo = () => new File(['x'.repeat(2048)], 'portrait.png', { type: 'image/png' });
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<FileInput {...args} aria-label="Image" style="width: 320px;" />
	{/snippet}
</Story>

<Story name="Multiple" parameters={{ controls: { exclude: ['multiple'] } }}>
	{#snippet template(args)}
		<FileInput {...args} multiple aria-label="Images" style="width: 320px;" />
	{/snippet}
</Story>

<Story name="States" parameters={{ controls: { exclude: ['disabled'] } }}>
	{#snippet template(args)}
		<div style={column}>
			<FileInput {...args} aria-label="Empty" />
			<FileInput {...args} aria-label="Invalid" aria-invalid="true" />
			<FileInput {...args} aria-label="Disabled" disabled />
		</div>
	{/snippet}
</Story>

<Story name="Labels">
	{#snippet template(args)}
		<FileInput
			{...args}
			aria-label="Bild"
			style="width: 320px;"
			labels={{
				choose: 'Bild auswählen oder hierher ziehen',
				drop: 'Zum Auswählen loslassen',
				remove: 'Auswahl entfernen'
			}}
		/>
	{/snippet}
</Story>

<Story
	name="Test: shows the chosen file and clears it"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const input = canvas.getByLabelText<HTMLInputElement>('Image');
		await userEvent.upload(input, photo());
		await expect(input.files).toHaveLength(1);
		await expect(canvas.getByText('portrait.png')).toBeInTheDocument();
		await expect(canvas.getByText('2 KB')).toBeInTheDocument();

		await userEvent.click(canvas.getByRole('button', { name: 'Remove selection' }));
		await expect(input.files).toHaveLength(0);
		await expect(canvas.queryByText('portrait.png')).not.toBeInTheDocument();
	}}
>
	{#snippet template(args)}
		<FileInput {...args} aria-label="Image" style="width: 320px;" />
	{/snippet}
</Story>

<Story
	name="Test: summarises several files"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const input = canvas.getByLabelText<HTMLInputElement>('Images');
		await userEvent.upload(input, [photo(), photo()]);
		await expect(canvas.getByText('2 files')).toBeInTheDocument();
	}}
>
	{#snippet template(args)}
		<FileInput {...args} multiple aria-label="Images" style="width: 320px;" />
	{/snippet}
</Story>
