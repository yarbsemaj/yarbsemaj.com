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
	var authenticationData = {
		Username: uname,
		Password: password,
	};
	AWS.config.region = region;
	var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
	var poolData = {
		UserPoolId,
		ClientId
	};
	var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	var userData = {
		Username: uname,
		Pool: userPool,
	};
	var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	return new Promise((resolve, reject) => {
		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: function (result) {
				var accessToken = result.getAccessToken().getJwtToken();
				return resolve(accessToken);
			},

			onFailure: function (err) {
				reject(err)
			},
		})
	});
};