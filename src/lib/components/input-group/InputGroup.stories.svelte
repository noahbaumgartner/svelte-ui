<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn } from 'storybook/test';
	import InputGroup from './InputGroup.svelte';
	import InputGroupAddon from './InputGroupAddon.svelte';
	import Button from '../button/Button.svelte';
	import Input from '../input/Input.svelte';
	import { Copy, Info, Mail, Search } from '../../icons.js';

	const aligns = ['inline-start', 'inline-end', 'block-start', 'block-end'] as const;
	const oncopy = fn();

	const { Story } = defineMeta({
		title: 'Components/InputGroup',
		component: InputGroup,
		tags: ['autodocs'],
		argTypes: {
			children: { control: false }
		}
	});

	const column = 'display: flex; flex-direction: column; gap: 16px; width: 320px;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template()}
		<InputGroup style="width: 320px;">
			<Input type="search" placeholder="Search…" aria-label="Search" />
			<InputGroupAddon>
				<Search />
			</InputGroupAddon>
			<InputGroupAddon align="inline-end">12 results</InputGroupAddon>
		</InputGroup>
	{/snippet}
</Story>

<Story name="Alignments">
	{#snippet template()}
		<div style={column}>
			{#each aligns as align (align)}
				<InputGroup>
					<Input placeholder={align} aria-label={align} />
					<InputGroupAddon {align}>
						<Info />
						align="{align}"
					</InputGroupAddon>
				</InputGroup>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Content">
	{#snippet template()}
		<div style={column}>
			<InputGroup>
				<InputGroupAddon>https://</InputGroupAddon>
				<Input placeholder="example" aria-label="Domain" />
				<InputGroupAddon align="inline-end">.com</InputGroupAddon>
			</InputGroup>
			<InputGroup>
				<InputGroupAddon>
					<Mail />
				</InputGroupAddon>
				<Input type="email" placeholder="you@example.com" aria-label="Email" />
			</InputGroup>
			<InputGroup>
				<Input value="sk-3f9a…c21" readonly aria-label="API key" />
				<InputGroupAddon align="inline-end">
					<Button variant="ghost" size="sm" icon={Copy} label="Copy" />
				</InputGroupAddon>
			</InputGroup>
			<InputGroup>
				<Input type="search" placeholder="Search docs" aria-label="Search docs" />
				<InputGroupAddon align="inline-end">
					<Button variant="secondary" size="sm">Search</Button>
				</InputGroupAddon>
			</InputGroup>
			<InputGroup>
				<InputGroupAddon>€</InputGroupAddon>
				<Input type="number" value={20} aria-label="Amount" />
				<InputGroupAddon align="inline-end">EUR</InputGroupAddon>
			</InputGroup>
		</div>
	{/snippet}
</Story>

<Story name="States">
	{#snippet template()}
		<div style={column}>
			<InputGroup>
				<InputGroupAddon><Mail /></InputGroupAddon>
				<Input value="not-an-email" aria-invalid="true" aria-label="Invalid email" />
			</InputGroup>
			<InputGroup>
				<InputGroupAddon><Mail /></InputGroupAddon>
				<Input value="ada@example.com" disabled aria-label="Disabled email" />
			</InputGroup>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: addon focuses the input, buttons still work"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		oncopy.mockClear();
		await userEvent.click(canvas.getByText('https://'));
		await expect(canvas.getByRole('textbox', { name: 'Domain' })).toHaveFocus();
		await userEvent.click(canvas.getByRole('button', { name: 'Copy' }));
		await expect(oncopy).toHaveBeenCalledOnce();
	}}
>
	{#snippet template()}
		<InputGroup style="width: 320px;">
			<InputGroupAddon>https://</InputGroupAddon>
			<Input placeholder="example" aria-label="Domain" />
			<InputGroupAddon align="inline-end">
				<Button variant="ghost" size="sm" icon={Copy} label="Copy" onclick={oncopy} />
			</InputGroupAddon>
		</InputGroup>
	{/snippet}
</Story>
