<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn } from 'storybook/test';
	import Button from './Button.svelte';
	import { ArrowLeft, ArrowUpRight, Link, Pause } from '../../icons.js';

	const variants = ['primary', 'secondary', 'ghost', 'overlay'] as const;
	const sizes = ['sm', 'md', 'lg'] as const;

	const { Story } = defineMeta({
		title: 'Components/Button',
		component: Button,
		tags: ['autodocs'],
		argTypes: {
			variant: { control: 'select', options: variants },
			size: { control: 'inline-radio', options: sizes },
			disabled: { control: 'boolean' },
			href: { control: 'text' },
			label: { control: 'text' },
			icon: { control: false },
			children: { control: false }
		},
		args: {
			variant: 'primary',
			size: 'md',
			icon: ArrowUpRight,
			onclick: fn()
		}
	});

	const row = 'display: flex; flex-wrap: wrap; gap: 8px; align-items: center;';
	const media =
		'display: inline-flex; padding: 12px; border-radius: 12px; background: linear-gradient(135deg, #f97316, #a855f7 60%, #0ea5e9);';
</script>

<Story name="Variants" parameters={{ controls: { exclude: ['variant'] } }}>
	{#snippet template(args)}
		<div style={row}>
			<Button {...args} variant="primary">Primary</Button>
			<Button {...args} variant="secondary">Secondary</Button>
			<Button {...args} variant="ghost">Ghost</Button>
			<div style={media}>
				<Button {...args} variant="overlay">Overlay</Button>
			</div>
		</div>
	{/snippet}
</Story>

<Story name="Sizes" parameters={{ controls: { exclude: ['size'] } }}>
	{#snippet template(args)}
		<div style={row}>
			{#each sizes as size (size)}
				<Button {...args} {size}>Size {size}</Button>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Content" parameters={{ controls: { exclude: ['icon', 'label'] } }}>
	{#snippet template(args)}
		<div style={row}>
			<Button {...args} icon={ArrowUpRight}>Icon and label</Button>
			<Button {...args} icon={undefined}>Label only</Button>
			<Button {...args} icon={Link} label="Copy link" />
		</div>
	{/snippet}
</Story>

<Story name="States" parameters={{ controls: { exclude: ['disabled'] } }}>
	{#snippet template(args)}
		<div style={row}>
			<Button {...args}>Enabled</Button>
			<Button {...args} disabled>Disabled</Button>
		</div>
	{/snippet}
</Story>

<Story name="Link" args={{ variant: 'secondary' }} parameters={{ controls: { exclude: ['href'] } }}>
	{#snippet template(args)}
		<div style={row}>
			<Button {...args} icon={ArrowLeft} href="#previous">Internal link</Button>
			<Button {...args} icon={ArrowUpRight} href="https://svelte.dev">External link</Button>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: click"
	tags={['!dev', '!autodocs']}
	args={{ icon: Pause, label: 'Pause' }}
	play={async ({ args, canvas, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
		await expect(args.onclick).toHaveBeenCalledOnce();
	}}
/>

<Story
	name="Test: disabled blocks click"
	tags={['!dev', '!autodocs']}
	args={{ disabled: true }}
	play={async ({ args, canvas }) => {
		const button = canvas.getByRole('button');
		await expect(button).toBeDisabled();
		button.click();
		await expect(args.onclick).not.toHaveBeenCalled();
	}}
>
	{#snippet template(args)}
		<Button {...args}>Disabled</Button>
	{/snippet}
</Story>

<Story
	name="Test: external link opens in new tab"
	tags={['!dev', '!autodocs']}
	args={{ href: 'https://svelte.dev' }}
	play={async ({ canvas }) => {
		const link = canvas.getByRole('link');
		await expect(link).toHaveAttribute('target', '_blank');
		await expect(link).toHaveAttribute('rel', 'noopener');
	}}
>
	{#snippet template(args)}
		<Button {...args}>Svelte</Button>
	{/snippet}
</Story>
