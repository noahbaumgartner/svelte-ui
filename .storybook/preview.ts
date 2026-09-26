import type { Preview } from '@storybook/sveltekit';
import '../src/lib/styles/tokens.css';
import './preview.css';

const preview: Preview = {
	globalTypes: {
		theme: {
			description: 'Color theme',
			toolbar: {
				title: 'Theme',
				icon: 'mirror',
				items: [
					{ value: 'system', title: 'System', icon: 'browser' },
					{ value: 'light', title: 'Light', icon: 'sun' },
					{ value: 'dark', title: 'Dark', icon: 'moon' }
				],
				dynamicTitle: true
			}
		},
		accent: {
			description: 'Accent color',
			toolbar: {
				title: 'Accent',
				icon: 'paintbrush',
				items: [
					{ value: 'ink', title: 'Ink (default)' },
					{ value: '#ad5f45', title: 'Terracotta' },
					{ value: '#977534', title: 'Ochre' },
					{ value: '#6a7746', title: 'Moss' },
					{ value: '#5f7b65', title: 'Sage' },
					{ value: '#5a7885', title: 'Slate' }
				],
				dynamicTitle: true
			}
		}
	},
	initialGlobals: {
		theme: 'system',
		accent: 'ink'
	},
	decorators: [
		(story, { globals }) => {
			const root = document.documentElement;
			if (globals.theme === 'light' || globals.theme === 'dark') {
				root.dataset.theme = globals.theme;
			} else {
				delete root.dataset.theme;
			}
			if (globals.accent && globals.accent !== 'ink') {
				root.style.setProperty('--accent', globals.accent);
			} else {
				root.style.removeProperty('--accent');
			}
			return story();
		}
	],
	parameters: {
		options: {
			storySort: (a, b) => (a.title === b.title ? 0 : a.title.localeCompare(b.title))
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},

		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: 'todo'
		}
	}
};

export default preview;
