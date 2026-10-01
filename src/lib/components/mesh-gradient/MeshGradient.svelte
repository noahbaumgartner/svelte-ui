<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** First colour is the background, every colour becomes a blurred blob. */
		colors: string[];
		/** Same seed gives the same layout; defaults to the joined colours. */
		seed?: string;
		/** Film grain overlay. */
		grain?: boolean;
		ref?: HTMLDivElement | null;
	};

	let {
		colors,
		seed = '',
		grain = true,
		class: className,
		ref = $bindable(null),
		...rest
	}: Props = $props();

	function hashSeed(str: string) {
		let h = 0;
		for (let i = 0; i < str.length; i++) {
			h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
		}
		return h >>> 0;
	}

	function mulberry32(a: number) {
		return function () {
			a |= 0;
			a = (a + 0x6d2b79f5) | 0;
			let t = Math.imul(a ^ (a >>> 15), 1 | a);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	const blobs = $derived.by(() => {
		const rand = mulberry32(hashSeed(seed || colors.join('')));
		return colors.map((color) => ({
			color,
			x: 10 + rand() * 80,
			y: 10 + rand() * 80,
			size: 70 + rand() * 60,
			blur: rand() * 20
		}));
	});
</script>

<div
	{...rest}
	bind:this={ref}
	class={['mesh-gradient', grain && 'mesh-gradient--grain', className]}
	style:background-color={colors[0]}
	aria-hidden="true"
>
	{#each blobs as blob, i (i)}
		<div
			class="mesh-gradient-blob"
			style:left="{blob.x}%"
			style:top="{blob.y}%"
			style:width="{blob.size}%"
			style:height="{blob.size}%"
			style:background-color={blob.color}
			style:filter="blur({blob.blur}px)"
		></div>
	{/each}
</div>

<style>
	@layer svelte-ui {
		.mesh-gradient {
			position: relative;
			overflow: hidden;
		}

		.mesh-gradient-blob {
			position: absolute;
			border-radius: 50%;
			transform: translate(-50%, -50%);
		}

		.mesh-gradient--grain::after {
			content: '';
			position: absolute;
			inset: 0;
			background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
			background-size: 160px 160px;
			opacity: 0.55;
			mix-blend-mode: overlay;
			pointer-events: none;
		}

		@media (forced-colors: active) {
			.mesh-gradient {
				forced-color-adjust: none;
			}
		}
	}
</style>
