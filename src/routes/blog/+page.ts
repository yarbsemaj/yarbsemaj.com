import { error } from '@sveltejs/kit';

export const load = async ({ fetch, setHeaders }) => {
	const res = await fetch('/blog.json', { credentials: 'omit' });

	if (res.ok) {
		const posts = await res.json();

		setHeaders({
			'cache-control': 'public, max-age=86400'
		})
		return {
			posts
		};
	}

	throw error(500, 'blog-post-error')
};
