import { createContext } from 'svelte';

export type RadioGroupContext = {
	/** Shared `name` of the radios, so the browser handles arrow keys and single selection. */
	readonly name: string;
	readonly value: string | undefined;
	readonly disabled: boolean;
	readonly required: boolean;
	select: (value: string) => void;
};

export const [getRadioGroupContext, setRadioGroupContext] = createContext<RadioGroupContext>();
