<script>
	import { enhance } from '$app/forms';
</script>

<form class="inline" method="POST" action="/auth?/login" use:enhance>
	<button class="text-pink-600"><slot>log in</slot></button>
</form>
