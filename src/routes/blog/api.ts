import type { RequestEvent } from '@sveltejs/kit';
import { GraphQLClient } from 'graphql-request'
import type {RequestDocument} from 'graphql-request'
import { env } from '$env/dynamic/private'

const base = env.BLOG_BASE_URL;
const apiKey = env.BLOG_API_KEY

export async function api(request: RequestEvent, data: RequestDocument, variables? : object, admin = false) {

	const client = new GraphQLClient(base)

	if(admin){
		let token = request.cookies.get('userid');
		client.setHeader('authorization', token)
	}else{
		client.setHeader('x-api-key', apiKey)
	}

	return await client.request(data, variables)
}