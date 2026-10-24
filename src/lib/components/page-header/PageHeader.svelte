<script lang="ts">
	import type { Snippet } from 'svelte';
	import Section from '../section/Section.svelte';

	let {
		eyebrow,
		title,
		description,
		children,
		footer
	}: {
		eyebrow?: string;
		title: string | Snippet;
		description?: string | Snippet;
		/** Below the description, e.g. a media preview. */
		children?: Snippet;
		/** Below the header box, e.g. a divider with actions. */
		footer?: Snippet;
	} = $props();
</script>

<Section width="full" surface={false} padded={false}>
	<div class="page-header-box">
		{#if eyebrow}
			<span class="page-header-eyebrow">{eyebrow}</span>
		{/if}
		<h1 class="page-header-title">
			{#if typeof title === 'string'}{title}{:else}{@render title()}{/if}
		</h1>
		{#if description}
			<p class="page-header-description">
				{#if typeof description === 'string'}{description}{:else}{@render description()}{/if}
			</p>
		{/if}
		{@render children?.()}
	</div>
	{@render footer?.()}
</Section>

<style>
	.page-header-box {
		margin-inline: auto;
		max-width: 1280px;
		padding: 56px 0 30px;
		display: flex;
		flex-direction: column;
		align-items: center;
		user-select: none;
	}

	.page-header-eyebrow {
		font-size: 14px;
		font-weight: 500;
		margin-bottom: 4px;
	}

	.page-header-title {
		/* Tighter lines for multi-line titles; the margin gives back the half-leading
		   of the default 1.5, so the gaps above and below stay the same. */
		line-height: 1.15;
		margin-block: 0.175em;
		text-align: center;
	}

	.page-header-description {
		margin-top: 8px;
		max-width: 440px;
		text-align: center;
		color: var(--color-text-secondary);
	}

	@media (min-width: 640px) {
		.page-header-box {
			padding: 72px 0 40px;
		}
	}

	@media (min-width: 1024px) {
		.page-header-box {
			padding-bottom: 64px;
		}
	}
</style>
