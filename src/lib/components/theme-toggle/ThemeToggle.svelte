<script lang="ts">
	import { onMount } from 'svelte';
	import Sun from '../../internal/icons/Sun.svelte';
	import Moon from '../../internal/icons/Moon.svelte';
	import Button from '../button/Button.svelte';

	type Theme = 'light' | 'dark';

	/** Accessible name of the button for each current theme; the click switches to the other one. */
	let {
		labels = { light: 'Theme: Light', dark: 'Theme: Dark' }
	}: { labels?: Record<Theme, string> } = $props();

	let theme: Theme = $state('light');

	const icons = { light: Sun, dark: Moon };

	onMount(() => {
		const query = window.matchMedia('(prefers-color-scheme: dark)');
		const systemTheme = (): Theme => (query.matches ? 'dark' : 'light');

		const stored = localStorage.getItem('theme');
		theme = stored === 'light' || stored === 'dark' ? stored : systemTheme();

		// Without an explicit choice the toggle keeps following the system.
		const onSystemChange = () => {
			if (!localStorage.getItem('theme')) theme = systemTheme();
		};
		query.addEventListener('change', onSystemChange);
		return () => query.removeEventListener('change', onSystemChange);
	});

	function toggle() {
		theme = theme === 'light' ? 'dark' : 'light';
		document.documentElement.dataset.theme = theme;
		localStorage.setItem('theme', theme);
	}
</script>

<Button variant="ghost" size="lg" icon={icons[theme]} label={labels[theme]} onclick={toggle} />
