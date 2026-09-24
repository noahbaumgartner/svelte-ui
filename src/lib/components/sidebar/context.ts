import { createContext } from 'svelte';

export type SidebarContext = {
	/** Id of the sidebar element. */
	readonly id: string;
	/** Whether the sidebar is expanded on desktop. */
	readonly open: boolean;
	/** Below 768px the sidebar turns into a drawer. */
	readonly mobile: boolean;
	/** Whether the drawer is shown on mobile. */
	readonly openMobile: boolean;
	/** Collapses or expands the sidebar, or opens or closes the drawer on mobile. */
	toggle: () => void;
	/** Closes the drawer on mobile, e.g. after navigating. */
	closeMobile: () => void;
};

export const [getSidebarContext, setSidebarContext] = createContext<SidebarContext>();
