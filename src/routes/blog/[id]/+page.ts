import { error } from '@sveltejs/kit';

export const load = async ({ fetch, params, setHeaders }) => {
	const res = await fetch(`/blog/${params.id}.json`, { credentials: 'omit' });

	if (res.ok) {
		const post = await res.json();
		setHeaders({
			'cache-control': 'public, max-age=86400'
		})
		return {
			post,
		};
	}

	const { message } = await res.json();

	throw error(500, message);
};
