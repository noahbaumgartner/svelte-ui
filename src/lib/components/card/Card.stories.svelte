<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import Card from './Card.svelte';
	import CardAction from './CardAction.svelte';
	import CardContent from './CardContent.svelte';
	import CardDescription from './CardDescription.svelte';
	import CardFooter from './CardFooter.svelte';
	import CardHeader from './CardHeader.svelte';
	import CardTitle from './CardTitle.svelte';
	import Badge from '../badge/Badge.svelte';
	import Button from '../button/Button.svelte';
	import { ChevronRight } from '../../icons.js';

	const variants = ['outline', 'secondary'] as const;

	const cover = `data:image/svg+xml,${encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#f97316"/><stop offset=".6" stop-color="#a855f7"/><stop offset="1" stop-color="#0ea5e9"/></linearGradient></defs><rect width="16" height="9" fill="url(#g)"/></svg>'
	)}`;

	const { Story } = defineMeta({
		title: 'Components/Card',
		component: Card,
		tags: ['autodocs'],
		argTypes: {
			variant: { control: 'inline-radio', options: variants },
			children: { control: false }
		},
		args: {
			variant: 'outline'
		}
	});

	const row = 'display: flex; flex-wrap: wrap; gap: 16px; align-items: stretch;';
	const card = 'width: 300px;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template({ variant })}
		<Card {variant} style={card}>
			<CardHeader>
				<CardTitle>Scheduled reports</CardTitle>
				<CardDescription>Weekly snapshots. No more manual exports.</CardDescription>
				<CardAction><Badge>New</Badge></CardAction>
			</CardHeader>
			<CardContent>Choose a schedule and send reports to channels or teammates.</CardContent>
			<CardFooter>
				<Button>Set up reports</Button>
				<Button variant="ghost">Learn more</Button>
			</CardFooter>
		</Card>
	{/snippet}
</Story>

<Story name="Variants" parameters={{ controls: { exclude: ['variant'] } }}>
	{#snippet template()}
		<div style={row}>
			{#each variants as variant (variant)}
				<Card {variant} style={card}>
					<CardHeader>
						<CardTitle>Scheduled reports</CardTitle>
						<CardDescription>Weekly snapshots. No more manual exports.</CardDescription>
					</CardHeader>
					<CardFooter>
						<Button>Set up reports</Button>
					</CardFooter>
				</Card>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Composition">
	{#snippet template({ variant })}
		<div style={row}>
			<Card {variant} style={card}>
				<CardHeader>
					<CardTitle>Header only</CardTitle>
					<CardDescription>Title and description.</CardDescription>
				</CardHeader>
			</Card>
			<Card {variant} style={card}>
				<CardHeader>
					<CardTitle>With action</CardTitle>
					<CardDescription>A CardAction sits top right.</CardDescription>
					<CardAction>
						<Button variant="ghost" size="sm" icon={ChevronRight} label="Open" />
					</CardAction>
				</CardHeader>
				<CardContent>Content below the header.</CardContent>
			</Card>
			<Card {variant} style={card}>
				<img src={cover} alt="" style="aspect-ratio: 16 / 9;" />
				<CardHeader>
					<CardTitle>With image</CardTitle>
					<CardDescription>An image first renders edge to edge.</CardDescription>
				</CardHeader>
				<CardFooter>
					<Button>View event</Button>
				</CardFooter>
			</Card>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: renders title as heading"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		await expect(canvas.getByRole('heading', { name: 'Scheduled reports' })).toBeVisible();
		await expect(canvas.getByRole('button', { name: 'Set up reports' })).toBeVisible();
	}}
>
	{#snippet template({ variant })}
		<Card {variant} style={card}>
			<CardHeader>
				<CardTitle>Scheduled reports</CardTitle>
			</CardHeader>
			<CardFooter>
				<Button>Set up reports</Button>
			</CardFooter>
		</Card>
	{/snippet}
</Story>
