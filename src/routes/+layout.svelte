<script lang="ts">
	import '../app.css';
	import { pages, texts } from '$lib/config';
	import { BurguerMenuSVG } from '$lib/components/svg/index';
	import { onMount } from 'svelte';

	let opened = false;

	function menuButtonclick(): void {
		opened = !opened;
	}
</script>

<header class="sticky top-0 z-10 shadow-lg shadow-zinc-900">
	<nav class="h-12 bg-zinc-900 flex justify-between md:px-20 px-2">
		<div class="my-auto flex">
			<a href="/" class="font-pn px-2 py-1 text-xl rounded hover:bg-zinc-800 transition-all"
				>{texts.Nav}</a
			>
		</div>
		<div class="my-auto hidden gap-4 md:flex">
			{#each pages as page}
				<a
					on:click={() => (opened = false)}
					href={page.route}
					class="text-xl px-2 py-1 rounded hover:bg-zinc-800 transition-all">{page.name}</a
				>
			{/each}
		</div>
		<div class="my-auto flex gap-4 md:hidden">
			<button on:click={menuButtonclick} class="p-2 rounded hover:bg-zinc-800"
				><BurguerMenuSVG classe="w-5 h-5 text-zinc-200" /></button
			>
		</div>
	</nav>

	<!-- This will only be shown if the menu button is pressed -->
	{#if opened}
		<div class="flex w-full -z-10 bg-zinc-900 flex-col gap-2 p-2 shadow-lg shadow-zinc-900">
			{#each pages as page}
				<a
					on:click={() => (opened = false)}
					href={page.route}
					class="text-xl w-full text-center mx-auto px-2 py-1 rounded hover:bg-zinc-800 transition-all"
					>{page.name}</a
				>
			{/each}
		</div>
	{/if}
</header>

<main class="relative min-h-[calc(100vh-6rem)]">
	<slot />
</main>

<footer class="relative h-12 bg-zinc-900 flex justify-center">
	<div class="my-auto">{texts.Footer}</div>
</footer>
