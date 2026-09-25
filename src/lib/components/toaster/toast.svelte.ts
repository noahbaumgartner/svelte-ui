import type { LucideIcon } from '@lucide/svelte';

export type ToastAction = {
	label: string;
	onclick: () => void;
};

export type ToastOptions = {
	/** Updates the toast with this id instead of adding a new one. */
	id?: number;
	/** Any Lucide icon (import from `svelte-ui/icons`), shown on the left. */
	icon?: LucideIcon;
	/** Shows a Spinner instead of the icon and keeps the toast open until it is updated. */
	loading?: boolean;
	/** Button on the right; clicking it runs `onclick` and dismisses the toast. */
	action?: ToastAction;
	/** Milliseconds until the toast closes. `Infinity` keeps it open. Default 3000.
	 * Clicking the toast always closes it. */
	duration?: number;
};

export type ToastData = Omit<ToastOptions, 'id'> & {
	id: number;
	message: string;
};

let nextId = 1;

export const toasts: ToastData[] = $state([]);

/** Shows a toast in the `Toaster`, replacing the current one, and returns its id. */
export function toast(message: string, options: ToastOptions = {}): number {
	const { id = nextId++, ...rest } = options;
	const data = { id, message, ...rest };
	const index = toasts.findIndex((t) => t.id === id);
	// Only the newest toast is shown, so a new one replaces the current one.
	if (index === -1) toasts.splice(0, toasts.length, data);
	else toasts[index] = data;
	return id;
}

/** Closes the toast with this id, or all toasts when called without one. */
toast.dismiss = (id?: number) => {
	if (id === undefined) toasts.length = 0;
	const index = toasts.findIndex((t) => t.id === id);
	if (index !== -1) toasts.splice(index, 1);
};
