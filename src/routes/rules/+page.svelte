<script>
	import { texts } from '$lib/config';
</script>

<!-- Wite your HTML here, this will replace the <slot /> tag on the +layout.svelte file. -->
<!-- This will be surrounded by the header/nav and the footer. -->

<!-- If you like how the page looks, you can just change the sentences on the config file located in src/lib/config.ts! -->

<div
	class="w-full max-w-7xl mx-auto py-4 pb-12 px-12 flex flex-col content-center justify-center gap-4 text-center"
>
	<h1 class="text-4xl font-bold mt-12 mb-6">{@html texts.RulesTitle}</h1>
	<p class="text-lg">{@html texts.RulesDescription}</p>

	<div class="mt-6 flex flex-col gap-8 lg:w-2/3 xl:w-1/2 m-auto">
		{#each texts.Rules as rule}
			<div class="flex flex-col gap-1">
				<h2 class="text-xl font-bold">{@html rule.title}</h2>
				<p>{@html rule.description}</p>
			</div>
		{/each}
	</div>
</div>
