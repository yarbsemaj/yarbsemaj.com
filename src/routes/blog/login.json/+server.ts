import { json as json$1 } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { Locals } from '$lib/types';
import cookie from 'cookie';
import * as AWS from 'aws-sdk/global';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import {env} from '$env/dynamic/private';



// GET /blog/login.json
export const GET: RequestHandler = async (request) => {
	return json$1({ "isLogedIn": !!request.locals.userid });
};


// POST /blog/login.json
export const POST: RequestHandler = async (request) => {
	let requestBody = (await request.request.json())

	let token = await auth(requestBody.uname, requestBody.password);

	return json$1({ "isLogedIn": true }, {
		headers: {
			'set-cookie': cookie.serialize('userid', token, {
				path: '/',
				httpOnly: true
			})
		}
	});
};

// del /blog/login.json
export const DELETE: RequestHandler = async (request) => {
	return json$1({ "isLogedIn": true }, {
		headers: {
			'set-cookie': cookie.serialize('userid', '', {
				path: '/',
				httpOnly: true,
				expires: new Date(0)
			})
		}
	});
};


function auth(uname: string, password: string): Promise<string> {
	let ClientId = env.CLIENT_ID
	let UserPoolId = env.USER_POOL_ID
	let region = 'eu-west-2'
	let authenticationData = {
		Username: uname,
		Password: password,
	};
	AWS.config.region = region;
	let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
	let poolData = {
		UserPoolId,
		ClientId
	};
	let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	let userData = {
		Username: uname,
		Pool: userPool,
	};
	let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	return new Promise((resolve, reject) => {
		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: function (result) {
				let accessToken = result.getAccessToken().getJwtToken();
				return resolve(accessToken);
			},

			onFailure: function (err) {
				reject(err)
			},
		})
	});
};