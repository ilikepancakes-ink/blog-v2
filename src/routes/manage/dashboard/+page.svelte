<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let title = $state('');
	let excerpt = $state('');
	let content = $state('');
	let isSubmitting = $state(false);
	let message = $state('');
	let isAuthenticated = $state(false);

	onMount(() => {
		// Check if user is authenticated
		const token = sessionStorage.getItem('auth_token');
		if (!token) {
			goto('/manage');
			return;
		}
		isAuthenticated = true;
	});

	const submitPost = async () => {
		if (!title || !excerpt || !content) {
			message = 'All fields are required';
			return;
		}

		isSubmitting = true;
		message = '';

		try {
			const token = sessionStorage.getItem('auth_token');
			if (!token) {
				goto('/manage');
				return;
			}

			const headers = new Headers();
			headers.set('Authorization', 'Basic ' + token);
			headers.set('Content-Type', 'application/json');

			const response = await fetch('/api/posts', {
				method: 'POST',
				headers: headers,
				body: JSON.stringify({
					title,
					excerpt,
					content
				})
			});

			const result = await response.json();

			if (response.ok) {
				message = 'Post created successfully!';
				title = '';
				excerpt = '';
				content = '';
			} else {
				message = result.error || 'Failed to create post';
			}
		} catch (error) {
			message = 'Network error occurred';
		} finally {
			isSubmitting = false;
		}
	};

	const logout = () => {
		sessionStorage.removeItem('auth_token');
		localStorage.removeItem('auth_user');
		goto('/manage');
	};
</script>

<svelte:head>
	<title>Manage Posts - Blog</title>
</svelte:head>

{#if isAuthenticated}
	<div class="container">
		<header class="header">
			<h1>Manage Blog Posts</h1>
			<button class="logout-btn" onclick={logout}>Logout</button>
		</header>

		<form onsubmit={submitPost}>
			<div class="form-group">
				<label for="title">Title</label>
				<input
					type="text"
					id="title"
					bind:value={title}
					required
					placeholder="Enter post title"
				/>
			</div>

			<div class="form-group">
				<label for="excerpt">Excerpt</label>
				<textarea
					id="excerpt"
					bind:value={excerpt}
					required
					rows="3"
					placeholder="Brief description of the post"
				></textarea>
			</div>

			<div class="form-group">
				<label for="content">Content (Markdown)</label>
				<textarea
					id="content"
					bind:value={content}
					required
					rows="15"
					placeholder="Write your post content in Markdown"
				></textarea>
			</div>

			<button type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Creating...' : 'Create Post'}
			</button>
		</form>

		{#if message}
			<p class="message" class:error={message.includes('error') || message.includes('Failed') || message.includes('Network')}>
				{message}
			</p>
		{/if}
	</div>
{:else}
	<div class="container">
		<p>Checking authentication...</p>
	</div>
{/if}

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	h1 {
		color: #333;
		margin: 0;
	}

	.logout-btn {
		background-color: #dc3545;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
	}

	.logout-btn:hover {
		background-color: #c82333;
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
</style>
