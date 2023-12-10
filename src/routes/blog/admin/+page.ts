import type { Load, error } from '@sveltejs/kit';

export const load: Load = async ({ fetch, setHeaders }) => {
	const res = await fetch('/blog/admin.json');

	if (res.ok) {
		const posts = await res.json();
		setHeaders({
			'cache-control': 'public, max-age=1'
		})
		return {
			posts
		};
	} else {
		throw error(500, 'blog-post-error')
	}
};
