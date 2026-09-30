import { createContext } from 'svelte';

export type AccordionContext = {
	/** Shared `name` of the items' <details>, so the browser keeps only one open. Undefined with `multiple`. */
	readonly name: string | undefined;
};

export const [getAccordionContext, setAccordionContext] = createContext<AccordionContext>();
