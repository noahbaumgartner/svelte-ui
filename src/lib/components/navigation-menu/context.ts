import { createContext } from 'svelte';

export type NavigationMenuContext = {
	/** Vertical menus expand submenus in place instead of opening a panel. */
	readonly vertical: boolean;
	/** Id of the item whose panel is open, or null. */
	readonly current: string | null;
	/** Opens an item's panel, after a short delay unless another one is already open. */
	open: (id: string, immediate?: boolean) => void;
	/** Closes the open panel after a short delay, e.g. when the pointer leaves it. */
	leave: () => void;
	/** Cancels a pending open or close. */
	stay: () => void;
	/** Closes the open panel right away. */
	close: () => void;
};

export const [getNavigationMenuContext, setNavigationMenuContext] =
	createContext<NavigationMenuContext>();
