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
		}
	},
	initialGlobals: {
		theme: 'system'
	},
	decorators: [
		(story, { globals }) => {
			const root = document.documentElement;
			if (globals.theme === 'light' || globals.theme === 'dark') {
				root.dataset.theme = globals.theme;
			} else {
				delete root.dataset.theme;
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
