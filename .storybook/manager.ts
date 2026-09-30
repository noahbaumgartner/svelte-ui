import { addons } from 'storybook/manager-api';
import { dark, light } from './theme';

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

addons.setConfig({
	theme: prefersDark ? dark : light
});
