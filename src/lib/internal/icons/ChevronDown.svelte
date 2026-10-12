<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import Icon from './Icon.svelte';

	let props: SVGAttributes<SVGSVGElement> = $props();
</script>

<Icon {...props} nodes={[['path', { d: 'm6 9 6 6 6-6' }]]} />
