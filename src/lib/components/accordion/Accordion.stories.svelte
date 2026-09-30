<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, waitFor } from 'storybook/test';
	import Accordion from './Accordion.svelte';
	import AccordionItem from './AccordionItem.svelte';

	const { Story } = defineMeta({
		title: 'Components/Accordion',
		component: Accordion,
		tags: ['autodocs'],
		argTypes: {
			multiple: { control: 'boolean' },
			children: { control: false }
		},
		args: {
			multiple: false
		}
	});

	const questions = [
		{
			title: 'Is it accessible?',
			answer: 'Yes. Each item is a native details element, so keyboard and find-in-page just work.'
		},
		{
			title: 'Can several items be open?',
			answer: 'Set the multiple prop; by default opening one item closes the others.'
		},
		{
			title: 'Is it animated?',
			answer: 'The height animates where the browser supports it and snaps open elsewhere.'
		}
	];

	const width = 'max-width: 420px;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template({ multiple })}
		<div style={width}>
			<Accordion {multiple}>
				{#each questions as question, i (question.title)}
					<AccordionItem title={question.title} open={i === 0}>{question.answer}</AccordionItem>
				{/each}
			</Accordion>
		</div>
	{/snippet}
</Story>

<Story name="Multiple" parameters={{ controls: { exclude: ['multiple'] } }}>
	{#snippet template()}
		<div style={width}>
			<Accordion multiple>
				{#each questions as question, i (question.title)}
					<AccordionItem title={question.title} open={i < 2}>{question.answer}</AccordionItem>
				{/each}
			</Accordion>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: opening one item closes the other"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const first = canvas.getByText(/native details element/);
		const second = canvas.getByText(/Set the multiple prop/);
		await expect(first).toBeVisible();
		await userEvent.click(canvas.getByText('Can several items be open?'));
		await waitFor(() => expect(second).toBeVisible());
		await waitFor(() => expect(first).not.toBeVisible());
	}}
>
	{#snippet template({ multiple })}
		<Accordion {multiple}>
			{#each questions as question, i (question.title)}
				<AccordionItem title={question.title} open={i === 0}>{question.answer}</AccordionItem>
			{/each}
		</Accordion>
	{/snippet}
</Story>

<Story
	name="Test: multiple keeps items open and a second click closes"
	tags={['!dev', '!autodocs']}
	args={{ multiple: true }}
	play={async ({ canvas, userEvent }) => {
		const first = canvas.getByText(/native details element/);
		const second = canvas.getByText(/Set the multiple prop/);
		await userEvent.click(canvas.getByText('Can several items be open?'));
		await waitFor(() => expect(second).toBeVisible());
		await expect(first).toBeVisible();
		await userEvent.click(canvas.getByText('Can several items be open?'));
		await waitFor(() => expect(second).not.toBeVisible());
	}}
>
	{#snippet template({ multiple })}
		<Accordion {multiple}>
			{#each questions as question, i (question.title)}
				<AccordionItem title={question.title} open={i === 0}>{question.answer}</AccordionItem>
			{/each}
		</Accordion>
	{/snippet}
</Story>
