<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import Table, { type TableColumn } from './Table.svelte';
	import Badge from '../badge/Badge.svelte';
	import Button from '../button/Button.svelte';
	import { Ellipsis } from '../../icons.js';

	type Invoice = {
		id: string;
		customer: string;
		status: 'paid' | 'pending';
		amount: number;
	};

	const invoices: Invoice[] = [
		{ id: 'INV-001', customer: 'Acme Corp', status: 'paid', amount: 1250 },
		{ id: 'INV-002', customer: 'Globex', status: 'pending', amount: 480 },
		{ id: 'INV-003', customer: 'Initech', status: 'paid', amount: 3200 },
		{ id: 'INV-004', customer: 'Umbrella', status: 'pending', amount: 75.5 }
	];

	const selections = ['single', 'multiple'] as const;

	const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

	const { Story } = defineMeta({
		title: 'Components/Table',
		component: Table,
		tags: ['autodocs'],
		argTypes: {
			data: { control: false },
			columns: { control: false },
			sort: { control: false },
			selected: { control: false },
			rowId: { control: false },
			selection: { control: 'inline-radio', options: [undefined, ...selections] }
		}
	});

	const rowId = (invoice: Invoice) => invoice.id;

	const stack = 'display: flex; flex-direction: column; gap: 32px;';
</script>

{#snippet status(invoice: Invoice)}
	<Badge variant={invoice.status === 'paid' ? 'primary' : 'secondary'}>
		{invoice.status === 'paid' ? 'Paid' : 'Pending'}
	</Badge>
{/snippet}

{#snippet amount(invoice: Invoice)}
	{currency.format(invoice.amount)}
{/snippet}

{#snippet actions(invoice: Invoice)}
	<Button variant="ghost" size="sm" icon={Ellipsis} label="Actions for {invoice.id}" />
{/snippet}

<Story name="Default" tags={['!dev']}>
	{#snippet template({ selection })}
		{@const columns: TableColumn<Invoice>[] = [
			{ header: 'Invoice', key: 'id', sortable: true },
			{ header: 'Customer', key: 'customer', sortable: true },
			{ header: 'Status', cell: status, sortable: (invoice) => invoice.status },
			{ header: 'Amount', cell: amount, align: 'right', sortable: (invoice) => invoice.amount }
		]}
		<Table {rowId} {selection} data={invoices} {columns} />
	{/snippet}
</Story>

<Story name="Columns">
	{#snippet template({ selection })}
		{@const columns: TableColumn<Invoice>[] = [
			{ header: 'Key', key: 'id' },
			{ header: 'Key', key: 'customer' },
			{ header: 'Cell', cell: status },
			{ header: 'Cell', cell: amount, align: 'right' },
			{ header: '', cell: actions, width: '48px' }
		]}
		<Table {rowId} {selection} data={invoices} {columns} />
	{/snippet}
</Story>

<Story name="Alignment">
	{#snippet template({ selection })}
		{@const columns: TableColumn<Invoice>[] = [
			{ header: 'Left', key: 'customer', align: 'left' },
			{ header: 'Center', cell: status, align: 'center' },
			{ header: 'Right', cell: amount, align: 'right' }
		]}
		<Table {rowId} {selection} data={invoices} {columns} />
	{/snippet}
</Story>

<Story name="Sorting">
	{#snippet template({ selection })}
		{@const columns: TableColumn<Invoice>[] = [
			{ header: 'Key', key: 'customer', sortable: true },
			{ header: 'Cell', cell: amount, align: 'right', sortable: (invoice) => invoice.amount },
			{ header: 'Not sortable', cell: status }
		]}
		<Table
			{rowId}
			{selection}
			data={invoices}
			{columns}
			sort={{ column: 'customer', direction: 'asc' }}
		/>
	{/snippet}
</Story>

<Story name="Selection" parameters={{ controls: { exclude: ['selection'] } }}>
	{#snippet template()}
		{@const columns: TableColumn<Invoice>[] = [
			{ header: 'Invoice', key: 'id' },
			{ header: 'Customer', key: 'customer' },
			{ header: 'Amount', cell: amount, align: 'right' }
		]}
		<div style={stack}>
			{#each selections as selection (selection)}
				<Table {rowId} {selection} data={invoices} {columns} aria-label="{selection} selection" />
			{/each}
		</div>
	{/snippet}
</Story>

<Story
	name="Test: renders key and cell columns"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		await expect(canvas.getAllByRole('columnheader')).toHaveLength(3);
		await expect(canvas.getAllByRole('row')).toHaveLength(invoices.length + 1);
		await expect(canvas.getByRole('cell', { name: 'Acme Corp' })).toBeVisible();
		await expect(canvas.getByRole('cell', { name: '$1,250.00' })).toBeVisible();
	}}
>
	{#snippet template({ selection })}
		{@const columns: TableColumn<Invoice>[] = [
			{ header: 'Customer', key: 'customer' },
			{ header: 'Status', cell: status },
			{ header: 'Amount', cell: amount }
		]}
		<Table {rowId} {selection} data={invoices} {columns} />
	{/snippet}
</Story>

<Story
	name="Test: sorts ascending, descending, then unsorted"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const firstCustomer = () => canvas.getAllByRole('row')[1].querySelector('td')?.textContent;
		const header = canvas.getByRole('columnheader', { name: 'Customer' });
		const button = canvas.getByRole('button', { name: 'Customer' });
		await expect(header).toHaveAttribute('aria-sort', 'none');
		await userEvent.click(button);
		await expect(header).toHaveAttribute('aria-sort', 'ascending');
		await expect(firstCustomer()).toBe('Acme Corp');
		await userEvent.click(button);
		await expect(header).toHaveAttribute('aria-sort', 'descending');
		await expect(firstCustomer()).toBe('Umbrella');
		await userEvent.click(button);
		await expect(header).toHaveAttribute('aria-sort', 'none');
		await expect(firstCustomer()).toBe('Acme Corp');
	}}
>
	{#snippet template({ selection })}
		{@const columns: TableColumn<Invoice>[] = [
			{ header: 'Customer', key: 'customer', sortable: true },
			{ header: 'Amount', cell: amount, sortable: (invoice) => invoice.amount }
		]}
		<Table {rowId} {selection} data={invoices} {columns} />
	{/snippet}
</Story>

<Story
	name="Test: single selection replaces the selected row"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const [first, second] = canvas.getAllByRole('checkbox', { name: 'Select row' });
		await expect(canvas.queryByRole('checkbox', { name: 'Select all rows' })).toBeNull();
		await userEvent.click(first);
		await expect(first).toBeChecked();
		await userEvent.click(second);
		await expect(first).not.toBeChecked();
		await expect(second).toBeChecked();
	}}
>
	{#snippet template()}
		{@const columns: TableColumn<Invoice>[] = [{ header: 'Customer', key: 'customer' }]}
		<Table {rowId} selection="single" data={invoices} {columns} />
	{/snippet}
</Story>

<Story
	name="Test: multiple selection with select all"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas, userEvent }) => {
		const all = canvas.getByRole('checkbox', { name: 'Select all rows' });
		const rows = canvas.getAllByRole('checkbox', { name: 'Select row' });
		await userEvent.click(rows[0]);
		await userEvent.click(rows[1]);
		await expect(rows[0]).toBeChecked();
		await expect(rows[1]).toBeChecked();
		await expect(all).toHaveProperty('indeterminate', true);
		await userEvent.click(all);
		for (const row of rows) await expect(row).toBeChecked();
		await expect(all).toBeChecked();
		await userEvent.click(all);
		for (const row of rows) await expect(row).not.toBeChecked();
	}}
>
	{#snippet template()}
		{@const columns: TableColumn<Invoice>[] = [{ header: 'Customer', key: 'customer' }]}
		<Table {rowId} selection="multiple" data={invoices} {columns} />
	{/snippet}
</Story>
