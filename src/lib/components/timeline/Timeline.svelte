<script module lang="ts">
	export type TimelineItem = {
		/** Muted text left of the item, e.g. "2021 - 2025". */
		period: string;
		/** Rendered as an `<h3>`. */
		title: string;
		/** Muted line below the title, e.g. a company or institution. */
		subtitle?: string;
		/** Turns the subtitle into a Link. */
		href?: string;
		description?: string;
	};
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Link from '../link/Link.svelte';

	type Props = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
		/** Rendered as an `<h2>` next to the list. */
		title?: string;
		items: TimelineItem[];
		ref?: HTMLElement | null;
	};

	let { title, items, class: className, ref = $bindable(null), ...rest }: Props = $props();
</script>

<section {...rest} bind:this={ref} class={['timeline', className]}>
	{#if title}
		<h2 class="timeline-title">{title}</h2>
	{/if}
	<ol class="timeline-list">
		{#each items as item (item.title + item.period)}
			<li class="timeline-item">
				<span class="timeline-period">{item.period}</span>
				<div class="timeline-body">
					<h3 class="timeline-item-title">{item.title}</h3>
					{#if item.subtitle}
						<p class="timeline-subtitle">
							{#if item.href}
								<Link href={item.href}>{item.subtitle}</Link>
							{:else}
								{item.subtitle}
							{/if}
						</p>
					{/if}
					{#if item.description}
						<p class="timeline-description">{item.description}</p>
					{/if}
				</div>
			</li>
		{/each}
	</ol>
</section>

<style>
	.timeline {
		display: grid;
		gap: 32px;
	}

	.timeline-title {
		font-size: clamp(24px, 2vw + 16px, 32px);
		font-weight: 500;
		letter-spacing: -0.01em;
	}

	.timeline-list {
		border-bottom: 1px solid var(--color-border);
	}

	.timeline-item {
		display: grid;
		gap: 8px;
		padding-block: 24px;
		border-top: 1px solid var(--color-border);
	}

	.timeline-period {
		font-size: 14px;
		color: var(--color-text-muted);
	}

	.timeline-body {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.timeline-item-title {
		font-size: 20px;
		font-weight: 500;
	}

	.timeline-subtitle {
		font-size: 15px;
		color: var(--color-text-muted);
	}

	.timeline-description {
		margin-top: 8px;
		max-width: 640px;
	}

	@media (min-width: 768px) {
		.timeline {
			grid-template-columns: 1fr 2fr;
			gap: 64px;
		}

		.timeline-item {
			grid-template-columns: 180px 1fr;
			gap: 32px;
			padding-block: 32px;
		}

		.timeline-period {
			padding-top: 4px;
		}
	}
</style>
