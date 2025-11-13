<script lang="ts">
	import { page } from '$app/stores';
	import { marked } from 'marked';
	import type { Post } from '$lib/db';

	let post = $state<Post | null>(null);
	let loading = $state(true);
	let error = $state('');
	let renderedContent = $state('');

	async function loadPost() {
		const slug = $page.params.slug;
		try {
			const response = await fetch(`/api/posts/${slug}`);
			if (response.ok) {
				post = await response.json();
				renderedContent = marked(post.content);
			} else if (response.status === 404) {
				error = 'Post not found';
			} else {
				error = 'Failed to load post';
			}
		} catch (err) {
			error = 'Network error';
		} finally {
			loading = false;
		}
	}

	// Load post on mount
	loadPost();
</script>

<svelte:head>
	<title>{post ? post.title : 'Loading...'} - My Blog</title>
</svelte:head>

<div class="container">
	{#if loading}
		<p>Loading post...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else if post}
		<article class="post">
			<header>
				<h1>{post.title}</h1>
				<p class="date">{new Date(post.date).toLocaleDateString()}</p>
			</header>
			<div class="content">
				{@html renderedContent}
			</div>
		</article>
		<a href="/" class="back-link">← Back to all posts</a>
	{:else}
		<p>Post not found.</p>
	{/if}
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

	.post {
		background-color: #333;
		border-radius: 8px;
		padding: 1rem;
		margin-bottom: 2rem;
	}

	.post header {
		margin-bottom: 2rem;
		text-align: center;
	}

	.post h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		line-height: 1.2;
	}

	.date {
		color: var(--muted-text);
		font-size: 1rem;
	}

	.content {
		line-height: 1.8;
	}

	.content h1,
	.content h2,
	.content h3,
	.content h4,
	.content h5,
	.content h6 {
		margin-top: 2rem;
		margin-bottom: 1rem;
		font-weight: 600;
		line-height: 1.3;
	}

	.content h1 { font-size: 2rem; }
	.content h2 { font-size: 1.75rem; }
	.content h3 { font-size: 1.5rem; }
	.content h4 { font-size: 1.25rem; }
	.content h5 { font-size: 1.1rem; }
	.content h6 { font-size: 1rem; }

	.content p {
		margin-bottom: 1rem;
	}

	.content ul,
	.content ol {
		margin-bottom: 1rem;
		padding-left: 2rem;
	}

	.content li {
		margin-bottom: 0.5rem;
	}

	.content blockquote {
		border-left: 4px solid var(--border-color);
		padding-left: 1rem;
		margin: 1.5rem 0;
		color: var(--muted-text);
		font-style: italic;
	}

	.content code {
		background-color: var(--code-bg);
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.9em;
	}

	.content pre {
		background-color: var(--code-bg);
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		margin: 1.5rem 0;
	}

	.content pre code {
		background-color: transparent;
		padding: 0;
	}

	.content a {
		color: var(--text-color);
		text-decoration: underline;
	}

	.content a:hover {
		color: var(--hover-color);
	}

	.back-link {
		display: inline-block;
		margin-top: 2rem;
		color: var(--text-color);
		text-decoration: none;
		font-weight: 500;
	}

	.back-link:hover {
		color: var(--hover-color);
	}

	.error {
		color: #2cd0d0;
		text-align: center;
	}
</style>
