<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

	let { class: className, ...rest }: Props = $props();
</script>

<div {...rest} aria-hidden="true" class={['skeleton', className]}></div>

<style>
	.skeleton {
		flex-shrink: 0;
		border-radius: 6px;
		background-color: var(--color-surface);
		animation: skeleton-pulse 2s ease-in-out infinite;
	}

	@keyframes skeleton-pulse {
		50% {
			opacity: 0.5;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.skeleton {
			animation: none;
		}
	}
</style>
