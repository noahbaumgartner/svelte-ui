<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import Icon from './Icon.svelte';

	let props: SVGAttributes<SVGSVGElement> = $props();
</script>

<Icon
	{...props}
	nodes={[
		['circle', { cx: '12', cy: '12', r: '1' }],
		['circle', { cx: '19', cy: '12', r: '1' }],
		['circle', { cx: '5', cy: '12', r: '1' }]
	]}
/>
