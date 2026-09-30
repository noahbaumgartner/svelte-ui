<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import EmptyState from './EmptyState.svelte';
	import Button from '../button/Button.svelte';
	import { FolderOpen, Plus } from '../../icons.js';

	const variants = ['secondary', 'outline'] as const;

	const { Story } = defineMeta({
		title: 'Components/EmptyState',
		component: EmptyState,
		tags: ['autodocs'],
		argTypes: {
			variant: { control: 'inline-radio', options: variants },
			title: { control: 'text' },
			description: { control: 'text' },
			icon: { control: false },
			children: { control: false }
		},
		args: {
			variant: 'secondary',
			icon: FolderOpen,
			title: 'No projects yet',
			description: 'Projects group your tasks and files. Create one to get started.'
		}
	});

	const column = 'display: flex; flex-direction: column; gap: 16px; max-width: 480px;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<div style={column}>
			<EmptyState {...args}>
				<Button icon={Plus}>New project</Button>
			</EmptyState>
		</div>
	{/snippet}
</Story>

<Story name="Variants" parameters={{ controls: { exclude: ['variant'] } }}>
	{#snippet template(args)}
		<div style={column}>
			{#each variants as variant (variant)}
				<EmptyState {...args} {variant} />
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Content" parameters={{ controls: { exclude: ['icon', 'description'] } }}>
	{#snippet template(args)}
		<div style={column}>
			<EmptyState {...args} icon={undefined} description={undefined} />
			<EmptyState {...args} description={undefined} />
			<EmptyState {...args} />
			<EmptyState {...args}>
				<Button variant="outline">Import</Button>
				<Button icon={Plus}>New project</Button>
			</EmptyState>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: shows text and actions"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		await expect(canvas.getByText('No projects yet')).toBeVisible();
		await expect(canvas.getByText(/Create one to get started/)).toBeVisible();
		await expect(canvas.getByRole('button', { name: 'New project' })).toBeVisible();
	}}
>
	{#snippet template(args)}
		<EmptyState {...args}>
			<Button icon={Plus}>New project</Button>
		</EmptyState>
	{/snippet}
</Story>
