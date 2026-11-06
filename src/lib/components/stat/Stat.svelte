<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { IconComponent } from '../../icon.js';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** What the figure measures, e.g. "Revenue". */
		label: string;
		/** The figure itself, already formatted. */
		value: string | number | Snippet;
		/** Small text below the value, e.g. a comparison or unit. */
		hint?: string;
		icon?: IconComponent;
		size?: 'md' | 'lg';
		variant?: 'outline' | 'secondary';
		ref?: HTMLDivElement | null;
	};

	let {
		label,
		value,
		hint,
		icon: Icon,
		size = 'md',
		variant = 'outline',
		class: className,
		ref = $bindable(null),
		...rest
	}: Props = $props();
</script>

<div {...rest} bind:this={ref} class={['stat', `stat--${size}`, `stat--${variant}`, className]}>
	<dl class="stat-list">
		<dt class="stat-label">
			{#if Icon}<Icon class="stat-icon" aria-hidden="true" />{/if}
			{label}
		</dt>
		<dd class="stat-value">
			{#if typeof value === 'function'}{@render value()}{:else}{value}{/if}
		</dd>
		{#if hint}<dd class="stat-hint">{hint}</dd>{/if}
	</dl>
</div>

<style>
	@layer svelte-ui {
		.stat {
			padding: 16px;
			border-radius: 12px;
		}

		.stat--outline {
			border: 1px solid var(--color-border);
			background-color: var(--color-bg);
		}

		.stat--secondary {
			background-color: var(--color-surface);
		}

		.stat-list {
			display: flex;
			flex-direction: column;
			gap: 4px;
			margin: 0;
		}

		.stat-label {
			display: flex;
			align-items: center;
			gap: 6px;
			color: var(--color-text-muted);
			font-size: 13px;
		}

		.stat-label :global(.stat-icon) {
			width: 14px;
			height: 14px;
			flex-shrink: 0;
		}

		.stat-value {
			margin: 0;
			color: var(--color-text);
			font-size: 24px;
			font-weight: 600;
			font-variant-numeric: tabular-nums;
			letter-spacing: -0.01em;
		}

		.stat--lg .stat-value {
			font-size: 36px;
		}

		.stat-hint {
			margin: 0;
			color: var(--color-text-muted);
			font-size: 12px;
		}

		@media (forced-colors: active) {
			.stat--secondary {
				border: 1px solid CanvasText;
			}
		}
	}
</style>
