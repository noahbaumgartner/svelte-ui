<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
		size?: 'sm' | 'md' | 'lg';
		/** Accessible name. Ignored when the spinner is `aria-hidden`, e.g. inside a loading Button. */
		label?: string;
	};

	let { size = 'md', label = 'Loading', class: className, ...rest }: Props = $props();
</script>

<span {...rest} role="status" aria-label={label} class={['spinner', `spinner--${size}`, className]}
></span>

<style>
	@property --spinner-angle {
		syntax: '<angle>';
		initial-value: 0deg;
		inherits: false;
	}

	.spinner {
		--spinner-size: 16px;
		position: relative;
		display: inline-block;
		flex-shrink: 0;
		width: var(--spinner-size);
		height: var(--spinner-size);
	}

	.spinner--sm {
		--spinner-size: 14px;
	}

	.spinner--lg {
		--spinner-size: 20px;
	}

	.spinner::before,
	.spinner::after {
		content: '';
		position: absolute;
		inset: 0;
		box-sizing: border-box;
		border: calc(var(--spinner-size) / 8) solid currentColor;
		border-radius: 30%;
	}

	/* Track */
	.spinner::before {
		opacity: 0.2;
	}

	/* Handle: a conic mask whose head is opaque and whose tail fades out */
	.spinner::after {
		mask: conic-gradient(from var(--spinner-angle), transparent 0% 60%, #000 100%);
		animation: spinner-rotate 1s linear infinite;
	}

	@keyframes spinner-rotate {
		to {
			--spinner-angle: 360deg;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.spinner::after {
			animation-duration: 3s;
		}
	}
</style>
