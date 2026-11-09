<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import Icon from './Icon.svelte';

	let props: SVGAttributes<SVGSVGElement> = $props();
</script>

<Icon
	{...props}
	nodes={[
		['circle', { cx: 9, cy: 12, r: 1 }],
		['circle', { cx: 9, cy: 5, r: 1 }],
		['circle', { cx: 9, cy: 19, r: 1 }],
		['circle', { cx: 15, cy: 12, r: 1 }],
		['circle', { cx: 15, cy: 5, r: 1 }],
		['circle', { cx: 15, cy: 19, r: 1 }]
	]}
/>
