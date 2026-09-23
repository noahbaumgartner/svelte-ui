<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Badge from './Badge.svelte';
	import { Tag } from '../../icons.js';

	const variants = ['primary', 'secondary'] as const;

	const { Story } = defineMeta({
		title: 'Components/Badge',
		component: Badge,
		tags: ['autodocs'],
		argTypes: {
			variant: { control: 'inline-radio', options: variants },
			icon: { control: false },
			children: { control: false }
		},
		args: {
			variant: 'secondary'
		}
	});

	const row = 'display: flex; flex-wrap: wrap; gap: 8px; align-items: center;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template({ variant })}
		<Badge {variant}>Badge</Badge>
	{/snippet}
</Story>

<Story name="Variants" parameters={{ controls: { exclude: ['variant'] } }}>
	{#snippet template()}
		<div style={row}>
			{#each variants as variant (variant)}
				<Badge {variant}>{variant}</Badge>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Content">
	{#snippet template({ variant })}
		<div style={row}>
			<Badge {variant}>Svelte</Badge>
			<Badge {variant} icon={Tag}>TypeScript</Badge>
		</div>
	{/snippet}
</Story>
