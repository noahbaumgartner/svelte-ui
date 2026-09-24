<script module lang="ts">
	export type AlertDialogTriggerProps = {
		onclick: () => void;
		'aria-haspopup': 'dialog';
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		/** Whether the dialog is open. Bindable. Escape closes it. */
		open?: boolean;
		title: string;
		description?: string;
		/** Renders the trigger. Spread the given props onto it, e.g. `<Button {...props} />`. Omit to control `open` yourself. */
		trigger?: Snippet<[AlertDialogTriggerProps]>;
		/** The Buttons, primary first and least destructive last; the last one gets the focus on open. Call `close` to close the dialog. */
		actions: Snippet<[close: () => void]>;
		/** Extra content between the description and the buttons. */
		children?: Snippet;
	};

	let { open = $bindable(false), title, description, trigger, actions, children }: Props = $props();

	const id = $props.id();
	let dialogEl: HTMLDialogElement;

	const triggerProps: AlertDialogTriggerProps = {
		onclick: () => (open = true),
		'aria-haspopup': 'dialog'
	};

	function close() {
		open = false;
	}

	$effect(() => {
		if (open && !dialogEl.open) {
			dialogEl.showModal();
			Array.from(dialogEl.querySelectorAll<HTMLElement>('.alert-dialog-actions :is(button, a)'))
				.at(-1)
				?.focus();
		} else if (!open && dialogEl.open) {
			dialogEl.close();
		}
	});
</script>

{@render trigger?.(triggerProps)}

<dialog
	bind:this={dialogEl}
	role="alertdialog"
	aria-labelledby="{id}-title"
	aria-describedby={description ? `${id}-description` : undefined}
	class="alert-dialog"
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
>
	<h2 id="{id}-title" class="alert-dialog-title">{title}</h2>
	{#if description}
		<p id="{id}-description" class="alert-dialog-description">{description}</p>
	{/if}
	{#if children}
		<div class="alert-dialog-body">{@render children()}</div>
	{/if}
	<div class="alert-dialog-actions">
		{@render actions(close)}
	</div>
</dialog>

<style>
	/* Locks page scrolling while open; the gutter keeps the layout from shifting */
	:global(html:has(.alert-dialog[open])) {
		overflow: hidden;
		scrollbar-gutter: stable;
	}

	.alert-dialog {
		box-sizing: border-box;
		width: calc(100% - 32px);
		max-width: 420px;
		padding: 20px;
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

	.alert-dialog[open] {
		opacity: 1;
		scale: 1;
	}

	.alert-dialog::backdrop {
		background-color: rgba(0, 0, 0, 0);
		transition:
			background-color 140ms ease,
			display 140ms allow-discrete,
			overlay 140ms allow-discrete;
	}

	.alert-dialog[open]::backdrop {
		background-color: rgba(0, 0, 0, 0.4);
	}

	@starting-style {
		.alert-dialog[open] {
			opacity: 0;
			scale: 0.95;
		}

		.alert-dialog[open]::backdrop {
			background-color: rgba(0, 0, 0, 0);
		}
	}

	.alert-dialog-title {
		margin: 0;
		font-size: 15px;
		font-weight: 600;
	}

	.alert-dialog-description {
		margin: 6px 0 0;
		font-size: 13px;
		line-height: 1.5;
		color: var(--color-text-muted);
	}

	.alert-dialog-body {
		margin-top: 16px;
		font-size: 13px;
	}

	.alert-dialog-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 4px;
		margin-top: 20px;
	}
</style>
