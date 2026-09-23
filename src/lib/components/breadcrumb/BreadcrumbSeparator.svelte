<script lang="ts">
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
</script>

<li role="presentation" aria-hidden="true" class="breadcrumb-separator">
	<ChevronRight />
</li>

<style>
	.breadcrumb-separator {
		display: flex;
	}

	.breadcrumb-separator :global(svg) {
		width: 14px;
		height: 14px;
	}
</style>
