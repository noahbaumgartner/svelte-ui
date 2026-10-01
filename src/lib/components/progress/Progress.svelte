<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** Progress between 0 and `max`. Omit while the amount is unknown: the bar then runs back and forth. */
		value?: number;
		max?: number;
		size?: 'sm' | 'md';
		/** Accessible name, e.g. what is loading. */
		label?: string;
		ref?: HTMLDivElement | null;
	};

	let {
		value,
		max = 100,
		size = 'md',
		label,
		class: className,
		ref = $bindable(null),
		...rest
	}: Props = $props();

	let fraction = $derived(value === undefined ? undefined : Math.min(Math.max(value / max, 0), 1));
</script>

<div
	{...rest}
	bind:this={ref}
	role="progressbar"
	aria-label={label}
	aria-valuemin={0}
	aria-valuemax={max}
	aria-valuenow={fraction === undefined ? undefined : fraction * max}
	class={[
		'progress',
		`progress--${size}`,
		{ 'progress--indeterminate': fraction === undefined },
		className
	]}
>
	<div
		class="progress-bar"
		style:width={fraction === undefined ? undefined : `${fraction * 100}%`}
	></div>
</div>

<style>
	@layer svelte-ui {
		.progress {
			width: 100%;
			overflow: hidden;
			background-color: var(--color-surface);
			border-radius: 999px;
		}

		.progress--sm {
			height: 4px;
		}

		.progress--md {
			height: 8px;
		}

		.progress-bar {
			height: 100%;
			background-color: var(--color-accent);
			border-radius: inherit;
			transition: width 300ms ease;
		}

		.progress--indeterminate .progress-bar {
			width: 40%;
			animation: progress-slide 1.4s ease-in-out infinite;
		}

		@keyframes progress-slide {
			from {
				translate: -100% 0;
			}

			to {
				translate: 250% 0;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			.progress-bar {
				transition: none;
			}

			/* A full, dimmed bar instead of the movement */
			.progress--indeterminate .progress-bar {
				width: 100%;
				opacity: 0.4;
				animation: none;
			}
		}

		@media (forced-colors: active) {
			.progress {
				border: 1px solid CanvasText;
			}

			.progress-bar {
				forced-color-adjust: none;
				background-color: Highlight;
			}
		}
	}
</style>
