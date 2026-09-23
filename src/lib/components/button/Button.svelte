<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { LucideIcon } from '@lucide/svelte';

	type Props = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
		/** Renders an <a> instead of a <button>. External (http) links open in a new tab. */
		href?: string;
		target?: string;
		rel?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		/** `overlay` is a translucent, blurred fill for use on top of images or media. */
		variant?: 'primary' | 'secondary' | 'ghost' | 'overlay';
		size?: 'sm' | 'md' | 'lg';
		/** Fully rounded: a pill with a label, a circle when icon-only. */
		rounded?: boolean;
		/** Any Lucide icon (import from `svelte-ui/icons`). */
		icon?: LucideIcon;
		/** Accessible name. Required when the button has no label (icon-only). */
		label?: string;
		children?: Snippet;
	};

	let {
		href,
		target,
		rel,
		type = 'button',
		disabled = false,
		variant = 'primary',
		size = 'md',
		rounded = false,
		icon: Icon,
		label,
		class: className,
		children,
		...rest
	}: Props = $props();

	let iconOnly = $derived(!children);
	let resolvedTarget = $derived(target ?? (href?.startsWith('http') ? '_blank' : undefined));
	let resolvedRel = $derived(rel ?? (resolvedTarget === '_blank' ? 'noopener' : undefined));
	let classes = $derived([
		'button',
		`button--${variant}`,
		`button--${size}`,
		{
			'button--rounded': rounded,
			'button--icon-only': iconOnly,
			'button--no-icon': !Icon
		},
		className
	]);
</script>

{#snippet content()}
	{#if Icon}<Icon class="button-icon" aria-hidden="true" />{/if}
	{#if children}<span class="button-label">{@render children()}</span>{/if}
{/snippet}

{#if href && !disabled}
	<!-- href comes from the consumer, who resolves it; this library has no routes -->
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a {...rest} {href} target={resolvedTarget} rel={resolvedRel} aria-label={label} class={classes}>
		{@render content()}
	</a>
{:else}
	<button {...rest} {type} {disabled} aria-label={label} class={classes}>
		{@render content()}
	</button>
{/if}

<style>
	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		min-width: 0;
		box-sizing: border-box;
		border: none;
		border-radius: 10px;
		font-family: inherit;
		font-size: 13px;
		text-decoration: none;
		outline: none;
		cursor: pointer;
		user-select: none;
		transition:
			background-color 200ms ease,
			color 200ms ease,
			opacity 200ms ease;
	}

	.button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.button-label {
		overflow: hidden;
		min-width: 0;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.button:focus-visible {
		outline: 2px solid var(--color-ink);
		outline-offset: 2px;
	}

	.button :global(.button-icon) {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}

	/* Sizes */

	.button--lg {
		height: 36px;
		padding: 0 20px 0 16px;
	}

	.button--md {
		height: 32px;
		padding: 0 15px 0 11px;
	}

	.button--sm {
		height: 28px;
		padding: 0 12px 0 9px;
		gap: 5px;
		border-radius: 8px;
		font-size: 12px;
	}

	.button--sm :global(.button-icon) {
		width: 14px;
		height: 14px;
	}

	.button--no-icon.button--sm {
		padding: 0 12px;
	}

	.button--no-icon.button--lg {
		padding: 0 20px;
	}

	.button--no-icon.button--md {
		padding: 0 16px;
	}

	/* Icon-only is square */
	.button--icon-only.button--lg {
		width: 36px;
		padding: 0;
	}

	.button--icon-only.button--md {
		width: 32px;
		padding: 0;
	}

	.button--icon-only.button--sm {
		width: 28px;
		padding: 0;
	}

	.button--rounded {
		border-radius: 999px;
	}

	/* Variants */

	.button--primary {
		background-color: var(--color-ink);
		color: var(--color-base);
	}

	.button--primary:hover:not(:disabled) {
		background-color: var(--color-ink-hover);
	}

	.button--secondary {
		background-color: var(--color-surface);
		color: var(--color-text);
	}

	.button--secondary:hover:not(:disabled) {
		background-color: var(--color-surface-hover);
	}

	.button--ghost {
		background-color: transparent;
		color: var(--color-text);
	}

	.button--ghost:hover:not(:disabled) {
		background-color: var(--color-surface);
	}

	.button--overlay {
		background-color: color-mix(in srgb, var(--color-surface) 60%, transparent);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		color: var(--color-text);
	}

	.button--overlay:hover:not(:disabled) {
		background-color: color-mix(in srgb, var(--color-surface) 75%, transparent);
	}
</style>
