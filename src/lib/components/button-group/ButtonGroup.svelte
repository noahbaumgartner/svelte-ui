<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		orientation?: 'horizontal' | 'vertical';
		/** Accessible name for the group. */
		label?: string;
		/** Buttons, or ContextMenus with a Button trigger (split button). */
		children: Snippet;
	};

	let { orientation = 'horizontal', label, class: className, children, ...rest }: Props = $props();
</script>

<div
	{...rest}
	role="group"
	aria-label={label}
	class={['button-group', `button-group--${orientation}`, className]}
>
	{@render children()}
</div>

<style>
	.button-group {
		display: inline-flex;
		gap: 1px;
		width: fit-content;
	}

	.button-group--vertical {
		flex-direction: column;
	}

	/* Keep the focus ring above neighbouring buttons */
	.button-group > :global(*) {
		position: relative;
	}

	.button-group > :global(:is(:focus-visible, :has(:focus-visible))) {
		z-index: 1;
	}

	.button-group--vertical > :global(*),
	.button-group--vertical > :global(* > .button) {
		width: 100%;
	}

	/* Outline buttons share their borders instead of sitting 1px apart */
	.button-group:has(> :global(.button--outline), > :global(* > .button--outline)) {
		gap: 0;
	}

	.button-group--horizontal > :global(.button--outline:not(:first-child)),
	.button-group--horizontal > :global(:not(:first-child):has(> .button--outline)) {
		margin-inline-start: -1px;
	}

	.button-group--vertical > :global(.button--outline:not(:first-child)),
	.button-group--vertical > :global(:not(:first-child):has(> .button--outline)) {
		margin-block-start: -1px;
	}

	/* Square the inner corners; `* > .button` reaches a ContextMenu's trigger */
	.button-group--horizontal > :global(:not(:first-child)),
	.button-group--horizontal > :global(:not(:first-child) > .button) {
		border-start-start-radius: 0;
		border-end-start-radius: 0;
	}

	.button-group--horizontal > :global(:not(:last-child)),
	.button-group--horizontal > :global(:not(:last-child) > .button) {
		border-start-end-radius: 0;
		border-end-end-radius: 0;
	}

	.button-group--vertical > :global(:not(:first-child)),
	.button-group--vertical > :global(:not(:first-child) > .button) {
		border-start-start-radius: 0;
		border-start-end-radius: 0;
	}

	.button-group--vertical > :global(:not(:last-child)),
	.button-group--vertical > :global(:not(:last-child) > .button) {
		border-end-start-radius: 0;
		border-end-end-radius: 0;
	}
</style>
