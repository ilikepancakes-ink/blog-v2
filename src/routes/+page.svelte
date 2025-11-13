<script lang="ts">
	import type { Post } from '$lib/db';

	let posts = $state<Post[]>([]);
	let loading = $state(true);
	let error = $state('');

	async function loadPosts() {
		try {
			const response = await fetch('/api/posts');
			if (response.ok) {
				posts = await response.json();
			} else {
				error = 'Failed to load posts';
			}
		} catch (err) {
			error = 'Network error';
		} finally {
			loading = false;
		}
	}

	// Load posts on mount
	loadPosts();
</script>

<svelte:head>
	<title>blog.ilikepancakes.ink</title>
</svelte:head>

<div class="container">
	<header>
		<h1>blog.ilikepancakes.ink</h1>
		<p>:3</p>
	</header>

	<main>
		{#if loading}
			<p>Loading posts...</p>
		{:else if error}
			<p class="error">{error}</p>
		{:else if posts.length === 0}
			<p>No posts yet.</p>
		{:else}
			<div class="posts">
				{#each posts as post}
					<article class="post">
						<h2><a href="/post/{post.slug}">{post.title}</a></h2>
						<p class="date">{new Date(post.date).toLocaleDateString()}</p>
						<p class="excerpt">{post.excerpt}</p>
						<a href="/post/{post.slug}" class="read-more">Read more</a>
					</article>
				{/each}
			</div>
		{/if}
	</main>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		line-height: 1.6;
		color: var(--text-color);
	}

	header {
		text-align: center;
		margin-bottom: 3rem;
	}

	header h1 {
		margin-bottom: 0.5rem;
		font-size: 2.5rem;
		font-weight: 700;
	}

	header p {
		color: var(--muted-text);
		font-size: 1.1rem;
	}

	.posts {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.post {
		background-color: #333;
		border-radius: 8px;
		padding: 1rem;
	}

	.post h2 {
		margin-bottom: 0.5rem;
		font-size: 1.5rem;
		font-weight: 600;
	}

	.post h2 a {
		color: var(--text-color);
		text-decoration: none;
	}

	.post h2 a:hover {
		color: var(--hover-color);
	}

	.date {
		color: var(--muted-text);
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}

	.excerpt {
		margin-bottom: 1rem;
		line-height: 1.7;
	}

	.read-more {
		color: var(--text-color);
		text-decoration: none;
		font-weight: 500;
	}

	.read-more:hover {
		color: var(--hover-color);
	}

	.error {
		color: #2cd0d0;
		text-align: center;
	}
</style>
