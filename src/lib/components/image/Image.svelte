<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';

	type Props = Omit<HTMLImgAttributes, 'alt' | 'src'> & {
		/** The img element. Bindable. */
		ref?: HTMLImageElement | null;
		src: string;
		/** Describes the image; use `""` for purely decorative images. */
		alt: string;
		/**
		 * Crops the image to this CSS aspect ratio, e.g. `1` or `16 / 9`. Without it the image keeps
		 * its natural ratio. Pass `width` and `height` to reserve the space before it loads.
		 */
		ratio?: string | number;
		/** How the image fills the frame when `ratio` crops it. */
		fit?: 'cover' | 'contain';
	};

	let {
		ref = $bindable(null),
		src,
		alt,
		ratio,
		fit = 'cover',
		loading = 'lazy',
		decoding = 'async',
		class: className,
		...rest
	}: Props = $props();
</script>

<img
	{...rest}
	bind:this={ref}
	{src}
	{alt}
	{loading}
	{decoding}
	class={['image', `image--${fit}`, className]}
	style:aspect-ratio={ratio}
/>

<style>
	@layer svelte-ui {
		.image {
			display: block;
			max-width: 100%;
			height: auto;
			background-color: var(--color-surface);
			border-radius: 10px;
		}

		.image--cover {
			object-fit: cover;
		}

		.image--contain {
			object-fit: contain;
		}
	}
</style>
