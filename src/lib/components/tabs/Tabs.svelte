<script lang="ts" module>
	import type { LucideIcon } from '@lucide/svelte';

	export type TabsOption<T extends string = string> = {
		value: T;
		label: string;
		/** Any Lucide icon (import from `svelte-ui/icons`). */
		icon?: LucideIcon;
		/** Turns the tabs into navigation links; give it to every option. */
		href?: string;
		disabled?: boolean;
	};
</script>

<script lang="ts" generics="T extends string">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onchange'> & {
		/** Value of the selected option. Bindable. */
		value?: T;
		/** The tabs. When every option has an `href` they render as links in a `<nav>` instead. */
		options: TabsOption<T>[];
		/** Accessible name for the tab list. */
		label?: string;
		size?: 'sm' | 'md';
		ref?: HTMLDivElement | null;
		/** Optional panel below the tabs; receives the selected value. Omit to render the content yourself. */
		children?: Snippet<[value: T]>;
		onchange?: (value: T) => void;
		/** Replaces the content of each tab (icon and label). */
		tab?: Snippet<[option: TabsOption<T>, selected: boolean]>;
	};

	let {
		value = $bindable(),
		options,
		label,
		size = 'md',
		ref = $bindable(null),
		class: className,
		children,
		onchange,
		tab,
		...rest
	}: Props = $props();

	const id = $props.id();

	let links = $derived(options.length > 0 && options.every((option) => option.href));
	let selectedIndex = $derived(options.findIndex((option) => option.value === value));
	/* The tab that Tab reaches: the selected one, or the first while nothing is selected */
	let tabStop = $derived(
		selectedIndex >= 0 ? selectedIndex : options.findIndex((option) => !option.disabled)
	);

	/* The tabs scroll sideways instead of wrapping; the edges fade out while there is more to scroll to */
	let scroller: HTMLDivElement | undefined = $state();
	let fade = $state({ start: false, end: false });

	function updateFade() {
		if (!scroller) return;
		const { scrollLeft, scrollWidth, clientWidth } = scroller;
		fade = { start: scrollLeft > 1, end: scrollLeft + clientWidth < scrollWidth - 1 };
	}

	$effect(() => {
		if (!scroller) return;
		updateFade();
		const observer = new ResizeObserver(updateFade);
		observer.observe(scroller);
		if (scroller.firstElementChild) observer.observe(scroller.firstElementChild);
		return () => observer.disconnect();
	});

	function select(option: TabsOption<T>) {
		if (option.value === value) return;
		value = option.value;
		onchange?.(option.value);
	}

	/* Arrow keys move the focus and the selection along */
	function handleKeydown(event: KeyboardEvent) {
		const tabs = Array.from(
			scroller?.querySelectorAll<HTMLElement>('[role="tab"]:not(:disabled)') ?? []
		);
		const index = tabs.indexOf(document.activeElement as HTMLElement);
		const last = tabs.length - 1;
		const target = {
			ArrowRight: index === last ? 0 : index + 1,
			ArrowLeft: index <= 0 ? last : index - 1,
			Home: 0,
			End: last
		}[event.key];

		if (target === undefined) return;
		event.preventDefault();
		tabs[target]?.focus();
		tabs[target]?.click();
	}
</script>

<div {...rest} bind:this={ref} class={['tabs', `tabs--${size}`, className]}>
	<div
		class={[
			'tabs-scroller',
			{ 'tabs-scroller--start': fade.start, 'tabs-scroller--end': fade.end }
		]}
		bind:this={scroller}
		onscroll={updateFade}
	>
		{#if links}
			<nav class="tabs-list" aria-label={label}>
				{#each options as option (option.value)}
					<!-- href comes from the consumer, who resolves it; this library has no routes -->
					<!-- eslint-disable svelte/no-navigation-without-resolve -->
					<a
						href={option.href}
						aria-current={option.value === value ? 'page' : undefined}
						class={['tabs-tab', { 'tabs-tab--selected': option.value === value }]}
					>
						{#if tab}
							{@render tab(option, option.value === value)}
						{:else}
							{#if option.icon}<option.icon class="tabs-icon" aria-hidden="true" />{/if}
							{option.label}
						{/if}
					</a>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				{/each}
			</nav>
		{:else}
			<!-- The tabs take the focus, not the list -->
			<!-- svelte-ignore a11y_interactive_supports_focus -->
			<div class="tabs-list" role="tablist" aria-label={label} onkeydown={handleKeydown}>
				{#each options as option, i (option.value)}
					<button
						type="button"
						role="tab"
						id="{id}-tab-{i}"
						aria-selected={i === selectedIndex}
						aria-controls={children ? `${id}-panel` : undefined}
						tabindex={i === tabStop ? 0 : -1}
						disabled={option.disabled}
						class={['tabs-tab', { 'tabs-tab--selected': i === selectedIndex }]}
						onclick={() => select(option)}
					>
						{#if tab}
							{@render tab(option, i === selectedIndex)}
						{:else}
							{#if option.icon}<option.icon class="tabs-icon" aria-hidden="true" />{/if}
							{option.label}
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>
	{#if children && !links && value !== undefined && selectedIndex >= 0}
		<div
			id="{id}-panel"
			role="tabpanel"
			aria-labelledby="{id}-tab-{selectedIndex}"
			tabindex="0"
			class="tabs-panel"
		>
			{@render children(value)}
		</div>
	{/if}
</div>

<style>
	@layer svelte-ui {
		.tabs {
			display: flex;
			flex-direction: column;
			gap: 12px;
			min-width: 0;
			max-width: 100%;
		}

		.tabs-scroller {
			--fade-start: 0px;
			--fade-end: 0px;
			display: flex;
			max-width: 100%;
			overflow-x: auto;
			scrollbar-width: none;
			mask-image: linear-gradient(
				to right,
				transparent,
				#000 var(--fade-start),
				#000 calc(100% - var(--fade-end)),
				transparent
			);
		}

		.tabs-scroller::-webkit-scrollbar {
			display: none;
		}

		.tabs-scroller--start {
			--fade-start: 32px;
		}

		.tabs-scroller--end {
			--fade-end: 32px;
		}

		.tabs-list {
			display: inline-flex;
			flex-shrink: 0;
			gap: 2px;
			padding: 3px;
			background-color: var(--color-surface);
			border-radius: 10px;
		}

		.tabs-tab {
			display: inline-flex;
			flex-shrink: 0;
			align-items: center;
			justify-content: center;
			gap: 6px;
			box-sizing: border-box;
			height: 26px;
			padding: 0 12px;
			font-family: inherit;
			font-size: 13px;
			font-weight: 500;
			color: var(--color-text-muted);
			text-decoration: none;
			white-space: nowrap;
			background-color: transparent;
			border: none;
			border-radius: 7px;
			outline: none;
			cursor: pointer;
			user-select: none;
			transition:
				background-color 200ms ease,
				color 200ms ease;
		}

		.tabs-tab:hover:not(:disabled) {
			color: var(--color-text);
		}

		/* Inside the tab, so the scroller does not clip it */
		.tabs-tab:focus-visible {
			outline: 2px solid var(--color-accent);
			outline-offset: -2px;
		}

		.tabs-tab:disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}

		.tabs-tab--selected {
			color: var(--color-text);
			background-color: var(--color-bg);
			box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
		}

		.tabs-tab :global(.tabs-icon) {
			width: 14px;
			height: 14px;
			flex-shrink: 0;
		}

		.tabs--sm .tabs-list {
			border-radius: 8px;
		}

		.tabs--sm .tabs-tab {
			height: 22px;
			padding: 0 10px;
			font-size: 12px;
			border-radius: 5px;
		}

		.tabs-panel {
			font-size: 13px;
			color: var(--color-text);
			border-radius: 6px;
			outline: none;
		}

		.tabs-panel:focus-visible {
			outline: 2px solid var(--color-accent);
			outline-offset: 2px;
		}

		@media (pointer: coarse) {
			.tabs-tab,
			.tabs--sm .tabs-tab {
				min-width: 44px;
				min-height: 44px;
			}
		}

		@media (forced-colors: active) {
			.tabs-list {
				border: 1px solid CanvasText;
			}

			.tabs-tab {
				color: ButtonText;
			}

			.tabs-tab--selected {
				color: HighlightText;
				background-color: Highlight;
				box-shadow: none;
			}

			.tabs-tab:disabled {
				color: GrayText;
			}

			.tabs-tab:focus-visible {
				outline-color: CanvasText;
			}

			.tabs-panel:focus-visible {
				outline-color: Highlight;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			.tabs-tab {
				transition: none;
			}
		}
	}
</style>
