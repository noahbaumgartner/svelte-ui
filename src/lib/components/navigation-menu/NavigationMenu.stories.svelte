<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, waitFor } from 'storybook/test';
	import NavigationMenu from './NavigationMenu.svelte';
	import NavigationMenuItem from './NavigationMenuItem.svelte';
	import NavigationMenuLink from './NavigationMenuLink.svelte';
	import { BookOpen, Box, Palette, Rocket } from '../../icons.js';

	const { Story } = defineMeta({
		title: 'Components/NavigationMenu',
		component: NavigationMenu,
		tags: ['autodocs'],
		argTypes: {
			label: { control: 'text' },
			children: { control: false }
		},
		args: {
			label: 'Main'
		},
		parameters: {
			docs: { story: { height: '320px' } }
		}
	});
</script>

<Story name="Items">
	{#snippet template(args)}
		<NavigationMenu label={args.label}>
			<NavigationMenuItem href="#start" active>Start</NavigationMenuItem>
			<NavigationMenuItem href="#about">About</NavigationMenuItem>
			<NavigationMenuItem href="#posts">Posts</NavigationMenuItem>
		</NavigationMenu>
	{/snippet}
</Story>

<Story name="Submenus">
	{#snippet template(args)}
		<NavigationMenu label={args.label}>
			<NavigationMenuItem>
				Getting started
				{#snippet items()}
					<NavigationMenuLink
						href="#introduction"
						icon={BookOpen}
						description="Components built with Svelte 5, styled to fit together."
					>
						Introduction
					</NavigationMenuLink>
					<NavigationMenuLink
						href="#installation"
						icon={Rocket}
						description="How to install the library and import the tokens."
					>
						Installation
					</NavigationMenuLink>
					<NavigationMenuLink
						href="#theming"
						icon={Palette}
						description="Light and dark mode from two base colours."
					>
						Theming
					</NavigationMenuLink>
				{/snippet}
			</NavigationMenuItem>
			<NavigationMenuItem>
				Components
				{#snippet items()}
					<NavigationMenuLink href="#button" icon={Box}>Button</NavigationMenuLink>
					<NavigationMenuLink href="#dialog" icon={Box}>Dialog</NavigationMenuLink>
					<NavigationMenuLink href="#popover" icon={Box}>Popover</NavigationMenuLink>
				{/snippet}
			</NavigationMenuItem>
			<NavigationMenuItem href="#docs">Docs</NavigationMenuItem>
		</NavigationMenu>
	{/snippet}
</Story>

<Story name="Columns">
	{#snippet template(args)}
		<NavigationMenu label={args.label}>
			<NavigationMenuItem columns={2}>
				Components
				{#snippet items()}
					<NavigationMenuLink href="#alert-dialog" description="A modal that interrupts the user.">
						Alert Dialog
					</NavigationMenuLink>
					<NavigationMenuLink href="#popover" description="Rich content next to a trigger.">
						Popover
					</NavigationMenuLink>
					<NavigationMenuLink href="#toaster" description="A short message that goes away.">
						Toaster
					</NavigationMenuLink>
					<NavigationMenuLink href="#tooltip" description="A hint shown on hover or focus.">
						Tooltip
					</NavigationMenuLink>
				{/snippet}
			</NavigationMenuItem>
			<NavigationMenuItem columns={3}>
				Icons
				{#snippet items()}
					<NavigationMenuLink href="#book" icon={BookOpen}>Book</NavigationMenuLink>
					<NavigationMenuLink href="#box" icon={Box}>Box</NavigationMenuLink>
					<NavigationMenuLink href="#palette" icon={Palette}>Palette</NavigationMenuLink>
				{/snippet}
			</NavigationMenuItem>
		</NavigationMenu>
	{/snippet}
</Story>

<Story name="Active">
	{#snippet template(args)}
		<NavigationMenu label={args.label}>
			<NavigationMenuItem href="#start">Start</NavigationMenuItem>
			<NavigationMenuItem active>
				Components
				{#snippet items()}
					<NavigationMenuLink href="#button">Button</NavigationMenuLink>
					<NavigationMenuLink href="#dialog" active>Dialog</NavigationMenuLink>
				{/snippet}
			</NavigationMenuItem>
		</NavigationMenu>
	{/snippet}
</Story>

{#snippet testMenu()}
	<NavigationMenu>
		<NavigationMenuItem>
			Guides
			{#snippet items()}
				<NavigationMenuLink href="#intro">Introduction</NavigationMenuLink>
				<NavigationMenuLink href="#install">Installation</NavigationMenuLink>
			{/snippet}
		</NavigationMenuItem>
		<NavigationMenuItem>
			Components
			{#snippet items()}
				<NavigationMenuLink href="#button">Button</NavigationMenuLink>
			{/snippet}
		</NavigationMenuItem>
		<NavigationMenuItem href="#docs">Docs</NavigationMenuItem>
	</NavigationMenu>
{/snippet}

<Story
	name="Test: click opens, escape closes and restores focus"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const trigger = canvas.getByRole('button', { name: 'Guides' });
		await userEvent.click(trigger);
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		const link = await waitFor(() => canvas.getByRole('link', { name: 'Introduction' }));
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(link).not.toBeInTheDocument());
		await expect(trigger).toHaveFocus();
	}}
>
	{#snippet template()}
		{@render testMenu()}
	{/snippet}
</Story>

<Story
	name="Test: hover opens and switches between panels"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		await userEvent.hover(canvas.getByRole('button', { name: 'Guides' }));
		await waitFor(() => canvas.getByRole('link', { name: 'Introduction' }));
		await userEvent.hover(canvas.getByRole('button', { name: 'Components' }));
		await waitFor(() => canvas.getByRole('link', { name: 'Button' }));
		await waitFor(() =>
			expect(canvas.queryByRole('link', { name: 'Introduction' })).not.toBeInTheDocument()
		);
	}}
>
	{#snippet template()}
		{@render testMenu()}
	{/snippet}
</Story>

<Story
	name="Test: arrow keys move between items and into a panel"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const guides = canvas.getByRole('button', { name: 'Guides' });
		guides.focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect(canvas.getByRole('button', { name: 'Components' })).toHaveFocus();
		await userEvent.keyboard('{ArrowLeft}{ArrowDown}');
		await waitFor(() => expect(canvas.getByRole('link', { name: 'Introduction' })).toHaveFocus());
		await userEvent.keyboard('{ArrowDown}');
		await expect(canvas.getByRole('link', { name: 'Installation' })).toHaveFocus();
	}}
>
	{#snippet template()}
		{@render testMenu()}
	{/snippet}
</Story>

<Story
	name="Test: choosing a link closes the panel"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'Guides' }));
		const link = await waitFor(() => canvas.getByRole('link', { name: 'Introduction' }));
		await userEvent.click(link);
		await waitFor(() => expect(link).not.toBeInTheDocument());
		await expect(canvas.getByRole('button', { name: 'Guides' })).toHaveAttribute(
			'aria-expanded',
			'false'
		);
	}}
>
	{#snippet template()}
		{@render testMenu()}
	{/snippet}
</Story>
