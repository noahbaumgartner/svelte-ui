<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { fly } from 'svelte/transition';
	import Button from '../button/Button.svelte';
	import Spinner from '../spinner/Spinner.svelte';
	import { toast, toasts, type ToastData } from './toast.svelte.js';

	type Props = {
		/** Accessible name of the notification region. */
		label?: string;
	};

	let { label = 'Notifications' }: Props = $props();

	// Hovering or focusing the toast pauses its timer; they restart on leave.
	let paused = $state(false);

	// Re-show on every new toast so it stays above dialogs opened in the meantime.
	const topLayer: Attachment<HTMLOListElement> = (node) => {
		if (toasts.length === 0) return;
		node.hidePopover();
		node.showPopover();
	};

	const exitDuration = 150;

	// Waits for the outgoing toast, still in the DOM, to slide out first.
	function enter(node: HTMLElement) {
		const replacing = node.parentElement!.childElementCount > 1;
		return fly(node, { y: 24, duration: 200, delay: replacing ? exitDuration : 0 });
	}

	function timer(data: ToastData): Attachment {
		return () => {
			const duration = data.duration ?? (data.loading ? Infinity : 3000);
			if (paused || duration === Infinity) return;
			const timeout = setTimeout(() => toast.dismiss(data.id), duration);
			return () => clearTimeout(timeout);
		};
	}
</script>

<ol
	class="toaster"
	aria-label={label}
	aria-live="polite"
	popover="manual"
	onpointerenter={() => (paused = true)}
	onpointerleave={() => (paused = false)}
	onfocusin={() => (paused = true)}
	onfocusout={() => (paused = false)}
	{@attach topLayer}
>
	{#each toasts as data (data.id)}
		<!-- Pointer convenience only; the toast is not focusable and closes on its own -->
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
		<li
			class="toast"
			onclick={() => toast.dismiss(data.id)}
			aria-busy={data.loading || undefined}
			{@attach timer(data)}
			in:enter
			out:fly={{ y: 24, duration: exitDuration }}
		>
			{#if data.loading}
				<Spinner class="toast-spinner" aria-hidden="true" />
			{:else if data.icon}
				<data.icon class="toast-icon" aria-hidden="true" />
			{/if}
			<span class="toast-message">{data.message}</span>
			{#if data.action}
				{@const action = data.action}
				<Button class="toast-action" variant="secondary" size="sm" onclick={action.onclick}>
					{action.label}
				</Button>
			{/if}
		</li>
	{/each}
</ol>

<style>
	.toaster {
		position: fixed;
		inset: auto 0 16px;
		/* One cell: the outgoing toast overlaps the incoming one instead of stacking */
		display: grid;
		/* minmax(0, …) keeps a long message from widening the column past the screen */
		grid-template-columns: minmax(0, 1fr);
		justify-items: center;
		align-items: end;
		width: auto;
		height: auto;
		margin: 0;
		padding: 0 16px;
		overflow: visible;
		list-style: none;
		background: none;
		border: none;
		pointer-events: none;
	}

	.toast {
		grid-area: 1 / 1;
		display: flex;
		align-items: center;
		gap: 10px;
		box-sizing: border-box;
		max-width: min(420px, 100%);
		height: 44px;
		padding: 8px 16px 8px 14px;
		font-size: 13px;
		line-height: 1.4;
		background-color: var(--color-bg);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: 16px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
		pointer-events: auto;
		cursor: pointer;
	}

	/* Same gap to the right edge as above and below the 28px button: (44 - 2 - 28) / 2 */
	.toast:has(:global(.toast-action)) {
		padding-right: 7px;
	}

	/* Same sizes as in a Button */
	.toast :global(.toast-icon) {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}

	.toast :global(.toast-spinner) {
		--spinner-size: 14px;
		margin: 0 1px;
	}

	.toast-message {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.toast :global(.toast-action) {
		flex-shrink: 0;
		margin-left: 6px;
	}
</style>
