import { create } from 'storybook/theming/create';

const brandTitle =
	'<span style="font-family:Outfit,system-ui,sans-serif;font-weight:700;font-size:17px;letter-spacing:-0.02em">noahbaumgartner</span>';

const shared = {
	base: 'light' as const,
	brandTitle,
	brandUrl: 'https://noahbaumgartner.ch',
	brandTarget: '_blank',
	fontBase: 'Inter, system-ui, sans-serif',
	fontCode: 'ui-monospace, SFMono-Regular, Menlo, monospace',
	appBorderRadius: 8,
	inputBorderRadius: 8
};

// Values mirror src/lib/styles/tokens.css (ink/base mixed at fixed percentages)
export const light = create({
	...shared,
	base: 'light',
	colorPrimary: '#000000',
	colorSecondary: '#000000',
	appBg: '#f0f0f0',
	appContentBg: '#ffffff',
	appPreviewBg: '#ffffff',
	appBorderColor: '#e6e6e6',
	barBg: '#ffffff',
	barTextColor: '#737373',
	barSelectedColor: '#000000',
	barHoverColor: '#000000',
	textColor: '#000000',
	textMutedColor: '#737373',
	textInverseColor: '#ffffff',
	inputBg: '#ffffff',
	inputBorder: '#d4d4d4',
	inputTextColor: '#000000'
});

export const dark = create({
	...shared,
	base: 'dark',
	colorPrimary: '#ffffff',
	colorSecondary: '#525252',
	appBg: '#191919',
	appContentBg: '#0a0a0a',
	appPreviewBg: '#0a0a0a',
	appBorderColor: '#222222',
	barBg: '#0a0a0a',
	barTextColor: '#919191',
	barSelectedColor: '#ffffff',
	barHoverColor: '#ffffff',
	textColor: '#ffffff',
	textMutedColor: '#919191',
	textInverseColor: '#0a0a0a',
	inputBg: '#0a0a0a',
	inputBorder: '#333333',
	inputTextColor: '#ffffff'
});
