<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, waitFor, within } from 'storybook/test';
	import Toaster from './Toaster.svelte';
	import Button from '../button/Button.svelte';
	import { toast } from './toast.svelte.js';
	import { Check, CircleAlert, Trash } from '../../icons.js';

	const { Story } = defineMeta({
		title: 'Components/Toaster',
		component: Toaster,
		tags: ['autodocs'],
		argTypes: {
			label: { control: 'text' }
		},
		args: {
			label: 'Notifications'
		},
		parameters: {
			docs: { story: { height: '240px' } }
		}
	});

	const row = 'display: flex; flex-wrap: wrap; gap: 12px; align-items: center;';

	function save() {
		const id = toast('Saving changes…', { loading: true });
		setTimeout(() => toast('Changes saved', { id, icon: Check }), 2000);
	}
</script>

<Story name="Content">
	{#snippet template(args)}
		<Toaster {...args} />
		<div style={row}>
			<Button variant="secondary" onclick={() => toast('Event has been created')}>Text</Button>
			<Button variant="secondary" onclick={() => toast('Changes saved', { icon: Check })}>
				Icon
			</Button>
			<Button variant="secondary" onclick={save}>Loading</Button>
			<Button
				variant="secondary"
				onclick={() =>
					toast('File moved to trash', {
						icon: Trash,
						action: { label: 'Undo', onclick: () => toast('File restored') }
					})}
			>
				Action
			</Button>
			<Button
				variant="secondary"
				onclick={() =>
					toast(
						'Connection lost. Your changes are kept locally and synced once you are back online.',
						{
							icon: CircleAlert,
							duration: Infinity,
							action: { label: 'Retry', onclick: () => {} }
						}
					)}
			>
				Long
			</Button>
		</div>
	{/snippet}
</Story>

<Story name="Duration">
	{#snippet template(args)}
		<Toaster {...args} />
		<div style={row}>
			{#each [1000, 3000, 10000] as duration (duration)}
				<Button
					variant="secondary"
					onclick={() => toast(`Closes after ${duration} ms`, { duration })}
				>
					{duration} ms
				</Button>
			{/each}
			<Button variant="secondary" onclick={() => toast.dismiss()}>Dismiss all</Button>
		</div>
	{/snippet}
</Story>

<Story
	name="Test: toast shows and closes after its duration"
	tags={['!dev', '!autodocs']}
	play={async ({ canvasElement, userEvent }) => {
		const region = within(canvasElement.ownerDocument.body);
		await userEvent.click(within(canvasElement).getByRole('button', { name: 'Show' }));
		await waitFor(() => expect(region.getByText('Saved')).toBeInTheDocument());
		await waitFor(() => expect(region.queryByText('Saved')).toBeNull(), { timeout: 2000 });
	}}
>
	{#snippet template(args)}
		<Toaster {...args} />
		<Button variant="secondary" onclick={() => toast('Saved', { duration: 300 })}>Show</Button>
	{/snippet}
</Story>

<Story
	name="Test: action runs and dismisses"
	tags={['!dev', '!autodocs']}
	play={async ({ canvasElement, userEvent }) => {
		const region = within(canvasElement.ownerDocument.body);
		await userEvent.click(within(canvasElement).getByRole('button', { name: 'Delete' }));
		await userEvent.click(await region.findByRole('button', { name: 'Undo' }));
		await waitFor(() => expect(region.queryByText('File deleted')).toBeNull());
		await expect(region.getByText('File restored')).toBeInTheDocument();
		toast.dismiss();
	}}
>
	{#snippet template(args)}
		<Toaster {...args} />
		<Button
			variant="secondary"
			onclick={() =>
				toast('File deleted', {
					duration: Infinity,
					action: { label: 'Undo', onclick: () => toast('File restored', { duration: Infinity }) }
				})}
		>
			Delete
		</Button>
	{/snippet}
</Story>

<Story
	name="Test: only the newest toast is shown"
	tags={['!dev', '!autodocs']}
	play={async ({ canvasElement }) => {
		const region = within(canvasElement.ownerDocument.body);
		toast('First', { duration: Infinity });
		toast('Second', { duration: Infinity });
		await waitFor(() => expect(region.queryByText('First')).toBeNull());
		await expect(region.getByText('Second')).toBeInTheDocument();
		toast.dismiss();
	}}
>
	{#snippet template(args)}
		<Toaster {...args} />
	{/snippet}
</Story>

<Story
	name="Test: click closes the toast"
	tags={['!dev', '!autodocs']}
	play={async ({ canvasElement, userEvent }) => {
		const region = within(canvasElement.ownerDocument.body);
		toast('Copied', { duration: Infinity });
		await userEvent.click(await region.findByText('Copied'));
		await waitFor(() => expect(region.queryByText('Copied')).toBeNull());
	}}
>
	{#snippet template(args)}
		<Toaster {...args} />
	{/snippet}
</Story>

<Story
	name="Test: loading toast is updated in place"
	tags={['!dev', '!autodocs']}
	play={async ({ canvasElement }) => {
		const region = within(canvasElement.ownerDocument.body);
		const id = toast('Uploading', { loading: true });
		const item = await region.findByText('Uploading');
		await expect(item.closest('li')).toHaveAttribute('aria-busy', 'true');
		toast('Uploaded', { id, duration: Infinity });
		await waitFor(() => expect(region.getByText('Uploaded')).toBeInTheDocument());
		await expect(region.getAllByRole('listitem')).toHaveLength(1);
		toast.dismiss();
	}}
>
	{#snippet template(args)}
		<Toaster {...args} />
	{/snippet}
</Story>
