import type { RequestHandler } from '@sveltejs/kit';
import type { Locals } from '$lib/types';
import { gql } from 'graphql-request'
import { api } from '../blog/api';

// GET /blog.json
export const GET: RequestHandler<Locals> = async (request) => {
	// request.locals.userid comes from src/hooks.js
	const response = await api(request, gql`
	query  {
		listPublishedPosts {
			id,
			title,
			description,
			image,
			createdDate
	  }
	}`)
	return new Response(JSON.stringify(response.listPublishedPosts), { headers: { "cache-control": "max-age=86400" } });
};
