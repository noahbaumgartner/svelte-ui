<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import Icon from './Icon.svelte';

	let props: SVGAttributes<SVGSVGElement> = $props();
</script>

<Icon
	{...props}
	nodes={[
		['circle', { cx: '12', cy: '12', r: '10' }],
		['path', { d: 'M12 6v6l4 2' }]
	]}
/>
