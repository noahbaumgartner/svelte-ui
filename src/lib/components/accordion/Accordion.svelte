<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { setAccordionContext } from './context.js';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** Lets several items be open at once. By default opening one closes the others. */
		multiple?: boolean;
		/** AccordionItems. */
		children: Snippet;
	};

	let { multiple = false, class: className, children, ...rest }: Props = $props();

	const name = $props.id();

	setAccordionContext({
		get name() {
			return multiple ? undefined : name;
		}
	});
</script>

<div {...rest} class={['accordion', className]}>
	{@render children()}
</div>

<style>
	.accordion {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
</style>
