<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { User } from '@lucide/svelte';

	type Props = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
		src?: string;
		/** Describes the person; also the accessible name when the fallback is shown. */
		alt: string;
		/** Shown when there is no `src` or the image fails to load, e.g. initials. Defaults to a user icon. */
		fallback?: string;
		size?: 'sm' | 'md' | 'lg';
	};

	let { src, alt, fallback, size = 'md', class: className, ...rest }: Props = $props();

	let failedSrc = $state<string>();
</script>

<span {...rest} class={['avatar', `avatar--${size}`, className]}>
	{#if src && src !== failedSrc}
		<img class="avatar-image" {src} {alt} onerror={() => (failedSrc = src)} />
	{:else}
		<span class="avatar-fallback" role="img" aria-label={alt}>
			{#if fallback}
				{fallback}
			{:else}
				<User class="avatar-icon" aria-hidden="true" />
			{/if}
		</span>
	{/if}
</span>

<style>
	.avatar {
		display: inline-flex;
		flex-shrink: 0;
		overflow: hidden;
		background-color: var(--color-surface);
		color: var(--color-text-secondary);
		user-select: none;
	}

	.avatar--sm {
		width: 24px;
		height: 24px;
		border-radius: 8px;
		font-size: 10px;
	}

	.avatar--md {
		width: 32px;
		height: 32px;
		border-radius: 10px;
		font-size: 12px;
	}

	.avatar--lg {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		font-size: 14px;
	}

	.avatar-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.avatar-fallback {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		font-family: inherit;
		font-weight: 500;
		text-transform: uppercase;
	}

	.avatar-fallback :global(.avatar-icon) {
		width: 60%;
		height: 60%;
	}
</style>
