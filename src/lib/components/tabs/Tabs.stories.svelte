<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn } from 'storybook/test';
	import Tabs from './Tabs.svelte';
	import { Bell, Settings, User } from '../../icons.js';

	const sizes = ['sm', 'md'] as const;

	const sections = [
		{ value: 'account', label: 'Account' },
		{ value: 'notifications', label: 'Notifications' },
		{ value: 'billing', label: 'Billing' }
	];

	const { Story } = defineMeta({
		title: 'Components/Tabs',
		component: Tabs,
		tags: ['autodocs'],
		argTypes: {
			value: { control: 'select', options: sections.map((section) => section.value) },
			options: { control: 'object' },
			label: { control: 'text' },
			size: { control: 'inline-radio', options: sizes },
			children: { control: false }
		},
		args: {
			value: 'account',
			options: sections,
			label: 'Settings',
			size: 'md'
		}
	});

	const months = Array.from({ length: 12 }, (_, i) => ({
		value: String(i),
		label: new Date(2026, i, 1).toLocaleString('en', { month: 'long' })
	}));

	const column = 'display: flex; flex-direction: column; gap: 16px; align-items: flex-start;';
	const onchange = fn();
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<Tabs {...args}>
			{#snippet children(value)}
				Settings for {value}.
			{/snippet}
		</Tabs>
	{/snippet}
</Story>

<Story name="Sizes" parameters={{ controls: { exclude: ['size'] } }}>
	{#snippet template(args)}
		<div style={column}>
			{#each sizes as size (size)}
				<Tabs {...args} {size} label="Settings {size}" />
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Content" parameters={{ controls: { exclude: ['options'] } }}>
	{#snippet template(args)}
		<div style={column}>
			<Tabs {...args} label="Text" />
			<Tabs
				{...args}
				label="Icons"
				options={[
					{ value: 'account', label: 'Account', icon: User },
					{ value: 'notifications', label: 'Notifications', icon: Bell },
					{ value: 'billing', label: 'Billing', icon: Settings }
				]}
			/>
			<Tabs
				{...args}
				label="Disabled"
				options={[...sections, { value: 'team', label: 'Team', disabled: true }]}
			/>
		</div>
	{/snippet}
</Story>

<Story name="Links" parameters={{ controls: { exclude: ['options', 'children'] } }}>
	{#snippet template(args)}
		<Tabs
			{...args}
			options={sections.map((section) => ({ ...section, href: `#${section.value}` }))}
		/>
	{/snippet}
</Story>

<Story name="Overflow" parameters={{ controls: { exclude: ['options', 'value'] } }}>
	{#snippet template(args)}
		<div style="max-width: 320px;">
			<Tabs size={args.size} label="Month" options={months} value="0" />
		</div>
	{/snippet}
</Story>

<Story
	name="Test: selects on click and shows the panel"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		onchange.mockClear();
		const account = canvas.getByRole('tab', { name: 'Account' });
		const billing = canvas.getByRole('tab', { name: 'Billing' });
		await expect(account).toHaveAttribute('aria-selected', 'true');
		await expect(canvas.getByRole('tabpanel', { name: 'Account' })).toHaveTextContent(
			'Settings for account.'
		);
		await userEvent.click(billing);
		await expect(onchange).toHaveBeenCalledOnce();
		await expect(onchange).toHaveBeenLastCalledWith('billing');
		await expect(billing).toHaveAttribute('aria-selected', 'true');
		await expect(account).toHaveAttribute('aria-selected', 'false');
		await expect(canvas.getByRole('tabpanel', { name: 'Billing' })).toHaveTextContent(
			'Settings for billing.'
		);
	}}
>
	{#snippet template(args)}
		<Tabs {...args} {onchange}>
			{#snippet children(value)}
				Settings for {value}.
			{/snippet}
		</Tabs>
	{/snippet}
</Story>

<Story
	name="Test: arrow keys move the selection and wrap around"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		await userEvent.tab();
		await expect(canvas.getByRole('tab', { name: 'Account' })).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		const notifications = canvas.getByRole('tab', { name: 'Notifications' });
		await expect(notifications).toHaveFocus();
		await expect(notifications).toHaveAttribute('aria-selected', 'true');
		await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
		await expect(canvas.getByRole('tab', { name: 'Billing' })).toHaveAttribute(
			'aria-selected',
			'true'
		);
	}}
>
	{#snippet template(args)}
		<Tabs {...args} />
	{/snippet}
</Story>

<Story
	name="Test: options with href render as links"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		await expect(canvas.getByRole('navigation', { name: 'Settings' })).toBeVisible();
		const account = canvas.getByRole('link', { name: 'Account' });
		await expect(account).toHaveAttribute('href', '#account');
		await expect(account).toHaveAttribute('aria-current', 'page');
		await expect(canvas.getByRole('link', { name: 'Billing' })).not.toHaveAttribute('aria-current');
	}}
>
	{#snippet template(args)}
		<Tabs
			{...args}
			options={sections.map((section) => ({ ...section, href: `#${section.value}` }))}
		/>
	{/snippet}
</Story>
