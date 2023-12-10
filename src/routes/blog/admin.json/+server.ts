
import { api } from '../api';
import type { RequestHandler } from '@sveltejs/kit';
import type { Locals } from '$lib/types';
import { gql } from 'graphql-request'

// GET /blog/admin.json
export const GET: RequestHandler<Locals> = async (request) => {
	// request.locals.userid comes from src/hooks.js
	const response = await api(request, gql`
		query  {
			listAllPosts {
				id,
				title,
				description,
				image,
				createdDate,
				status
		  }
		}`, {}, true)

	return new Response(JSON.stringify(response.listAllPosts), { headers: { "cache-control": "no-cache" } });
};

// POST /blog/admin.json
export const POST: RequestHandler<Locals> = async (request) => {
	let body = await request.request.json();
	let response = await api(request, gql`
	mutation($title: String!, $body: String!, $image: String!, $description: String!, $status:Status!)  {
		createPost(input:{
  			title: $title,
    		body: $body,
    		status: $status,
    		image: $image,
    		description: $description
		}) {
			id
	  }
	}`, { title: body.title, body: body.body, image: body.image, description: body.description, status: body.status }, true)

	return new Response(JSON.stringify(response.createPost), { headers: { "cache-control": "no-cache" } });
};

