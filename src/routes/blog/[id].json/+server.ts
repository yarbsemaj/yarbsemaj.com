import { api } from '../api';
import type { RequestHandler } from '@sveltejs/kit';
import type { Locals } from '$lib/types';
import { gql } from 'graphql-request'

// get /blog/:id.json
export const GET: RequestHandler<Locals> = async (request) => {
	const response = await api(request, gql`
	query($id: ID!)  {
		getPost(id:$id) {
			title,
			description,
			image,
			body,
			createdDate
	  }
	}`, { id: request.params.id })

	return new Response(JSON.stringify(response.getPost), { headers: { "cache-control": "max-age=86400" } })
};
