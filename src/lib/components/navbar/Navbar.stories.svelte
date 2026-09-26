<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, waitFor } from 'storybook/test';
	import Navbar from './Navbar.svelte';
	import Button from '../button/Button.svelte';
	import NavigationMenuItem from '../navigation-menu/NavigationMenuItem.svelte';
	import NavigationMenuLink from '../navigation-menu/NavigationMenuLink.svelte';
	import { BookOpen, Menu, Palette, Rocket, Sun, X } from '../../icons.js';

	const { Story } = defineMeta({
		title: 'Components/Navbar',
		component: Navbar,
		tags: ['autodocs'],
		argTypes: {
			open: { control: 'boolean' },
			label: { control: 'text' },
			logo: { control: false },
			actions: { control: false },
			trigger: { control: false },
			children: { control: false }
		},
		args: {
			open: false,
			label: 'Main'
		},
		parameters: {
			layout: 'fullscreen',
			docs: { story: { height: '360px' } }
		}
	});

	const logoStyle =
		'font-weight: 600; font-size: 16px; color: var(--color-text); text-decoration: none;';
</script>

{#snippet logo()}
	<a href="#home" style={logoStyle}>svelte-ui</a>
{/snippet}

{#snippet actions()}
	<Button variant="secondary" size="lg" icon={Sun} label="Toggle theme" />
{/snippet}

{#snippet trigger(props: Record<string, unknown>, open: boolean)}
	<Button {...props} variant="secondary" size="lg" icon={open ? X : Menu} label="Menu" />
{/snippet}

{#snippet items()}
	<NavigationMenuItem href="#start">Start</NavigationMenuItem>
	<NavigationMenuItem active>
		Guides
		{#snippet items()}
			<NavigationMenuLink href="#introduction" icon={BookOpen} description="What the library is.">
				Introduction
			</NavigationMenuLink>
			<NavigationMenuLink
				href="#installation"
				icon={Rocket}
				description="Install and import."
				active
			>
				Installation
			</NavigationMenuLink>
			<NavigationMenuLink href="#theming" icon={Palette} description="Light and dark mode.">
				Theming
			</NavigationMenuLink>
		{/snippet}
	</NavigationMenuItem>
	<NavigationMenuItem href="#posts">Posts</NavigationMenuItem>
{/snippet}

<Story name="Content">
	{#snippet template(args)}
		<Navbar open={args.open} label={args.label} {logo} {actions} {trigger}>
			{@render items()}
		</Navbar>
	{/snippet}
</Story>

<Story
	name="Mobile"
	args={{ open: true }}
	globals={{ viewport: { value: 'mobile1', isRotated: false } }}
>
	{#snippet template(args)}
		<Navbar open={args.open} label={args.label} {logo} {actions} {trigger}>
			{@render items()}
		</Navbar>
	{/snippet}
</Story>

<Story name="Scroll" parameters={{ docs: { story: { inline: false, iframeHeight: 360 } } }}>
	{#snippet template(args)}
		<Navbar open={args.open} label={args.label} {logo} {actions} {trigger}>
			{@render items()}
		</Navbar>
		<main style="max-width: 640px; padding: 16px; line-height: 1.6;">
			{#each { length: 12 }, index (index)}
				<p>
					The navbar stays at the top while the page scrolls beneath it. Open the menu on a narrow
					screen and the page behind it can neither scroll nor take focus.
				</p>
			{/each}
		</main>
	{/snippet}
</Story>

<Story
	name="Test: trigger opens the mobile menu and escape closes it"
	tags={['!dev', '!autodocs']}
	globals={{ viewport: { value: 'mobile1', isRotated: false } }}
	play={async ({ canvas, userEvent }) => {
		const menu = canvas.getByRole('button', { name: 'Menu' });
		await userEvent.click(menu);
		await expect(menu).toHaveAttribute('aria-expanded', 'true');
		const link = await waitFor(() => canvas.getAllByRole('link', { name: 'Posts' }).at(-1)!);
		await waitFor(() => expect(link).toBeVisible());
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(menu).toHaveAttribute('aria-expanded', 'false'));
		await expect(menu).toHaveFocus();
	}}
>
	{#snippet template(args)}
		<Navbar open={args.open} label={args.label} {logo} {trigger}>
			{@render items()}
		</Navbar>
	{/snippet}
</Story>

<Story
	name="Test: submenus start collapsed and links close the mobile menu"
	tags={['!dev', '!autodocs']}
	globals={{ viewport: { value: 'mobile1', isRotated: false } }}
	play={async ({ canvas, userEvent }) => {
		const menu = canvas.getByRole('button', { name: 'Menu' });
		await userEvent.click(menu);
		const guides = await waitFor(() => canvas.getAllByRole('button', { name: 'Guides' }).at(-1)!);
		await expect(guides).toHaveAttribute('aria-expanded', 'false');
		await userEvent.click(guides);
		const link = await waitFor(() => canvas.getByRole('link', { name: /Introduction/ }));
		await userEvent.click(link);
		await waitFor(() => expect(menu).toHaveAttribute('aria-expanded', 'false'));
	}}
>
	{#snippet template(args)}
		<Navbar open={args.open} label={args.label} {logo} {trigger}>
			{@render items()}
		</Navbar>
	{/snippet}
</Story>

<Story
	name="Test: focus moves into the mobile menu and the page behind is inert"
	tags={['!dev', '!autodocs']}
	globals={{ viewport: { value: 'mobile1', isRotated: false } }}
	play={async ({ canvas, userEvent }) => {
		const behind = canvas.getByRole('button', { name: 'Behind' });
		await userEvent.click(canvas.getByRole('button', { name: 'Menu' }));
		await waitFor(() =>
			expect(canvas.getAllByRole('link', { name: 'Start' }).at(-1)).toHaveFocus()
		);
		await expect(behind.closest('[inert]')).not.toBeNull();
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(behind.closest('[inert]')).toBeNull());
	}}
>
	{#snippet template(args)}
		<Navbar open={args.open} label={args.label} {logo} {trigger}>
			{@render items()}
		</Navbar>
		<Button variant="secondary">Behind</Button>
	{/snippet}
</Story>
