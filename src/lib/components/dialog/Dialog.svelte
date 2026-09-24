<script module lang="ts">
	export type DialogTriggerProps = {
		onclick: () => void;
		'aria-haspopup': 'dialog';
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X } from '@lucide/svelte';
	import Button from '../button/Button.svelte';

	type Props = {
		/** Whether the dialog is open. Bindable. Escape, the close button and a click on the backdrop close it. */
		open?: boolean;
		title: string;
		description?: string;
		/** Renders the trigger. Spread the given props onto it, e.g. `<Button {...props} />`. Omit to control `open` yourself. */
		trigger?: Snippet<[DialogTriggerProps]>;
		/** The dialog's content. The first focusable element in it gets the focus on open. */
		children?: Snippet;
		/** Optional Buttons in the footer, right-aligned with the primary one last (rightmost). Call `close` to close the dialog. */
		actions?: Snippet<[close: () => void]>;
	};

	let { open = $bindable(false), title, description, trigger, children, actions }: Props = $props();

	const id = $props.id();
	let dialogEl: HTMLDialogElement;

	const triggerProps: DialogTriggerProps = {
		onclick: () => (open = true),
		'aria-haspopup': 'dialog'
	};

	function close() {
		open = false;
	}

	$effect(() => {
		if (open && !dialogEl.open) {
			dialogEl.showModal();
		} else if (!open && dialogEl.open) {
			dialogEl.close();
		}
	});
</script>

{@render trigger?.(triggerProps)}

<dialog
	bind:this={dialogEl}
	aria-labelledby="{id}-title"
	aria-describedby={description ? `${id}-description` : undefined}
	class="dialog"
	onkeydown={(event) => {
		if (event.key !== 'Escape') return;
		event.preventDefault();
		close();
	}}
	oncancel={(event) => {
		event.preventDefault();
		close();
	}}
	onclose={() => (open = false)}
	onclick={(event) => {
		// Clicks on the ::backdrop target the <dialog> itself, outside its box
		if (event.target !== dialogEl) return;
		const rect = dialogEl.getBoundingClientRect();
		const inside =
			event.clientX >= rect.left &&
			event.clientX <= rect.right &&
			event.clientY >= rect.top &&
			event.clientY <= rect.bottom;
		if (!inside) close();
	}}
>
	<div class="dialog-content">
		<h2 id="{id}-title" class="dialog-title">{title}</h2>
		{#if description}
			<p id="{id}-description" class="dialog-description">{description}</p>
		{/if}
		{#if children}
			<div class="dialog-body">{@render children()}</div>
		{/if}
	</div>
	{#if actions}
		<div class="dialog-actions">
			{@render actions(close)}
		</div>
	{/if}
	<!-- Last in the DOM so the content, not the close button, gets the initial focus -->
	<Button class="dialog-close" variant="ghost" size="sm" icon={X} label="Close" onclick={close} />
</dialog>

<style>
	/* Locks page scrolling while open; the gutter keeps the layout from shifting */
	:global(html:has(.dialog[open])) {
		overflow: hidden;
		scrollbar-gutter: stable;
	}

	.dialog {
		box-sizing: border-box;
		width: calc(100% - 32px);
		max-width: 480px;
		max-height: calc(100% - 32px);
		flex-direction: column;
		padding: 0;
		overflow: hidden;
		background-color: var(--color-bg);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: 14px;
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.16);
		outline: none;
		opacity: 0;
		scale: 0.95;
		transition:
			opacity 140ms ease,
			scale 140ms ease,
			display 140ms allow-discrete,
			overlay 140ms allow-discrete;
	}

	.dialog[open] {
		display: flex;
		opacity: 1;
		scale: 1;
	}

	.dialog::backdrop {
		background-color: rgba(0, 0, 0, 0);
		transition:
			background-color 140ms ease,
			display 140ms allow-discrete,
			overlay 140ms allow-discrete;
	}

	.dialog[open]::backdrop {
		background-color: rgba(0, 0, 0, 0.4);
	}

	@starting-style {
		.dialog[open] {
			opacity: 0;
			scale: 0.95;
		}

		.dialog[open]::backdrop {
			background-color: rgba(0, 0, 0, 0);
		}
	}

	.dialog-content {
		min-height: 0;
		padding: 20px;
		overflow-y: auto;
	}

	.dialog-title {
		margin: 0;
		padding-right: 32px;
		font-size: 15px;
		font-weight: 600;
	}

	.dialog-description {
		margin: 6px 0 0;
		font-size: 13px;
		line-height: 1.5;
		color: var(--color-text-muted);
	}

	.dialog-body {
		margin-top: 16px;
		font-size: 13px;
	}

	.dialog-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 4px;
		padding: 16px;
		border-top: 1px solid var(--color-border);
	}

	.dialog :global(.dialog-close) {
		position: absolute;
		top: 14px;
		right: 14px;
	}
</style>
