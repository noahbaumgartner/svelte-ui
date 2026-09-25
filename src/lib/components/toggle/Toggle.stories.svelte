<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn } from 'storybook/test';
	import Toggle from './Toggle.svelte';
	import { Bold, Italic, Underline } from '../../icons.js';

	const sizes = ['sm', 'md', 'lg'] as const;

	const { Story } = defineMeta({
		title: 'Components/Toggle',
		component: Toggle,
		tags: ['autodocs'],
		argTypes: {
			size: { control: 'inline-radio', options: sizes },
			pressed: { control: 'boolean' },
			disabled: { control: 'boolean' },
			label: { control: 'text' },
			icon: { control: false },
			children: { control: false }
		},
		args: {
			size: 'md',
			icon: Bold,
			onclick: fn()
		}
	});

	const row = 'display: flex; flex-wrap: wrap; gap: 8px; align-items: center;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<Toggle {...args}>Bold</Toggle>
	{/snippet}
</Story>

<Story name="Sizes" parameters={{ controls: { exclude: ['size'] } }}>
	{#snippet template(args)}
		<div style={row}>
			{#each sizes as size (size)}
				<Toggle {...args} {size}>Size {size}</Toggle>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Content" parameters={{ controls: { exclude: ['icon', 'label'] } }}>
	{#snippet template(args)}
		<div style={row}>
			<Toggle {...args} icon={Bold}>Icon and label</Toggle>
			<Toggle {...args} icon={undefined}>Label only</Toggle>
			<Toggle {...args} icon={Italic} label="Italic" />
		</div>
	{/snippet}
</Story>

<Story name="States" parameters={{ controls: { exclude: ['pressed', 'disabled'] } }}>
	{#snippet template(args)}
		<div style={row}>
			<Toggle {...args}>Off</Toggle>
			<Toggle {...args} pressed>On</Toggle>
			<Toggle {...args} disabled>Disabled</Toggle>
			<Toggle {...args} pressed disabled>Disabled on</Toggle>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: click toggles pressed"
	tags={['!dev', '!autodocs']}
	args={{ icon: Underline, label: 'Underline' }}
	play={async ({ args, canvas, userEvent }) => {
		const toggle = canvas.getByRole('button', { name: 'Underline' });
		await expect(toggle).toHaveAttribute('aria-pressed', 'false');
		await userEvent.click(toggle);
		await expect(toggle).toHaveAttribute('aria-pressed', 'true');
		await userEvent.click(toggle);
		await expect(toggle).toHaveAttribute('aria-pressed', 'false');
		await expect(args.onclick).toHaveBeenCalledTimes(2);
	}}
/>

<Story
	name="Test: disabled does not toggle"
	tags={['!dev', '!autodocs']}
	args={{ disabled: true, label: 'Bold' }}
	play={async ({ canvas }) => {
		const toggle = canvas.getByRole('button', { name: 'Bold' });
		toggle.click();
		await expect(toggle).toHaveAttribute('aria-pressed', 'false');
	}}
/>
