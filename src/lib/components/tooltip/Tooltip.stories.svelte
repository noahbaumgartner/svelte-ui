<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, waitFor } from 'storybook/test';
	import Tooltip from './Tooltip.svelte';
	import Button from '../button/Button.svelte';
	import ButtonGroup from '../button-group/ButtonGroup.svelte';
	import Kbd from '../kbd/Kbd.svelte';
	import KbdGroup from '../kbd/KbdGroup.svelte';
	import { Bold, Italic, Plus, Save, Underline } from '../../icons.js';

	const sides = ['top', 'right', 'bottom', 'left'] as const;

	const { Story } = defineMeta({
		title: 'Components/Tooltip',
		component: Tooltip,
		tags: ['autodocs'],
		argTypes: {
			side: { control: 'inline-radio', options: sides },
			open: { control: 'boolean' },
			delay: { control: 'number' },
			trigger: { control: false },
			children: { control: false }
		},
		args: {
			side: 'top',
			open: false,
			delay: 0
		},
		parameters: {
			docs: { story: { height: '160px' } }
		}
	});

	const stage =
		'display: flex; flex-wrap: wrap; gap: 24px; align-items: center; justify-content: center; min-height: 120px;';
</script>

<Story name="Content">
	{#snippet template({ side, open, delay })}
		<div style={stage}>
			<Tooltip {side} {open} {delay}>
				{#snippet trigger(props)}
					<Button {...props} variant="outline">Hover</Button>
				{/snippet}
				Add to library
			</Tooltip>
			<Tooltip {side} {open} {delay}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary" icon={Save} label="Save" />
				{/snippet}
				Save <Kbd>⌘S</Kbd>
			</Tooltip>
			<Tooltip {side} {open} {delay}>
				{#snippet trigger(props)}
					<Button {...props} variant="secondary" icon={Plus} label="New file" />
				{/snippet}
				New file
				<KbdGroup>
					<Kbd>⌘</Kbd>
					<Kbd>⇧</Kbd>
					<Kbd>N</Kbd>
				</KbdGroup>
			</Tooltip>
		</div>
	{/snippet}
</Story>

<Story name="Sides" args={{ open: true }} parameters={{ controls: { exclude: ['side'] } }}>
	{#snippet template({ open, delay })}
		<div style="{stage} gap: 160px; min-height: 140px;">
			{#each sides as side (side)}
				<Tooltip {side} {open} {delay}>
					{#snippet trigger(props)}
						<Button {...props} variant="outline">{side}</Button>
					{/snippet}
					Tooltip on {side}
				</Tooltip>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Delay" parameters={{ controls: { exclude: ['delay'] } }}>
	{#snippet template({ side, open })}
		<div style={stage}>
			{#each [0, 300, 700] as delay (delay)}
				<Tooltip {side} {open} {delay}>
					{#snippet trigger(props)}
						<Button {...props} variant="outline">{delay} ms</Button>
					{/snippet}
					Shown after {delay} ms
				</Tooltip>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="In Button Group">
	{#snippet template({ side, open, delay })}
		<div style={stage}>
			<ButtonGroup label="Text formatting">
				{#each [{ icon: Bold, label: 'Bold', key: 'B' }, { icon: Italic, label: 'Italic', key: 'I' }, { icon: Underline, label: 'Underline', key: 'U' }] as item (item.label)}
					<Tooltip {side} {open} {delay}>
						{#snippet trigger(props)}
							<Button {...props} variant="secondary" icon={item.icon} label={item.label} />
						{/snippet}
						{item.label}
						<KbdGroup>
							<Kbd>⌘</Kbd>
							<Kbd>{item.key}</Kbd>
						</KbdGroup>
					</Tooltip>
				{/each}
			</ButtonGroup>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: hover shows and leave hides"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const trigger = canvas.getByRole('button', { name: 'Save' });
		await userEvent.hover(trigger);
		const tooltip = await waitFor(() => canvas.getByRole('tooltip'));
		await expect(tooltip).toHaveTextContent('Save ⌘S');
		await expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
		await userEvent.unhover(trigger);
		await waitFor(() => expect(canvas.queryByRole('tooltip')).toBeNull());
	}}
>
	{#snippet template({ side, open, delay })}
		<Tooltip {side} {open} {delay}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary" icon={Save} label="Save" />
			{/snippet}
			Save <Kbd>⌘S</Kbd>
		</Tooltip>
	{/snippet}
</Story>

<Story
	name="Test: keyboard focus shows and escape hides"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		await userEvent.tab();
		await waitFor(() => expect(canvas.getByRole('tooltip')).toBeInTheDocument());
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(canvas.queryByRole('tooltip')).toBeNull());
		await expect(canvas.getByRole('button', { name: 'Save' })).toHaveFocus();
	}}
>
	{#snippet template({ side, open, delay })}
		<Tooltip {side} {open} {delay}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary" icon={Save} label="Save" />
			{/snippet}
			Save
		</Tooltip>
	{/snippet}
</Story>

<Story
	name="Test: click hides"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const trigger = canvas.getByRole('button', { name: 'Save' });
		await userEvent.hover(trigger);
		await waitFor(() => expect(canvas.getByRole('tooltip')).toBeInTheDocument());
		await userEvent.click(trigger);
		await waitFor(() => expect(canvas.queryByRole('tooltip')).toBeNull());
	}}
>
	{#snippet template({ side, open, delay })}
		<Tooltip {side} {open} {delay}>
			{#snippet trigger(props)}
				<Button {...props} variant="secondary" icon={Save} label="Save" />
			{/snippet}
			Save
		</Tooltip>
	{/snippet}
</Story>
