<script module lang="ts">
	import type { Component, ComponentProps } from 'svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, waitFor } from 'storybook/test';
	import Sidebar from './Sidebar.svelte';
	import SidebarContent from './SidebarContent.svelte';
	import SidebarFooter from './SidebarFooter.svelte';
	import SidebarGroup from './SidebarGroup.svelte';
	import SidebarHeader from './SidebarHeader.svelte';
	import SidebarInset from './SidebarInset.svelte';
	import SidebarMenu from './SidebarMenu.svelte';
	import SidebarMenuItem from './SidebarMenuItem.svelte';
	import SidebarProvider from './SidebarProvider.svelte';
	import SidebarSeparator from './SidebarSeparator.svelte';
	import SidebarTrigger from './SidebarTrigger.svelte';
	import Breadcrumb from '../breadcrumb/Breadcrumb.svelte';
	import BreadcrumbItem from '../breadcrumb/BreadcrumbItem.svelte';
	import ContextMenuItem from '../context-menu/ContextMenuItem.svelte';
	import {
		BookOpen,
		Calendar,
		ChartLine,
		FileText,
		Folder,
		GalleryVerticalEnd,
		House,
		Inbox,
		LogOut,
		Pencil,
		Search,
		Settings,
		Share,
		Trash,
		Users
	} from '../../icons.js';

	const sides = ['left', 'right'] as const;
	const variants = ['sidebar', 'floating'] as const;
	const collapsibles = ['offcanvas', 'icon', 'none'] as const;

	const { Story } = defineMeta({
		title: 'Components/Sidebar',
		component: Sidebar as Component<ComponentProps<typeof Sidebar> & { open?: boolean }>,
		tags: ['autodocs'],
		argTypes: {
			side: { control: 'inline-radio', options: sides },
			variant: { control: 'inline-radio', options: variants },
			collapsible: { control: 'inline-radio', options: collapsibles },
			open: { control: 'boolean', description: 'Set on `SidebarProvider`.' },
			children: { control: false }
		},
		args: {
			side: 'left',
			variant: 'sidebar',
			collapsible: 'icon',
			open: true
		}
	});

	const frame =
		'--sidebar-height: 440px; border: 1px solid var(--color-border); border-radius: 12px; overflow: hidden;';
	const stack = 'display: flex; flex-direction: column; gap: 16px;';
	const topbar =
		'display: flex; align-items: center; gap: 8px; height: 48px; padding: 0 12px; border-bottom: 1px solid var(--color-border);';
	const placeholder =
		'flex: 1; margin: 16px; border-radius: 10px; background-color: var(--color-surface);';
</script>

{#snippet page()}
	<SidebarInset>
		<header style={topbar}>
			<SidebarTrigger />
			<Breadcrumb>
				<BreadcrumbItem href="#projects">Projects</BreadcrumbItem>
				<BreadcrumbItem>Overview</BreadcrumbItem>
			</Breadcrumb>
		</header>
		<div style={placeholder}></div>
	</SidebarInset>
{/snippet}

{#snippet header()}
	<SidebarHeader>
		<SidebarMenu>
			<SidebarMenuItem icon={GalleryVerticalEnd}>Acme Inc</SidebarMenuItem>
		</SidebarMenu>
	</SidebarHeader>
{/snippet}

{#snippet footer()}
	<SidebarFooter>
		<SidebarMenu>
			<SidebarMenuItem href="#settings" icon={Settings}>Settings</SidebarMenuItem>
			<SidebarMenuItem icon={LogOut}>Log out</SidebarMenuItem>
		</SidebarMenu>
	</SidebarFooter>
{/snippet}

{#snippet basicContent()}
	<SidebarContent>
		<SidebarGroup label="Application">
			<SidebarMenu>
				<SidebarMenuItem href="#home" icon={House} active>Home</SidebarMenuItem>
				<SidebarMenuItem href="#inbox" icon={Inbox}>Inbox</SidebarMenuItem>
				<SidebarMenuItem href="#calendar" icon={Calendar}>Calendar</SidebarMenuItem>
				<SidebarMenuItem href="#search" icon={Search}>Search</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	</SidebarContent>
{/snippet}

<Story name="Items">
	{#snippet template({ open, side, variant, collapsible })}
		<SidebarProvider {open} style={frame}>
			<Sidebar {side} {variant} {collapsible}>
				{@render header()}
				<SidebarContent>
					<SidebarGroup label="Application">
						<SidebarMenu>
							<SidebarMenuItem href="#home" icon={House} active>Home</SidebarMenuItem>
							<SidebarMenuItem href="#inbox" icon={Inbox}>Inbox</SidebarMenuItem>
							<SidebarMenuItem href="#calendar" icon={Calendar}>Calendar</SidebarMenuItem>
							<SidebarMenuItem href="#search" icon={Search}>Search</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroup>
					<SidebarSeparator />
					<SidebarGroup label="Workspace">
						<SidebarMenu>
							<SidebarMenuItem href="#analytics" icon={ChartLine}>Analytics</SidebarMenuItem>
							<SidebarMenuItem href="#team" icon={Users}>Team</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>
				{@render footer()}
			</Sidebar>
			{@render page()}
		</SidebarProvider>
	{/snippet}
</Story>

<Story name="Submenus">
	{#snippet template({ open, side, variant, collapsible })}
		<SidebarProvider {open} style={frame}>
			<Sidebar {side} {variant} {collapsible}>
				{@render header()}
				<SidebarContent>
					<SidebarGroup label="Documentation">
						<SidebarMenu>
							<SidebarMenuItem icon={BookOpen} expanded>
								Getting started
								{#snippet items()}
									<SidebarMenuItem href="#installation">Installation</SidebarMenuItem>
									<SidebarMenuItem href="#theming" active>Theming</SidebarMenuItem>
									<SidebarMenuItem href="#icons">Icons</SidebarMenuItem>
								{/snippet}
							</SidebarMenuItem>
							<SidebarMenuItem icon={FileText}>
								Components
								{#snippet items()}
									<SidebarMenuItem href="#button">Button</SidebarMenuItem>
									<SidebarMenuItem href="#sidebar">Sidebar</SidebarMenuItem>
								{/snippet}
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>
				{@render footer()}
			</Sidebar>
			{@render page()}
		</SidebarProvider>
	{/snippet}
</Story>

<Story name="Badges and menus">
	{#snippet template({ open, side, variant, collapsible })}
		<SidebarProvider {open} style={frame}>
			<Sidebar {side} {variant} {collapsible}>
				{@render header()}
				<SidebarContent>
					<SidebarGroup label="Mail">
						<SidebarMenu>
							<SidebarMenuItem href="#inbox" icon={Inbox} badge={24} active>Inbox</SidebarMenuItem>
							<SidebarMenuItem href="#drafts" icon={FileText} badge={3}>Drafts</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroup>
					<SidebarGroup label="Projects">
						<SidebarMenu>
							{#each ['Design engineering', 'Sales & marketing', 'Travel'] as project (project)}
								<SidebarMenuItem href="#{project}" icon={Folder}>
									{project}
									{#snippet menu()}
										<ContextMenuItem icon={Pencil}>Rename</ContextMenuItem>
										<ContextMenuItem icon={Share}>Share</ContextMenuItem>
										<ContextMenuItem icon={Trash}>Delete</ContextMenuItem>
									{/snippet}
								</SidebarMenuItem>
							{/each}
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>
				{@render footer()}
			</Sidebar>
			{@render page()}
		</SidebarProvider>
	{/snippet}
</Story>

<Story name="Variants" parameters={{ controls: { exclude: ['variant'] } }}>
	{#snippet template({ open, side, collapsible })}
		<div style={stack}>
			{#each variants as variant (variant)}
				<SidebarProvider {open} style={frame}>
					<Sidebar {side} {variant} {collapsible}>
						{@render header()}
						{@render basicContent()}
						{@render footer()}
					</Sidebar>
					{@render page()}
				</SidebarProvider>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Sides" parameters={{ controls: { exclude: ['side'] } }}>
	{#snippet template({ open, variant, collapsible })}
		<div style={stack}>
			{#each sides as side (side)}
				<SidebarProvider {open} style={frame}>
					<Sidebar {side} {variant} {collapsible}>
						{@render header()}
						{@render basicContent()}
						{@render footer()}
					</Sidebar>
					{@render page()}
				</SidebarProvider>
			{/each}
		</div>
	{/snippet}
</Story>

<Story
	name="Collapsible"
	args={{ open: false }}
	parameters={{ controls: { exclude: ['collapsible'] } }}
>
	{#snippet template({ open, side, variant })}
		<div style={stack}>
			{#each collapsibles as collapsible (collapsible)}
				<SidebarProvider {open} style={frame}>
					<Sidebar {side} {variant} {collapsible}>
						{@render header()}
						{@render basicContent()}
						{@render footer()}
					</Sidebar>
					{@render page()}
				</SidebarProvider>
			{/each}
		</div>
	{/snippet}
</Story>

<Story
	name="Test: trigger collapses and expands"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, canvasElement, userEvent }) => {
		const trigger = canvas.getByRole('button', { name: 'Toggle sidebar' });
		const sidebar = canvasElement.querySelector('aside')!;
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		await expect(sidebar).toHaveAttribute('data-state', 'expanded');
		await userEvent.click(trigger);
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await expect(sidebar).toHaveAttribute('data-state', 'collapsed');
		await userEvent.click(trigger);
		await expect(sidebar).toHaveAttribute('data-state', 'expanded');
	}}
>
	{#snippet template({ open, side, variant, collapsible })}
		<SidebarProvider {open} style={frame}>
			<Sidebar {side} {variant} {collapsible}>{@render basicContent()}</Sidebar>
			{@render page()}
		</SidebarProvider>
	{/snippet}
</Story>

<Story
	name="Test: icon mode keeps accessible names"
	tags={['!dev', '!autodocs']}
	args={{ open: false, collapsible: 'icon' }}
	play={async ({ canvas }) => {
		await expect(canvas.getByRole('link', { name: 'Inbox' })).toBeVisible();
	}}
>
	{#snippet template({ open, side, variant, collapsible })}
		<SidebarProvider {open} style={frame}>
			<Sidebar {side} {variant} {collapsible}>{@render basicContent()}</Sidebar>
			{@render page()}
		</SidebarProvider>
	{/snippet}
</Story>

<Story
	name="Test: offcanvas hides items when collapsed"
	tags={['!dev', '!autodocs']}
	args={{ open: false, collapsible: 'offcanvas' }}
	play={async ({ canvasElement }) => {
		await expect(canvasElement.querySelector('aside')).toHaveAttribute('inert');
	}}
>
	{#snippet template({ open, side, variant, collapsible })}
		<SidebarProvider {open} style={frame}>
			<Sidebar {side} {variant} {collapsible}>{@render basicContent()}</Sidebar>
			{@render page()}
		</SidebarProvider>
	{/snippet}
</Story>

<Story
	name="Test: active item is the current page"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		await expect(canvas.getByRole('link', { name: 'Home' })).toHaveAttribute(
			'aria-current',
			'page'
		);
		await expect(canvas.getByRole('link', { name: 'Inbox' })).not.toHaveAttribute('aria-current');
	}}
>
	{#snippet template({ open, side, variant, collapsible })}
		<SidebarProvider {open} style={frame}>
			<Sidebar {side} {variant} {collapsible}>{@render basicContent()}</Sidebar>
			{@render page()}
		</SidebarProvider>
	{/snippet}
</Story>

<Story
	name="Test: submenu toggles"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const parent = canvas.getByRole('button', { name: 'Components' });
		await expect(parent).toHaveAttribute('aria-expanded', 'false');
		await expect(canvas.queryByRole('link', { name: 'Button' })).toBeNull();
		await userEvent.click(parent);
		await expect(parent).toHaveAttribute('aria-expanded', 'true');
		await expect(canvas.getByRole('link', { name: 'Button' })).toBeInTheDocument();
		await userEvent.click(parent);
		await waitFor(() => expect(canvas.queryByRole('link', { name: 'Button' })).toBeNull());
	}}
>
	{#snippet template({ open, side, variant, collapsible })}
		<SidebarProvider {open} style={frame}>
			<Sidebar {side} {variant} {collapsible}>
				<SidebarContent>
					<SidebarGroup>
						<SidebarMenu>
							<SidebarMenuItem icon={FileText}>
								Components
								{#snippet items()}
									<SidebarMenuItem href="#button">Button</SidebarMenuItem>
								{/snippet}
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>
			{@render page()}
		</SidebarProvider>
	{/snippet}
</Story>

<Story
	name="Test: item menu opens"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'More' }));
		await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Rename' })).toHaveFocus());
	}}
>
	{#snippet template({ open, side, variant, collapsible })}
		<SidebarProvider {open} style={frame}>
			<Sidebar {side} {variant} {collapsible}>
				<SidebarContent>
					<SidebarGroup>
						<SidebarMenu>
							<SidebarMenuItem href="#travel" icon={Folder}>
								Travel
								{#snippet menu()}
									<ContextMenuItem icon={Pencil}>Rename</ContextMenuItem>
								{/snippet}
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>
			{@render page()}
		</SidebarProvider>
	{/snippet}
</Story>
