<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LucideIcon } from '@lucide/svelte';

	type Props = {
		/** Makes the whole card a link. */
		href?: string;
		/** Bold lead-in before the description, followed by a colon. */
		title: string;
		description?: string;
		/** Muted text below, e.g. a date. */
		meta?: string;
		/** Any Lucide icon (import from `svelte-ui/icons`), shown in the top-left corner of the media. */
		icon?: LucideIcon;
		orientation?: 'vertical' | 'horizontal';
		/** Square media that fills the frame, e.g. a MeshGradient or an `<img>`. */
		media: Snippet;
		class?: string;
	};

	let {
		href,
		title,
		description,
		meta,
		icon: Icon,
		orientation = 'vertical',
		media,
		class: className
	}: Props = $props();
</script>

<svelte:element
	this={href ? 'a' : 'div'}
	{href}
	class={['preview-card', `preview-card--${orientation}`, className]}
>
	<div class="preview-card-media">
		{@render media()}
		{#if Icon}
			<span class="preview-card-icon"><Icon aria-hidden="true" /></span>
		{/if}
	</div>
	<div class="preview-card-info">
		<p class="preview-card-headline">
			<span class="preview-card-title">{title}{description ? ':' : ''}</span>
			{description}
		</p>
		{#if meta}
			<span class="preview-card-meta">{meta}</span>
		{/if}
	</div>
</svelte:element>

<style>
	.preview-card {
		display: flex;
		gap: 20px;
		color: var(--color-text);
		text-decoration: none;
		border-radius: 14px;
		outline: none;
	}

	a.preview-card:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.preview-card--vertical {
		flex-direction: column;
	}

	.preview-card--horizontal {
		align-items: center;
	}

	.preview-card-media {
		position: relative;
		flex-shrink: 0;
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: 14px;
	}

	.preview-card--horizontal .preview-card-media {
		width: 140px;
	}

	.preview-card-media > :global(:not(.preview-card-icon)) {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: inherit;
		transition: transform 300ms ease;
	}

	a.preview-card:hover .preview-card-media > :global(:not(.preview-card-icon)) {
		transform: scale(1.05);
	}

	.preview-card-icon {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		color: var(--color-base);
		background-color: var(--color-ink);
		border-radius: 14px 0 0 0;
	}

	.preview-card-icon :global(svg) {
		width: 20px;
		height: 20px;
	}

	.preview-card--horizontal .preview-card-icon {
		width: 32px;
		height: 32px;
	}

	.preview-card--horizontal .preview-card-icon :global(svg) {
		width: 16px;
		height: 16px;
	}

	.preview-card-info {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}

	.preview-card-headline {
		margin: 0;
		font-size: 16px;
	}

	.preview-card-title {
		font-weight: 600;
	}

	.preview-card-meta {
		font-size: 14px;
		color: var(--color-text-muted);
	}

	@media (min-width: 640px) {
		.preview-card--horizontal .preview-card-media {
			width: 168px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.preview-card-media > :global(*) {
			transition: none;
		}
	}
</style>
