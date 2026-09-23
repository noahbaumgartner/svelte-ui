<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, waitFor } from 'storybook/test';
	import Breadcrumb from './Breadcrumb.svelte';
	import BreadcrumbItem from './BreadcrumbItem.svelte';
	import BreadcrumbEllipsis from './BreadcrumbEllipsis.svelte';
	import ContextMenuItem from '../context-menu/ContextMenuItem.svelte';
	import { House } from '../../icons.js';

	const { Story } = defineMeta({
		title: 'Components/Breadcrumb',
		component: Breadcrumb,
		tags: ['autodocs'],
		argTypes: {
			children: { control: false }
		}
	});
</script>

<Story name="Items">
	{#snippet template()}
		<Breadcrumb>
			<BreadcrumbItem href="#home">Home</BreadcrumbItem>
			<BreadcrumbItem href="#components">Components</BreadcrumbItem>
			<BreadcrumbItem>Breadcrumb</BreadcrumbItem>
		</Breadcrumb>
	{/snippet}
</Story>

<Story name="Icons">
	{#snippet template()}
		<Breadcrumb>
			<BreadcrumbItem href="#home" icon={House}>Home</BreadcrumbItem>
			<BreadcrumbItem href="#components">Components</BreadcrumbItem>
			<BreadcrumbItem>Breadcrumb</BreadcrumbItem>
		</Breadcrumb>
	{/snippet}
</Story>

<Story name="Collapsed" parameters={{ docs: { story: { height: '200px' } } }}>
	{#snippet template()}
		<Breadcrumb>
			<BreadcrumbItem href="#home">Home</BreadcrumbItem>
			<BreadcrumbEllipsis>
				<ContextMenuItem>Documentation</ContextMenuItem>
				<ContextMenuItem>Themes</ContextMenuItem>
				<ContextMenuItem>GitHub</ContextMenuItem>
			</BreadcrumbEllipsis>
			<BreadcrumbItem href="#components">Components</BreadcrumbItem>
			<BreadcrumbItem>Breadcrumb</BreadcrumbItem>
		</Breadcrumb>
	{/snippet}
</Story>

<Story
	name="Test: last item is the current page"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		await expect(canvas.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
		await expect(canvas.getAllByRole('link')).toHaveLength(2);
		await expect(canvas.getByText('Breadcrumb')).toHaveAttribute('aria-current', 'page');
	}}
>
	{#snippet template()}
		<Breadcrumb>
			<BreadcrumbItem href="#home">Home</BreadcrumbItem>
			<BreadcrumbItem href="#components">Components</BreadcrumbItem>
			<BreadcrumbItem>Breadcrumb</BreadcrumbItem>
		</Breadcrumb>
	{/snippet}
</Story>

<Story
	name="Test: separators sit only between items"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, canvasElement }) => {
		await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
		const visible = Array.from(canvasElement.querySelectorAll('.breadcrumb-separator')).filter(
			(separator) => getComputedStyle(separator).display !== 'none'
		);
		await expect(visible).toHaveLength(2);
	}}
>
	{#snippet template()}
		<Breadcrumb>
			<BreadcrumbItem href="#home">Home</BreadcrumbItem>
			<BreadcrumbItem href="#components">Components</BreadcrumbItem>
			<BreadcrumbItem>Breadcrumb</BreadcrumbItem>
		</Breadcrumb>
	{/snippet}
</Story>

<Story
	name="Test: ellipsis opens the collapsed items"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'More' }));
		await waitFor(() =>
			expect(canvas.getByRole('menuitem', { name: 'Documentation' })).toHaveFocus()
		);
	}}
>
	{#snippet template()}
		<Breadcrumb>
			<BreadcrumbItem href="#home">Home</BreadcrumbItem>
			<BreadcrumbEllipsis>
				<ContextMenuItem>Documentation</ContextMenuItem>
			</BreadcrumbEllipsis>
			<BreadcrumbItem>Breadcrumb</BreadcrumbItem>
		</Breadcrumb>
	{/snippet}
</Story>
