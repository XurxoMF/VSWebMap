<script>
	import { texts } from '$lib/config';
</script>

<!-- Wite your HTML here, this will replace the <slot /> tag on the +layout.svelte file. -->
<!-- This will be surrounded by the header/nav and the footer. -->

<!-- If you like how the page looks, you can just change the sentences on the config file located in src/lib/config.ts! -->

<div
	class="w-full max-w-7xl mx-auto py-4 pb-12 px-12 flex flex-col content-center justify-center gap-4 text-center"
>
	<h1 class="text-4xl font-bold my-12">{@html texts.WellcomeHTML}</h1>
	<p class="text-lg">{@html texts.DescriptionHTML}</p>
	<br />

	<h2 class="font-bold text-2xl">{@html texts.TitleServerFeaturesHTML}</h2>
	<div class="py-1">
		<ul class="flex flex-col gap-1">
			{#each texts.ListServerFeaturesHTML as serverFeature}
				<li>{@html serverFeature}</li>
			{/each}
		</ul>
	</div>
	<br />
	<h2 class="font-bold text-2xl">{@html texts.TitleWorldFeaturesHTML}</h2>
	<div class="py-1">
		<ul class="flex flex-col gap-1">
			{#each texts.ListWorldFeaturesHTML as worldFeature}
				<li>{@html worldFeature}</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	/* Write your CSS styles here or use Tailwind CSS on each HTML class="" component */
</style>
