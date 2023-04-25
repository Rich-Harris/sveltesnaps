<script lang="ts">
	export let data;
</script>

<h1>{data.account.name}</h1>

{#each data.photos as photo}
	<a href="/{data.account.name}/{photo.id}">
		<figure>
			<img src={photo.url} alt={photo.description} />
			<figcaption>{photo.description}</figcaption>
		</figure>
	</a>
{/each}
