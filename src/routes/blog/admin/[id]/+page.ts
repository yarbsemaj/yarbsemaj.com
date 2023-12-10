import type { PageLoad, error } from '@sveltejs/kit';

export const load: PageLoad = async ({ fetch, params, setHeaders }) => {
	let id = params.id;
	let post = {};
	if (id !== 'new') {
		const res = await fetch(`/blog/admin/${id}.json`);
		if (res.ok) {
			post = await res.json();
		} else {
			throw error(500, 'blog-post-error')
		}
	} else {
		post = {
			title: '',
			description: '',
			body: '',
			image: `https://picsum.photos/1000/500`
		};
	}

	setHeaders({
		'cache-control': 'public, max-age=1'
	})
	return {
		post
	};
};
