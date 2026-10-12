<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import Icon from './Icon.svelte';

	let props: SVGAttributes<SVGSVGElement> = $props();
</script>

<Icon
	{...props}
	nodes={[
		['path', { d: 'M5 12h14' }],
		['path', { d: 'M12 5v14' }]
	]}
/>
