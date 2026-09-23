import { createContext } from 'svelte';

export type ContextMenuTriggerProps = {
	onclick: () => void;
	onkeydown: (event: KeyboardEvent) => void;
	'aria-haspopup': 'menu';
	'aria-expanded': boolean;
	'aria-controls': string;
};

export const [getMenuContext, setMenuContext] = createContext<{ close: () => void }>();
