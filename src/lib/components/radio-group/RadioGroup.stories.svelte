<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import RadioGroup from './RadioGroup.svelte';
	import RadioGroupItem from './RadioGroupItem.svelte';
	import Field from '../field/Field.svelte';
	import FieldContent from '../field/FieldContent.svelte';
	import FieldDescription from '../field/FieldDescription.svelte';
	import FieldLegend from '../field/FieldLegend.svelte';
	import FieldSet from '../field/FieldSet.svelte';
	import Label from '../label/Label.svelte';

	const { Story } = defineMeta({
		title: 'Components/RadioGroup',
		component: RadioGroup,
		tags: ['autodocs'],
		argTypes: {
			value: { control: 'select', options: ['comfortable', 'default', 'compact'] },
			orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
			disabled: { control: 'boolean' },
			required: { control: 'boolean' },
			children: { control: false }
		},
		args: {
			value: 'default',
			orientation: 'vertical',
			disabled: false,
			required: false
		}
	});

	const densities = [
		{ value: 'comfortable', label: 'Comfortable', description: 'More space between rows.' },
		{ value: 'default', label: 'Default', description: 'Balanced for most screens.' },
		{ value: 'compact', label: 'Compact', description: 'Fits more rows on screen.' }
	];

	const row = 'display: flex; flex-wrap: wrap; gap: 48px; align-items: flex-start;';
</script>

<Story name="Default" tags={['!dev']}>
	{#snippet template({ value, orientation, disabled, required })}
		<RadioGroup {value} {orientation} {disabled} {required} aria-label="Density">
			{#each densities as density (density.value)}
				<Field orientation="horizontal">
					<RadioGroupItem value={density.value} id="default-{density.value}" />
					<Label for="default-{density.value}">{density.label}</Label>
				</Field>
			{/each}
		</RadioGroup>
	{/snippet}
</Story>

<Story name="Orientations" parameters={{ controls: { exclude: ['orientation'] } }}>
	{#snippet template({ value, disabled, required })}
		<div style={row}>
			{#each ['vertical', 'horizontal'] as const as orientation (orientation)}
				<RadioGroup {value} {orientation} {disabled} {required} aria-label="Density {orientation}">
					{#each densities as density (density.value)}
						<Field orientation="horizontal">
							<RadioGroupItem value={density.value} id="{orientation}-{density.value}" />
							<Label for="{orientation}-{density.value}">{density.label}</Label>
						</Field>
					{/each}
				</RadioGroup>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="States" parameters={{ controls: { exclude: ['value', 'disabled', 'required'] } }}>
	{#snippet template({ orientation })}
		<div style={row}>
			<RadioGroup value="a" {orientation} aria-label="Enabled">
				<Field orientation="horizontal">
					<RadioGroupItem value="a" id="state-enabled-a" />
					<Label for="state-enabled-a">Selected</Label>
				</Field>
				<Field orientation="horizontal">
					<RadioGroupItem value="b" id="state-enabled-b" />
					<Label for="state-enabled-b">Unselected</Label>
				</Field>
				<Field orientation="horizontal">
					<RadioGroupItem value="c" id="state-enabled-c" disabled />
					<Label for="state-enabled-c">Disabled item</Label>
				</Field>
			</RadioGroup>
			<RadioGroup {orientation} aria-label="Invalid" aria-invalid="true">
				<Field orientation="horizontal">
					<RadioGroupItem value="a" id="state-invalid-a" />
					<Label for="state-invalid-a">Invalid</Label>
				</Field>
				<Field orientation="horizontal">
					<RadioGroupItem value="b" id="state-invalid-b" />
					<Label for="state-invalid-b">Invalid</Label>
				</Field>
			</RadioGroup>
			<RadioGroup value="a" {orientation} aria-label="Disabled" disabled>
				<Field orientation="horizontal">
					<RadioGroupItem value="a" id="state-disabled-a" />
					<Label for="state-disabled-a">Selected and disabled</Label>
				</Field>
				<Field orientation="horizontal">
					<RadioGroupItem value="b" id="state-disabled-b" />
					<Label for="state-disabled-b">Disabled</Label>
				</Field>
			</RadioGroup>
		</div>
	{/snippet}
</Story>

<Story name="Composition" parameters={{ controls: { exclude: ['orientation'] } }}>
	{#snippet template({ value, orientation, disabled, required })}
		<FieldSet style="max-width: 360px;">
			<FieldLegend variant="label" id="composition-legend">Table density</FieldLegend>
			<RadioGroup {value} {orientation} {disabled} {required} aria-labelledby="composition-legend">
				{#each densities as density (density.value)}
					<Field orientation="horizontal">
						<RadioGroupItem value={density.value} id="composition-{density.value}" />
						<FieldContent>
							<Label for="composition-{density.value}">{density.label}</Label>
							<FieldDescription>{density.description}</FieldDescription>
						</FieldContent>
					</Field>
				{/each}
			</RadioGroup>
		</FieldSet>
	{/snippet}
</Story>

<Story
	name="Test: selects on label click"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const compact = canvas.getByRole('radio', { name: 'Compact' });
		const standard = canvas.getByRole('radio', { name: 'Default' });
		await expect(standard).toBeChecked();
		await userEvent.click(canvas.getByText('Compact'));
		await expect(compact).toBeChecked();
		await expect(standard).not.toBeChecked();
	}}
>
	{#snippet template({ value, orientation, disabled, required })}
		<RadioGroup {value} {orientation} {disabled} {required} aria-label="Density">
			{#each densities as density (density.value)}
				<Field orientation="horizontal">
					<RadioGroupItem value={density.value} id="test-click-{density.value}" />
					<Label for="test-click-{density.value}">{density.label}</Label>
				</Field>
			{/each}
		</RadioGroup>
	{/snippet}
</Story>

<Story
	name="Test: moves selection with arrow keys"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		await userEvent.tab();
		await expect(canvas.getByRole('radio', { name: 'Default' })).toHaveFocus();
		await userEvent.keyboard('{ArrowDown}');
		const compact = canvas.getByRole('radio', { name: 'Compact' });
		await expect(compact).toHaveFocus();
		await expect(compact).toBeChecked();
	}}
>
	{#snippet template({ value, orientation, disabled, required })}
		<RadioGroup {value} {orientation} {disabled} {required} aria-label="Density">
			{#each densities as density (density.value)}
				<Field orientation="horizontal">
					<RadioGroupItem value={density.value} id="test-keys-{density.value}" />
					<Label for="test-keys-{density.value}">{density.label}</Label>
				</Field>
			{/each}
		</RadioGroup>
	{/snippet}
</Story>
