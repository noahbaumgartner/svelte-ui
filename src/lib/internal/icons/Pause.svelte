<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import Icon from './Icon.svelte';

	let props: SVGAttributes<SVGSVGElement> = $props();
</script>

<Icon
	{...props}
	nodes={[
		['rect', { x: 14, y: 3, width: 5, height: 18, rx: 1 }],
		['rect', { x: 5, y: 3, width: 5, height: 18, rx: 1 }]
	]}
/>
