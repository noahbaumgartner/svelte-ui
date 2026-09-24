<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import Field from './Field.svelte';
	import FieldContent from './FieldContent.svelte';
	import FieldDescription from './FieldDescription.svelte';
	import FieldError from './FieldError.svelte';
	import FieldGroup from './FieldGroup.svelte';
	import FieldLabel from './FieldLabel.svelte';
	import FieldLegend from './FieldLegend.svelte';
	import FieldSeparator from './FieldSeparator.svelte';
	import FieldSet from './FieldSet.svelte';
	import Button from '../button/Button.svelte';
	import Checkbox from '../checkbox/Checkbox.svelte';
	import Input from '../input/Input.svelte';

	const orientations = ['vertical', 'horizontal', 'responsive'] as const;

	const { Story } = defineMeta({
		title: 'Components/Field',
		component: Field,
		tags: ['autodocs'],
		argTypes: {
			orientation: { control: 'inline-radio', options: orientations },
			children: { control: false }
		},
		args: {
			orientation: 'vertical'
		}
	});

	const form = 'width: 360px;';
	const rowInput = 'width: 200px; flex-shrink: 0;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template({ orientation })}
		<form style={form}>
			<FieldSet>
				<FieldLegend>Profile</FieldLegend>
				<FieldDescription>This is shown on your public page.</FieldDescription>
				<FieldGroup>
					<Field {orientation}>
						<FieldLabel for="default-name">Name</FieldLabel>
						<Input id="default-name" placeholder="Ada Lovelace" />
					</Field>
					<Field {orientation}>
						<FieldLabel for="default-email">Email</FieldLabel>
						<Input id="default-email" type="email" aria-describedby="default-email-description" />
						<FieldDescription id="default-email-description">
							We never share your email.
						</FieldDescription>
					</Field>
					<FieldSeparator />
					<Field orientation="horizontal">
						<Checkbox id="default-newsletter" />
						<FieldLabel for="default-newsletter">Subscribe to the newsletter</FieldLabel>
					</Field>
					<Field orientation="horizontal">
						<Button type="submit">Save</Button>
						<Button variant="ghost">Cancel</Button>
					</Field>
				</FieldGroup>
			</FieldSet>
		</form>
	{/snippet}
</Story>

<Story name="Orientations" parameters={{ controls: { exclude: ['orientation'] } }}>
	{#snippet template()}
		<FieldGroup style="width: 480px;">
			{#each orientations as orientation (orientation)}
				<Field {orientation}>
					<FieldContent>
						<FieldLabel for="orientation-{orientation}">Display name</FieldLabel>
						<FieldDescription>orientation="{orientation}"</FieldDescription>
					</FieldContent>
					<Input
						id="orientation-{orientation}"
						style={orientation === 'vertical' ? undefined : rowInput}
					/>
				</Field>
			{/each}
			<Field orientation="horizontal">
				<Checkbox id="orientation-check" checked />
				<FieldContent>
					<FieldLabel for="orientation-check">Share usage data</FieldLabel>
					<FieldDescription>A checkbox with a description.</FieldDescription>
				</FieldContent>
			</Field>
		</FieldGroup>
	{/snippet}
</Story>

<Story name="States">
	{#snippet template({ orientation })}
		<FieldGroup style={form}>
			<Field {orientation}>
				<FieldLabel for="state-username">Username</FieldLabel>
				<Input
					id="state-username"
					value="ada lovelace"
					aria-invalid="true"
					aria-describedby="state-username-error"
				/>
				<FieldError id="state-username-error" errors={['Only letters, numbers and dashes.']} />
			</Field>
			<Field {orientation}>
				<FieldLabel for="state-password">Password</FieldLabel>
				<Input
					id="state-password"
					type="password"
					value="short"
					aria-invalid="true"
					aria-describedby="state-password-error"
				/>
				<FieldError
					id="state-password-error"
					errors={['At least 12 characters.', 'At least one number.']}
				/>
			</Field>
			<Field {orientation}>
				<FieldLabel for="state-disabled">Workspace</FieldLabel>
				<Input id="state-disabled" value="acme" disabled />
				<FieldDescription>Only owners can rename the workspace.</FieldDescription>
			</Field>
		</FieldGroup>
	{/snippet}
</Story>

<Story name="Composition">
	{#snippet template({ orientation })}
		<FieldGroup style={form}>
			<FieldSet>
				<FieldLegend variant="label">Notify me about</FieldLegend>
				<FieldGroup>
					{#each ['Mentions', 'Replies', 'New followers'] as topic (topic)}
						<Field orientation="horizontal">
							<Checkbox id="topic-{topic}" />
							<FieldLabel for="topic-{topic}">{topic}</FieldLabel>
						</Field>
					{/each}
				</FieldGroup>
			</FieldSet>
			<FieldSeparator>Or</FieldSeparator>
			<Field {orientation}>
				<FieldLabel for="composition-webhook">Webhook URL</FieldLabel>
				<Input id="composition-webhook" type="url" />
				<FieldDescription>Receive the same events as a POST request.</FieldDescription>
			</Field>
		</FieldGroup>
	{/snippet}
</Story>

<Story
	name="Test: links label, description and error"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		const control = canvas.getByLabelText('Username');
		await expect(control).toHaveAccessibleDescription('Only letters, numbers and dashes.');
		await expect(canvas.getByRole('alert')).toHaveTextContent('Only letters, numbers and dashes.');
	}}
>
	{#snippet template({ orientation })}
		<Field {orientation} style={form}>
			<FieldLabel for="test-username">Username</FieldLabel>
			<Input id="test-username" aria-invalid="true" aria-describedby="test-username-error" />
			<FieldError id="test-username-error" errors={['Only letters, numbers and dashes.']} />
		</Field>
	{/snippet}
</Story>

<Story
	name="Test: error renders nothing without messages"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		await expect(canvas.getAllByRole('alert')).toHaveLength(1);
		await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
	}}
>
	{#snippet template({ orientation })}
		<Field {orientation} style={form}>
			<FieldError errors={[undefined]} />
			<FieldError errors={['Too short.', 'Too short.', 'Needs a number.']} />
		</Field>
	{/snippet}
</Story>
