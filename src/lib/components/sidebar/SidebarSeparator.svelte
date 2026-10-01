<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Separator from '../separator/Separator.svelte';

	type Props = ComponentProps<typeof Separator>;

	let { ref = $bindable(null), style, ...rest }: Props = $props();
</script>

<Separator {...rest} bind:ref decorative={false} style="margin: 0 8px;{style ? ` ${style}` : ''}" />
