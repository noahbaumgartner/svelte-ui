<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Label from '../label/Label.svelte';

	type Props = ComponentProps<typeof Label>;

	let { class: className, ...rest }: Props = $props();
</script>

<Label {...rest} class={['field-label', className]} />
