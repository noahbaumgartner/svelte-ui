<script lang="ts" module>
	export type FileInputLabels = {
		/** Prompt while nothing is selected and a single file is expected. */
		choose: string;
		/** Prompt while nothing is selected and several files are allowed. */
		chooseMultiple: string;
		/** Shown instead of the prompt while files are dragged over the field. */
		drop: string;
		/** Accessible name of the button that clears the selection. */
		remove: string;
		/** Summary for a selection of more than one file. */
		files: (count: number) => string;
	};
</script>

<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import FileIcon from '../../internal/icons/File.svelte';
	import UploadIcon from '../../internal/icons/Upload.svelte';
	import XIcon from '../../internal/icons/X.svelte';

	type Props = Omit<HTMLInputAttributes, 'type' | 'value' | 'files'> & {
		/** The selected files. Bindable, but read-only: it follows the field and does not set it. */
		files?: FileList | null;
		/** Accessible names and prompts. */
		labels?: Partial<FileInputLabels>;
		/** The `<input type="file">` element. Bindable. */
		ref?: HTMLInputElement | null;
	};

	const defaultLabels: FileInputLabels = {
		choose: 'Choose a file or drop it here',
		chooseMultiple: 'Choose files or drop them here',
		drop: 'Drop to select',
		remove: 'Remove selection',
		files: (count) => `${count} files`
	};

	let {
		files = $bindable(null),
		labels,
		ref = $bindable(null),
		onchange,
		class: className,
		style,
		disabled,
		...rest
	}: Props = $props();

	let mergedLabels = $derived({ ...defaultLabels, ...labels });
	let wrapperEl: HTMLElement | undefined = $state();
	let dragging = $state(false);

	let selected = $derived(files ? Array.from(files) : []);
	let filled = $derived(selected.length > 0);
	let name = $derived(
		selected.length > 1 ? mergedLabels.files(selected.length) : selected[0]?.name
	);
	let size = $derived(formatSize(selected.reduce((sum, file) => sum + file.size, 0)));

	function formatSize(bytes: number) {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, '')} MB`;
	}

	function handleChange(event: Event & { currentTarget: HTMLInputElement }) {
		files = event.currentTarget.files;
		onchange?.(event);
	}

	/* The browser empties the field on a form reset without firing change */
	$effect(() => {
		const form = ref?.form;
		if (!form) return;
		const reset = () => queueMicrotask(() => (files = ref?.files ?? null));
		form.addEventListener('reset', reset);
		return () => form.removeEventListener('reset', reset);
	});

	function clear() {
		if (!ref) return;
		ref.value = '';
		ref.dispatchEvent(new Event('input', { bubbles: true }));
		ref.dispatchEvent(new Event('change', { bubbles: true }));
		ref.focus();
	}

	function handleDragEnter(event: DragEvent) {
		if (!disabled && event.dataTransfer?.types.includes('Files')) dragging = true;
	}

	function handleDragLeave(event: DragEvent) {
		if (!wrapperEl?.contains(event.relatedTarget as Node | null)) dragging = false;
	}
</script>

<!-- The native input covers the whole field, so clicks, keyboard and drops are handled by the
     browser. The drag handlers only draw the highlight. -->
<div
	role="presentation"
	bind:this={wrapperEl}
	class={[
		'file-input',
		{ 'file-input--filled': filled, 'file-input--dragging': dragging },
		className
	]}
	{style}
	ondragenter={handleDragEnter}
	ondragleave={handleDragLeave}
	ondrop={() => (dragging = false)}
>
	<input
		title=""
		{...rest}
		type="file"
		bind:this={ref}
		{disabled}
		onchange={handleChange}
		class="file-input-native"
	/>
	<span class="file-input-icon" aria-hidden="true">
		{#if filled && !dragging}<FileIcon />{:else}<UploadIcon />{/if}
	</span>
	{#if filled && !dragging}
		<span class="file-input-text">
			<span class="file-input-name">{name}</span>
			<span class="file-input-size">{size}</span>
		</span>
	{:else}
		<span class="file-input-text file-input-prompt">
			{dragging
				? mergedLabels.drop
				: rest.multiple
					? mergedLabels.chooseMultiple
					: mergedLabels.choose}
		</span>
	{/if}
	{#if filled && !disabled}
		<button type="button" class="file-input-clear" aria-label={mergedLabels.remove} onclick={clear}>
			<XIcon aria-hidden="true" />
		</button>
	{/if}
</div>

<style>
	@layer svelte-ui {
		.file-input {
			position: relative;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			gap: 12px;
			width: 100%;
			min-width: 0;
			min-height: 56px;
			padding: 10px 12px;
			font-size: 13px;
			color: var(--color-text-muted);
			background-color: var(--color-surface);
			border: 1px dashed var(--color-border-strong);
			border-radius: var(--radius-lg);
			transition:
				background-color 200ms ease,
				border-color 200ms ease;
		}

		.file-input:hover:not(:has(:disabled)) {
			background-color: var(--color-surface-hover);
		}

		.file-input--dragging,
		.file-input--dragging:hover:not(:has(:disabled)) {
			background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);
			border-color: var(--color-accent);
		}

		.file-input--filled {
			color: var(--color-text);
			border-style: solid;
			border-color: var(--color-border);
		}

		.file-input:has(.file-input-native:focus-visible) {
			border-color: var(--color-accent);
			outline: 1px solid var(--color-accent);
		}

		.file-input:has(.file-input-native[aria-invalid='true']) {
			border-color: var(--color-destructive);
		}

		.file-input:has(.file-input-native[aria-invalid='true']:focus-visible) {
			outline-color: var(--color-destructive);
		}

		.file-input:has(:disabled) {
			cursor: not-allowed;
			opacity: 0.5;
		}

		/* Invisible but focusable, and on top so the browser handles clicks and drops itself */
		.file-input-native {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			margin: 0;
			padding: 0;
			font-size: 0;
			opacity: 0;
			cursor: pointer;
		}

		.file-input-native:disabled {
			cursor: not-allowed;
		}

		.file-input-icon {
			display: flex;
			flex-shrink: 0;
			align-items: center;
			justify-content: center;
			width: 32px;
			height: 32px;
			color: var(--color-text-secondary);
			background-color: var(--color-bg);
			border-radius: var(--radius-md);
		}

		.file-input-icon :global(svg) {
			width: 16px;
			height: 16px;
		}

		.file-input-text {
			display: flex;
			flex: 1;
			flex-direction: column;
			min-width: 0;
		}

		.file-input-prompt {
			justify-content: center;
		}

		.file-input-name {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.file-input-size {
			font-size: 12px;
			color: var(--color-text-muted);
		}

		/* Above the native input so it stays clickable */
		.file-input-clear {
			position: relative;
			display: flex;
			flex-shrink: 0;
			align-items: center;
			justify-content: center;
			width: 28px;
			height: 28px;
			padding: 0;
			color: var(--color-text-muted);
			background-color: transparent;
			border: none;
			border-radius: var(--radius-md);
			cursor: pointer;
			transition:
				background-color 200ms ease,
				color 200ms ease;
		}

		.file-input-clear:hover {
			color: var(--color-text);
			background-color: var(--color-surface-active);
		}

		.file-input-clear:focus-visible {
			outline: 2px solid var(--color-accent);
			outline-offset: 1px;
		}

		.file-input-clear :global(svg) {
			width: 14px;
			height: 14px;
		}

		/* iOS Safari zooms into focused fields with text below 16px */
		@supports (-webkit-touch-callout: none) {
			.file-input {
				font-size: 16px;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			.file-input,
			.file-input-clear {
				transition: none;
			}
		}

		@media (forced-colors: active) {
			.file-input {
				border-color: ButtonText;
			}

			.file-input:has(.file-input-native:focus-visible),
			.file-input--dragging {
				border-color: Highlight;
				outline: 2px solid Highlight;
			}

			.file-input:has(.file-input-native[aria-invalid='true']) {
				border-width: 2px;
			}

			.file-input:has(:disabled) {
				color: GrayText;
				border-color: GrayText;
				opacity: 1;
			}

			.file-input-clear:focus-visible {
				outline-color: Highlight;
			}
		}
	}
</style>
