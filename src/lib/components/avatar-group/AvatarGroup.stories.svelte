<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import AvatarGroup from './AvatarGroup.svelte';
	import Avatar from '../avatar/Avatar.svelte';

	const sizes = ['sm', 'md', 'lg'] as const;

	const { Story } = defineMeta({
		title: 'Components/AvatarGroup',
		component: AvatarGroup,
		tags: ['autodocs'],
		argTypes: {
			label: { control: 'text' },
			more: { control: 'number' },
			size: { control: 'inline-radio', options: sizes },
			children: { control: false }
		},
		args: {
			label: 'Members',
			more: 3,
			size: 'md'
		}
	});

	const people = [
		{ name: 'Ada Lovelace', initials: 'AL' },
		{ name: 'Grace Hopper', initials: 'GH' },
		{ name: 'Alan Turing', initials: 'AT' }
	];

	const column = 'display: flex; flex-direction: column; gap: 16px; align-items: flex-start;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template({ label, more, size })}
		<AvatarGroup {label} {more} {size}>
			{#each people as person (person.name)}
				<Avatar alt={person.name} fallback={person.initials} {size} />
			{/each}
		</AvatarGroup>
	{/snippet}
</Story>

<Story name="Sizes" parameters={{ controls: { exclude: ['size'] } }}>
	{#snippet template({ label, more })}
		<div style={column}>
			{#each sizes as size (size)}
				<AvatarGroup {label} {more} {size}>
					{#each people as person (person.name)}
						<Avatar alt={person.name} fallback={person.initials} {size} />
					{/each}
				</AvatarGroup>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="More" parameters={{ controls: { exclude: ['more'] } }}>
	{#snippet template({ label, size })}
		<div style={column}>
			{#each [0, 3, 128] as more (more)}
				<AvatarGroup {label} {more} {size}>
					{#each people as person (person.name)}
						<Avatar alt={person.name} fallback={person.initials} {size} />
					{/each}
				</AvatarGroup>
			{/each}
		</div>
	{/snippet}
</Story>

<Story
	name="Test: groups the avatars and counts the rest"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		const group = canvas.getByRole('group', { name: 'Members' });
		await expect(group).toBeVisible();
		await expect(canvas.getAllByRole('img')).toHaveLength(3);
		await expect(canvas.getByText('+3')).toBeVisible();
	}}
>
	{#snippet template({ label, more, size })}
		<AvatarGroup {label} {more} {size}>
			{#each people as person (person.name)}
				<Avatar alt={person.name} fallback={person.initials} />
			{/each}
		</AvatarGroup>
	{/snippet}
</Story>
