<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import Footer from './Footer.svelte';
	import FooterColumn from './FooterColumn.svelte';
	import Link from '../link/Link.svelte';

	const { Story } = defineMeta({
		title: 'Components/Footer',
		component: Footer,
		tags: ['autodocs'],
		argTypes: {
			title: { control: 'text' },
			copyright: { control: 'text' }
		},
		args: {
			title: 'Thanks for\nstopping by.',
			copyright: 'Noah Baumgartner'
		}
	});
</script>

{#snippet columns()}
	<FooterColumn heading="More">
		<Link href="/imprint">Imprint</Link>
	</FooterColumn>
	<FooterColumn heading="Social Media">
		<Link href="https://www.instagram.com/">Instagram</Link>
		<Link href="https://www.linkedin.com/">LinkedIn</Link>
	</FooterColumn>
{/snippet}

<Story name="Default" tags={['!dev']}>
	{#snippet template(args)}
		<Footer {...args}>{@render columns()}</Footer>
	{/snippet}
</Story>

<Story name="Content" parameters={{ controls: { exclude: ['title', 'copyright'] } }}>
	{#snippet template(args)}
		<div style="display: flex; flex-direction: column; gap: 32px;">
			<Footer {...args}>{@render columns()}</Footer>
			<Footer {...args} title={undefined}>{@render columns()}</Footer>
			<Footer {...args} copyright={undefined} />
		</div>
	{/snippet}
</Story>

<Story
	name="Test: shows copyright with the current year"
	tags={['!dev', '!autodocs']}
	play={async ({ canvas }) => {
		const year = new Date().getFullYear();
		await expect(canvas.getByText(`© ${year} Noah Baumgartner`)).toBeInTheDocument();
		await expect(canvas.getByRole('contentinfo')).toBeInTheDocument();
		await expect(canvas.getByRole('heading', { level: 2 })).toBeInTheDocument();
	}}
>
	{#snippet template(args)}
		<Footer {...args}>{@render columns()}</Footer>
	{/snippet}
</Story>
