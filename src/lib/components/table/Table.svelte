<script module lang="ts">
	import type { Snippet } from 'svelte';

	export type TableSortValue = string | number | Date | null | undefined;

	export type TableSort = {
		/** The column's `id`, falling back to its `key`, then its `header`. */
		column: string;
		direction: 'asc' | 'desc';
	};

	export type TableColumn<T> = {
		id?: string;
		header: string;
		align?: 'left' | 'center' | 'right';
		/** Any CSS width, e.g. `120px` or `30%`. */
		width?: string;
	} & (
		| {
				/** Renders `row[key]` as plain text. */
				key: keyof T & string;
				cell?: never;
				/** Sorts by `row[key]`. */
				sortable?: boolean;
		  }
		| {
				key?: never;
				/** Renders custom content for the current row. */
				cell: Snippet<[T]>;
				/** Returns the value this column sorts by. */
				sortable?: (row: T) => TableSortValue;
		  }
	);
</script>

<script lang="ts" generics="T">
	import type { HTMLAttributes } from 'svelte/elements';
	import { ArrowDown, ArrowUp, ChevronsUpDown } from '@lucide/svelte';
	import Checkbox from '../checkbox/Checkbox.svelte';

	type Props = Omit<HTMLAttributes<HTMLTableElement>, 'children'> & {
		data: T[];
		columns: TableColumn<T>[];
		sort?: TableSort;
		/** Adds a checkbox column. */
		selection?: 'single' | 'multiple';
		selected?: T[];
		/** Identifies rows across data updates; defaults to the row object itself. */
		rowId?: (row: T) => unknown;
	};

	let {
		data,
		columns,
		sort = $bindable(),
		selection,
		selected = $bindable([]),
		rowId = (row) => row,
		class: className,
		...rest
	}: Props = $props();

	const columnId = (column: TableColumn<T>) => column.id ?? column.key ?? column.header;

	function sortValue(column: TableColumn<T>, row: T): unknown {
		if (typeof column.sortable === 'function') return column.sortable(row);
		return column.key ? row[column.key] : undefined;
	}

	function compare(a: unknown, b: unknown) {
		if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
		if (typeof a === 'number' && typeof b === 'number') return a - b;
		return String(a).localeCompare(String(b), undefined, { numeric: true });
	}

	const rows = $derived.by(() => {
		const column = sort && columns.find((c) => c.sortable && columnId(c) === sort!.column);
		if (!sort || !column) return data;
		const direction = sort.direction === 'asc' ? 1 : -1;
		return [...data].sort((rowA, rowB) => {
			const a = sortValue(column, rowA);
			const b = sortValue(column, rowB);
			if (a == null || b == null) return a == null ? (b == null ? 0 : 1) : -1;
			return compare(a, b) * direction;
		});
	});

	function toggleSort(column: TableColumn<T>) {
		const id = columnId(column);
		if (sort?.column !== id) sort = { column: id, direction: 'asc' };
		else if (sort.direction === 'asc') sort = { column: id, direction: 'desc' };
		else sort = undefined;
	}

	function ariaSort(column: TableColumn<T>) {
		if (!column.sortable) return undefined;
		if (sort?.column !== columnId(column)) return 'none';
		return sort.direction === 'asc' ? 'ascending' : 'descending';
	}

	const selectedIds = $derived(new Set(selected.map(rowId)));
	const allSelected = $derived(data.length > 0 && data.every((row) => selectedIds.has(rowId(row))));
	const someSelected = $derived(!allSelected && data.some((row) => selectedIds.has(rowId(row))));

	function toggleRow(row: T) {
		const id = rowId(row);
		if (selectedIds.has(id)) selected = selected.filter((r) => rowId(r) !== id);
		else selected = selection === 'single' ? [row] : [...selected, row];
	}

	function toggleAll() {
		selected = allSelected ? [] : [...data];
	}
</script>

<div class="table-container">
	<table {...rest} class={['table', className]}>
		<thead>
			<tr>
				{#if selection}
					<th scope="col" class="table-select">
						{#if selection === 'multiple'}
							<Checkbox
								aria-label="Select all rows"
								checked={allSelected}
								indeterminate={someSelected}
								onchange={toggleAll}
							/>
						{/if}
					</th>
				{/if}
				{#each columns as column, i (i)}
					<th
						scope="col"
						class="table-{column.align ?? 'left'}"
						style:width={column.width}
						aria-sort={ariaSort(column)}
					>
						{#if column.sortable}
							{@const active = sort?.column === columnId(column)}
							<button type="button" class="table-sort" onclick={() => toggleSort(column)}>
								{column.header}
								{#if active && sort?.direction === 'asc'}
									<ArrowUp class="table-sort-icon" aria-hidden="true" />
								{:else if active}
									<ArrowDown class="table-sort-icon" aria-hidden="true" />
								{:else}
									<ChevronsUpDown
										class="table-sort-icon table-sort-icon--idle"
										aria-hidden="true"
									/>
								{/if}
							</button>
						{:else}
							{column.header}
						{/if}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each rows as row (rowId(row))}
				{@const isSelected = selectedIds.has(rowId(row))}
				<tr data-selected={isSelected || undefined}>
					{#if selection}
						<td class="table-select">
							<Checkbox
								aria-label="Select row"
								checked={isSelected}
								onchange={() => toggleRow(row)}
							/>
						</td>
					{/if}
					{#each columns as column, i (i)}
						<td class="table-{column.align ?? 'left'}">
							{#if column.cell}
								{@render column.cell(row)}
							{:else if column.key}
								{row[column.key]}
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.table-container {
		width: 100%;
		overflow-x: auto;
	}

	.table {
		width: 100%;
		border-collapse: collapse;
		font-size: 13px;
		color: var(--color-text);
	}

	th,
	td {
		padding: 10px 12px;
		white-space: nowrap;
		border-bottom: 1px solid var(--color-border);
	}

	th {
		font-weight: 500;
		color: var(--color-text-muted);
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	tbody tr:hover,
	tbody tr[data-selected] {
		background-color: var(--color-surface);
	}

	.table-left {
		text-align: left;
	}

	.table-center {
		text-align: center;
	}

	.table-right {
		text-align: right;
	}

	.table-select {
		width: 16px;
		padding-right: 0;
		line-height: 0;
	}

	.table-sort {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		margin: -2px -4px;
		padding: 2px 4px;
		font: inherit;
		color: inherit;
		background: none;
		border: none;
		border-radius: 6px;
		outline: none;
		cursor: pointer;
		transition: color 200ms ease;
	}

	.table-sort:hover,
	th[aria-sort='ascending'] .table-sort,
	th[aria-sort='descending'] .table-sort {
		color: var(--color-text);
	}

	.table-sort:focus-visible {
		outline: 2px solid var(--color-ink);
	}

	.table-sort :global(.table-sort-icon) {
		width: 14px;
		height: 14px;
		flex-shrink: 0;
	}

	.table-sort :global(.table-sort-icon--idle) {
		opacity: 0.5;
	}
</style>
