<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import Textarea from './Textarea.svelte';

	const { Story } = defineMeta({
		title: 'Components/Textarea',
		component: Textarea,
		tags: ['autodocs'],
		argTypes: {
			placeholder: { control: 'text' },
			rows: { control: 'number' },
			disabled: { control: 'boolean' }
		},
		args: {
			placeholder: 'Tell us a little about yourself',
			disabled: false
		}
	});

	const column = 'display: flex; flex-direction: column; gap: 12px; width: 280px;';
	const bio =
		'Mathematician and writer, chiefly known for her work on the Analytical Engine.\nFirst to publish an algorithm intended for a machine.';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<Textarea {...args} aria-label="Bio" style="width: 280px;" />
	{/snippet}
</Story>

<Story name="Rows" parameters={{ controls: { exclude: ['rows'] } }}>
	{#snippet template(args)}
		<div style={column}>
			{#each [2, 4, 6] as rows (rows)}
				<Textarea {...args} {rows} aria-label="{rows} rows" placeholder="{rows} rows" />
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="States" parameters={{ controls: { exclude: ['disabled'] } }}>
	{#snippet template(args)}
		<div style={column}>
			<Textarea {...args} aria-label="Empty" />
			<Textarea {...args} aria-label="Filled" value={bio} />
			<Textarea {...args} aria-label="Invalid" value="ada" aria-invalid="true" />
			<Textarea {...args} aria-label="Disabled" value={bio} disabled />
		</div>
	{/snippet}
</Story>

<Story
	name="Test: accepts multiline typing"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const textarea = canvas.getByRole('textbox', { name: 'Bio' });
		await userEvent.type(textarea, 'Ada{Enter}Lovelace');
		await expect(textarea).toHaveValue('Ada\nLovelace');
	}}
>
	{#snippet template(args)}
		<Textarea {...args} aria-label="Bio" placeholder={undefined} />
	{/snippet}
</Story>

<Story
	name="Test: grows with its content"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const textarea = canvas.getByRole('textbox', { name: 'Bio' });
		const initial = textarea.offsetHeight;
		await userEvent.type(textarea, 'One{Enter}Two{Enter}Three{Enter}Four{Enter}Five');
		await expect(textarea.offsetHeight).toBeGreaterThan(initial);
	}}
>
	{#snippet template(args)}
		<Textarea {...args} aria-label="Bio" placeholder={undefined} style="width: 280px;" />
	{/snippet}
</Story>
