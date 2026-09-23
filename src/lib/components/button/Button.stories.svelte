<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn } from 'storybook/test';
	import Button from './Button.svelte';
	import { ArrowLeft, ArrowUpRight, Link, Pause, Plus, X } from '../../icons.js';

	const sizes = ['sm', 'md', 'lg'] as const;
	const variants = ['primary', 'secondary', 'ghost', 'overlay'] as const;

	const { Story } = defineMeta({
		title: 'Components/Button',
		component: Button,
		tags: ['autodocs'],
		argTypes: {
			variant: { control: 'select', options: variants },
			size: { control: 'inline-radio', options: sizes },
			rounded: { control: 'boolean' },
			disabled: { control: 'boolean' },
			icon: { control: false },
			children: { control: false }
		},
		args: {
			onclick: fn()
		}
	});
</script>

<Story name="Primary" args={{ variant: 'primary', icon: ArrowUpRight }}>
	{#snippet template(args)}
		<Button {...args}>Button</Button>
	{/snippet}
</Story>

<Story name="Secondary" args={{ variant: 'secondary', icon: ArrowUpRight }}>
	{#snippet template(args)}
		<Button {...args}>Button</Button>
	{/snippet}
</Story>

<Story name="Ghost" args={{ variant: 'ghost', icon: ArrowUpRight }}>
	{#snippet template(args)}
		<Button {...args}>Button</Button>
	{/snippet}
</Story>

<Story name="Without icon" args={{ variant: 'primary' }}>
	{#snippet template(args)}
		<Button {...args}>Button</Button>
	{/snippet}
</Story>

<Story name="Small" args={{ variant: 'secondary', size: 'sm', icon: Plus }}>
	{#snippet template(args)}
		<Button {...args}>Add</Button>
	{/snippet}
</Story>

<Story name="Icon only" args={{ variant: 'ghost', icon: Link, label: 'Copy link' }} />

<Story name="Rounded" args={{ variant: 'secondary', rounded: true, icon: Plus }}>
	{#snippet template(args)}
		<Button {...args}>Add item</Button>
	{/snippet}
</Story>

<Story
	name="Overlay"
	args={{ variant: 'overlay', size: 'lg', rounded: true, icon: Pause, label: 'Pause' }}
>
	{#snippet template(args)}
		<div
			style="display: grid; place-items: end; width: 320px; height: 180px; padding: 12px; border-radius: 12px; background: linear-gradient(135deg, #f97316, #a855f7 60%, #0ea5e9);"
		>
			<Button {...args} />
		</div>
	{/snippet}
</Story>

<Story name="Link" args={{ variant: 'secondary', size: 'lg', icon: ArrowLeft, href: '#previous' }}>
	{#snippet template(args)}
		<Button {...args}>Previous post</Button>
	{/snippet}
</Story>

<Story name="Disabled" args={{ variant: 'primary', icon: ArrowUpRight, disabled: true }}>
	{#snippet template(args)}
		<Button {...args}>Button</Button>
	{/snippet}
</Story>

<Story
	name="Click"
	args={{ variant: 'primary', icon: X, label: 'Close' }}
	play={async ({ args, canvas, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
		await expect(args.onclick).toHaveBeenCalledOnce();
	}}
/>

<Story name="All variants" tags={['!autodocs']}>
	{#snippet template()}
		<div style="display: grid; gap: 16px;">
			{#each sizes as size (size)}
				{#each [false, true] as rounded (rounded)}
					<div style="display: flex; gap: 8px; align-items: center;">
						{#each variants as variant (variant)}
							<Button {variant} {size} {rounded} icon={ArrowUpRight}>{variant}</Button>
							<Button {variant} {size} {rounded} icon={ArrowUpRight} label={variant} />
						{/each}
					</div>
				{/each}
			{/each}
		</div>
	{/snippet}
</Story>
