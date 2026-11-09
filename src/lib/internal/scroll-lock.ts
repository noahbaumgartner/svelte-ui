/**
 * Modal dialogs lock page scrolling with `overflow: hidden` on `html`. That removes the page
 * scrollbar, so the content would shift right by its width. Instead of keeping an empty scrollbar
 * track (`scrollbar-gutter: stable`), the width is measured before the lock and reserved as
 * padding through `--svelte-ui-scrollbar-width`. Overlay scrollbars and short pages measure 0.
 *
 * Call it right before `showModal()`.
 */
export function measurePageScrollbar() {
	const html = document.documentElement;
	// Another dialog already locked the page: its measurement is the one that counts.
	if (html.querySelector('dialog[open]')) return;
	html.style.setProperty(
		'--svelte-ui-scrollbar-width',
		`${Math.max(0, window.innerWidth - html.clientWidth)}px`
	);
}
