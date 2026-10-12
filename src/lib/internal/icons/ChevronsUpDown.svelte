<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import Icon from './Icon.svelte';

	let props: SVGAttributes<SVGSVGElement> = $props();
</script>

<Icon
	{...props}
	nodes={[
		['path', { d: 'm7 15 5 5 5-5' }],
		['path', { d: 'm7 9 5-5 5 5' }]
	]}
/>
