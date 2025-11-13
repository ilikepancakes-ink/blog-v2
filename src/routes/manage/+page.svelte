<script lang="ts">
	import { goto } from '$app/navigation';

	let username = $state('');
	let password = $state('');
	let isSubmitting = $state(false);
	let message = $state('');

	const login = async () => {
		if (!username || !password) {
			message = 'Username and password are required';
			return;
		}

		isSubmitting = true;
		message = '';

		try {
			// Validate credentials
			const headers = new Headers();
			headers.set('Authorization', 'Basic ' + btoa(`${username}:${password}`));

			const response = await fetch('/api/auth/validate', {
				method: 'GET',
				headers: headers
			});

			if (response.ok) {
				// Store auth token
				const token = btoa(`${username}:${password}`);
				sessionStorage.setItem('auth_token', token);
				localStorage.setItem('auth_user', username);

				// Redirect to dashboard
				goto('/manage/dashboard');
			} else {
				message = 'Invalid credentials';
			}
		} catch (error) {
			message = 'Network error occurred';
		} finally {
			isSubmitting = false;
		}
	};
</script>

<svelte:head>
	<title>Admin Login - Blog</title>
</svelte:head>

<div class="container">
	<h1>Admin Login</h1>

	<form onsubmit={login}>
		<div class="form-group">
			<label for="username">Username</label>
			<input
				type="text"
				id="username"
				bind:value={username}
				required
				placeholder="Enter admin username"
				autocomplete="username"
			/>
		</div>

		<div class="form-group">
			<label for="password">Password</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				required
				placeholder="Enter admin password"
				autocomplete="current-password"
			/>
		</div>

		<button type="submit" disabled={isSubmitting}>
			{isSubmitting ? 'Logging in...' : 'Login'}
		</button>
	</form>

	{#if message}
		<p class="message error">
			{message}
		</p>
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	h1 {
		color: #333;
		margin-bottom: 2rem;
		text-align: center;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #555;
	}

	input, textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
		font-family: inherit;
	}

	textarea {
		resize: vertical;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
	}

	button {
		background-color: #333;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	button:hover:not(:disabled) {
		background-color: #555;
	}

	button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}

	.message {
		margin-top: 1rem;
		padding: 1rem;
		border-radius: 4px;
		background-color: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}

	.message.error {
		background-color: #f8d7da;
		color: #721c24;
		border-color: #f5c6cb;
	}

	small {
		display: block;
		margin-top: 0.25rem;
		color: #666;
		font-size: 0.875rem;
	}
</style>
