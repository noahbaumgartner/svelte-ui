<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import Icon from './Icon.svelte';

	let props: SVGAttributes<SVGSVGElement> = $props();
</script>

<Icon
	{...props}
	nodes={[
		['path', { d: 'M18 6 6 18' }],
		['path', { d: 'm6 6 12 12' }]
	]}
/>
