<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, waitFor } from 'storybook/test';
	import Popover from './Popover.svelte';
	import Avatar from '../avatar/Avatar.svelte';
	import Button from '../button/Button.svelte';
	import Field from '../field/Field.svelte';
	import FieldGroup from '../field/FieldGroup.svelte';
	import Input from '../input/Input.svelte';
	import Label from '../label/Label.svelte';
	import Link from '../link/Link.svelte';
	import { Settings2 } from '../../icons.js';

	const sides = ['top', 'right', 'bottom', 'left'] as const;
	const aligns = ['start', 'center', 'end'] as const;

	const { Story } = defineMeta({
		title: 'Components/Popover',
		component: Popover,
		tags: ['autodocs'],
		argTypes: {
			open: { control: 'boolean' },
			hover: { control: 'boolean' },
			delay: { control: 'number' },
			side: { control: 'inline-radio', options: sides },
			align: { control: 'inline-radio', options: aligns },
			title: { control: 'text' },
			description: { control: 'text' },
			trigger: { control: false },
			children: { control: false }
		},
		args: {
			open: false,
			hover: false,
			delay: 500,
			side: 'bottom',
			align: 'center',
			title: 'Dimensions',
			description: 'Set the dimensions for the layer.'
		},
		parameters: {
			docs: { story: { height: '340px' } }
		}
	});

	const stage =
		'display: flex; flex-wrap: wrap; gap: 24px; align-items: center; justify-content: center; min-height: 120px;';
	const row = 'grid-template-columns: 80px 1fr; align-items: center;';
</script>

{#snippet dimensions(prefix: string)}
	<FieldGroup>
		<Field orientation="horizontal" style={row}>
			<Label for="{prefix}-width">Width</Label>
			<Input id="{prefix}-width" value="100%" />
		</Field>
		<Field orientation="horizontal" style={row}>
			<Label for="{prefix}-height">Height</Label>
			<Input id="{prefix}-height" value="25px" />
		</Field>
	</FieldGroup>
{/snippet}

<Story name="Content" parameters={{ controls: { exclude: ['title', 'description'] } }}>
	{#snippet template(args)}
		<div style={stage}>
			<Popover {...args}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary" icon={Settings2}>With form</Button>
				{/snippet}
				{@render dimensions('content')}
			</Popover>
			<Popover {...args} title={undefined} description={undefined}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary">Text only</Button>
				{/snippet}
				Place any content in a popover, it is not limited to a title and description.
			</Popover>
		</div>
	{/snippet}
</Story>

<Story name="Hover" args={{ hover: true }} parameters={{ controls: { exclude: ['hover'] } }}>
	{#snippet template({ open, delay, side, align })}
		<div style={stage}>
			<Popover hover {open} {delay} {side} {align}>
				{#snippet trigger(props)}
					<Link {...props} href="https://svelte.dev">@sveltejs</Link>
				{/snippet}
				<div style="display: flex; gap: 12px;">
					<Avatar alt="Svelte" fallback="S" size="lg" />
					<div>
						<strong>@sveltejs</strong>
						<p style="margin: 2px 0 8px;">Cybernetically enhanced web apps.</p>
						<span style="font-size: 12px; color: var(--color-text-muted);"
							>Joined November 2016</span
						>
					</div>
				</div>
			</Popover>
		</div>
	{/snippet}
</Story>

<Story name="Sides" args={{ open: true }} parameters={{ controls: { exclude: ['side'] } }}>
	{#snippet template(args)}
		<div style="{stage} gap: 16px 320px; min-height: 300px;">
			{#each sides as side (side)}
				<Popover {...args} {side} title="On {side}" description={undefined}>
					{#snippet trigger(props)}
						<Button {...props} variant="outline">{side}</Button>
					{/snippet}
				</Popover>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Align" args={{ open: true }} parameters={{ controls: { exclude: ['align'] } }}>
	{#snippet template(args)}
		<div style="{stage} gap: 320px; min-height: 160px; align-items: flex-start;">
			{#each aligns as align (align)}
				<Popover {...args} {align} title="Aligned {align}" description={undefined}>
					{#snippet trigger(props)}
						<Button {...props} variant="outline">{align}</Button>
					{/snippet}
				</Popover>
			{/each}
		</div>
	{/snippet}
</Story>

<Story
	name="Test: click opens, focuses content and escape closes"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const trigger = canvas.getByRole('button', { name: 'Dimensions' });
		await userEvent.click(trigger);
		const dialog = await waitFor(() => canvas.getByRole('dialog', { name: 'Dimensions' }));
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		await expect(canvas.getByLabelText('Width')).toHaveFocus();
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(dialog).not.toBeInTheDocument());
		await expect(trigger).toHaveFocus();
	}}
>
	{#snippet template(args)}
		<Popover {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary">Dimensions</Button>
			{/snippet}
			{@render dimensions('test-click')}
		</Popover>
	{/snippet}
</Story>

<Story
	name="Test: outside click closes"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, canvasElement, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'Dimensions' }));
		await waitFor(() => expect(canvas.getByRole('dialog')).toBeInTheDocument());
		await userEvent.click(canvasElement);
		await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
	}}
>
	{#snippet template(args)}
		<Popover {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary">Dimensions</Button>
			{/snippet}
		</Popover>
	{/snippet}
</Story>

<Story
	name="Test: hover opens and leave closes"
	tags={['!dev', '!autodocs']}
	args={{ hover: true, delay: 0 }}
	play={async ({ canvas, userEvent }) => {
		const trigger = canvas.getByRole('button', { name: 'Profile' });
		await userEvent.hover(trigger);
		await waitFor(() =>
			expect(canvas.getByText('Set the dimensions for the layer.')).toBeVisible()
		);
		await expect(canvas.queryByRole('dialog')).toBeNull();
		await userEvent.unhover(trigger);
		await waitFor(() => expect(canvas.queryByText('Set the dimensions for the layer.')).toBeNull());
	}}
>
	{#snippet template(args)}
		<Popover {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary">Profile</Button>
			{/snippet}
		</Popover>
	{/snippet}
</Story>

<Story
	name="Test: hover mode opens on keyboard focus"
	tags={['!dev', '!autodocs']}
	args={{ hover: true }}
	play={async ({ canvas, userEvent }) => {
		await userEvent.tab();
		await waitFor(() =>
			expect(canvas.getByText('Set the dimensions for the layer.')).toBeVisible()
		);
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(canvas.queryByText('Set the dimensions for the layer.')).toBeNull());
	}}
>
	{#snippet template(args)}
		<Popover {...args}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary">Profile</Button>
			{/snippet}
		</Popover>
	{/snippet}
</Story>
