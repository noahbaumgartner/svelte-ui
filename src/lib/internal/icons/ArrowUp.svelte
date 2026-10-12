<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import Icon from './Icon.svelte';

	let props: SVGAttributes<SVGSVGElement> = $props();
</script>

<Icon
	{...props}
	nodes={[
		['path', { d: 'm5 12 7-7 7 7' }],
		['path', { d: 'M12 19V5' }]
	]}
/>
