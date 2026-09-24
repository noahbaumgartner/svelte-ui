<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Input from '../input/Input.svelte';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'onselect'> & {
		/** Bindable, `#rrggbb` like `<input type="color">`. */
		value?: string;
		/** Called on every change while dragging or typing. */
		onselect?: (value: string) => void;
	};

	let { value = $bindable('#000000'), onselect, class: className, ...rest }: Props = $props();

	type Hsv = { h: number; s: number; v: number };

	function hexToHsv(hex: string): Hsv {
		const n = parseInt(hex.slice(1), 16);
		const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => c / 255);
		const max = Math.max(r, g, b);
		const d = max - Math.min(r, g, b);
		let h = 0;
		if (d) {
			if (max === r) h = ((g - b) / d) % 6;
			else if (max === g) h = (b - r) / d + 2;
			else h = (r - g) / d + 4;
		}
		return { h: (h * 60 + 360) % 360, s: max ? d / max : 0, v: max };
	}

	function hsvToHex({ h, s, v }: Hsv) {
		const f = (n: number) => {
			const k = (n + h / 60) % 6;
			return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255);
		};
		return '#' + [f(5), f(3), f(1)].map((c) => c.toString(16).padStart(2, '0')).join('');
	}

	const isHex = (text: string) => /^#[0-9a-f]{6}$/i.test(text);

	/* Kept separately so hue survives when saturation or brightness hit 0 */
	let hsv = $state(hexToHsv(isHex(value) ? value : '#000000'));
	let emitted = value;
	let hexText = $state(value);

	$effect.pre(() => {
		if (value !== emitted && isHex(value)) {
			hsv = hexToHsv(value);
			hexText = value;
			emitted = value;
		}
	});

	function emit(next: Hsv) {
		hsv = next;
		value = emitted = hsvToHex(next);
		hexText = value;
		onselect?.(value);
	}

	const clamp = (n: number) => Math.min(1, Math.max(0, n));

	function drag(event: PointerEvent, update: (x: number, y: number) => void) {
		const el = event.currentTarget as HTMLElement;
		el.setPointerCapture(event.pointerId);
		el.focus();
		const move = (e: PointerEvent) => {
			const rect = el.getBoundingClientRect();
			update(
				clamp((e.clientX - rect.left) / rect.width),
				clamp((e.clientY - rect.top) / rect.height)
			);
		};
		move(event);
		el.onpointermove = move;
		el.onpointerup = () => (el.onpointermove = el.onpointerup = null);
	}

	function areaKeydown(event: KeyboardEvent) {
		const delta = event.shiftKey ? 0.1 : 0.01;
		const change = {
			ArrowLeft: { s: -delta, v: 0 },
			ArrowRight: { s: delta, v: 0 },
			ArrowUp: { s: 0, v: delta },
			ArrowDown: { s: 0, v: -delta }
		}[event.key];
		if (!change) return;
		event.preventDefault();
		emit({ h: hsv.h, s: clamp(hsv.s + change.s), v: clamp(hsv.v + change.v) });
	}

	function hueKeydown(event: KeyboardEvent) {
		const delta = event.shiftKey ? 10 : 1;
		const change = { ArrowLeft: -delta, ArrowDown: -delta, ArrowRight: delta, ArrowUp: delta }[
			event.key
		];
		if (change === undefined) return;
		event.preventDefault();
		emit({ ...hsv, h: Math.min(360, Math.max(0, hsv.h + change)) });
	}

	function hexInput(event: Event) {
		const text = (event.currentTarget as HTMLInputElement).value.trim();
		const hex = text.startsWith('#') ? text : `#${text}`;
		if (isHex(hex)) emit(hexToHsv(hex.toLowerCase()));
	}
</script>

<div {...rest} class={['color-picker', className]}>
	<div
		class="color-picker-area"
		role="slider"
		tabindex="0"
		aria-label="Saturation and brightness"
		aria-valuenow={Math.round(hsv.s * 100)}
		aria-valuetext="Saturation {Math.round(hsv.s * 100)}%, brightness {Math.round(hsv.v * 100)}%"
		style:--hue={hsv.h}
		onpointerdown={(event) => drag(event, (x, y) => emit({ h: hsv.h, s: x, v: 1 - y }))}
		onkeydown={areaKeydown}
	>
		<span
			class="color-picker-thumb"
			style:left="{hsv.s * 100}%"
			style:top="{(1 - hsv.v) * 100}%"
			style:background-color={value}
		></span>
	</div>

	<div
		class="color-picker-hue"
		role="slider"
		tabindex="0"
		aria-label="Hue"
		aria-valuemin={0}
		aria-valuemax={360}
		aria-valuenow={Math.round(hsv.h)}
		onpointerdown={(event) => drag(event, (x) => emit({ ...hsv, h: x * 360 }))}
		onkeydown={hueKeydown}
	>
		<span
			class="color-picker-thumb"
			style:left="{(hsv.h / 360) * 100}%"
			style:background-color="hsl({hsv.h} 100% 50%)"
		></span>
	</div>

	<div class="color-picker-footer">
		<span class="color-picker-swatch" style:background-color={value}></span>
		<Input value={hexText} aria-label="Hex color" spellcheck="false" oninput={hexInput} />
	</div>
</div>

<style>
	.color-picker {
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 224px;
		user-select: none;
	}

	.color-picker-area {
		position: relative;
		height: 150px;
		border-radius: 8px;
		background:
			linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent),
			hsl(var(--hue) 100% 50%);
		outline: none;
		cursor: crosshair;
		touch-action: none;
	}

	.color-picker-hue {
		position: relative;
		height: 12px;
		margin: 0 6px;
		border-radius: 999px;
		background: linear-gradient(
			to right,
			#f00 0%,
			#ff0 17%,
			#0f0 33%,
			#0ff 50%,
			#00f 67%,
			#f0f 83%,
			#f00 100%
		);
		outline: none;
		cursor: pointer;
		touch-action: none;
	}

	/* Let the hue thumb reach both ends of the rounded track */
	.color-picker-hue::before {
		content: '';
		position: absolute;
		inset: 0 -6px;
	}

	.color-picker-thumb {
		position: absolute;
		top: 50%;
		width: 14px;
		height: 14px;
		box-sizing: border-box;
		border: 2px solid #fff;
		border-radius: 999px;
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
		transform: translate(-50%, -50%);
		pointer-events: none;
	}

	.color-picker-area:focus-visible .color-picker-thumb,
	.color-picker-hue:focus-visible .color-picker-thumb {
		outline: 2px solid var(--color-ink);
		outline-offset: 2px;
	}

	.color-picker-footer {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.color-picker-swatch {
		flex-shrink: 0;
		width: 32px;
		height: 32px;
		box-sizing: border-box;
		border: 1px solid var(--color-border);
		border-radius: 10px;
	}
</style>
