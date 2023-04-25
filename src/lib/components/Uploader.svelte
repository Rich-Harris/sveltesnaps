<script>
	import { enhance } from '$app/forms';
</script>

<form method="POST" action="/?/post" use:enhance>
	<input type="file" name="photo" accept=".jpg,.jpeg,.png" />
	<textarea name="description" required />
	<button>upload</button>
</form>
