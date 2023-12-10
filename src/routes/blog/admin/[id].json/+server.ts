import { api } from '../../api';
import type { RequestHandler } from '@sveltejs/kit';
import type { Locals } from '$lib/types';
import { gql } from 'graphql-request'

// get /blog/:id.json
export const GET: RequestHandler<Locals> = async (request) => {
	let response = await api(request, gql`
	query($id: ID!)  {
		getPost(id:$id) {
			title,
			description,
			image,
			body,
			status,
			createdDate
	  }
	}`, { id: request.params.id })

	return new Response(JSON.stringify(response.getPost), { headers: { "cache-control": "no-cache" } });
};

// POST /blog/admin/:id.json
export const PUT: RequestHandler<Locals> = async (request) => {
	let body = await request.request.json();
	let response = await api(request, gql`
	mutation($id: ID!, $title: String!, $body: String!, $image: String!, $description: String!, $status:Status!)  {
		updatePost(input:{
			id: $id,
  			title: $title,
    		body: $body,
    		status: $status,
    		image: $image,
    		description: $description
		}) {
			id
	  }
	}`, { id: request.params.id, title: body.title, body: body.body, image: body.image, description: body.description, status: body.status }, true)

	return new Response(JSON.stringify(response.updatePost), { headers: { "cache-control": "no-cache" } });
};

// DELETE /blog/admin/:id.json
export const DELETE: RequestHandler<Locals> = async (request) => {
	const response = await api(request, gql`
	mutation($id: ID!)  {
		removePost(id:$id) {
			id
	  }
	}`, { id: request.params.id }, true)

	return new Response(JSON.stringify(response.removePost), { headers: { "cache-control": "no-cache" } });
};
