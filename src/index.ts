/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Buffer } from 'node:buffer'

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const base64EncodedSubUrls: string[] = [
			'https://raw.githubusercontent.com/aiboboxx/v2rayfree/main/v2',
			'https://raw.gitmirror.com/sun9426/sun9426.github.io/main/subscribe/v2ray.txt',
			'https://edge.zhj13.com/3ca7d8c4-de2d-48ac-a651-583a355658b1?b64',
			'https://raw.githubusercontent.com/ripaojiedian/freenode/main/sub',
			'https://sub.pmsub.me/base64',
			'https://sub.sharecentre.online/sub',
			'https://ghp.ci/https://raw.githubusercontent.com/free18/v2ray/refs/heads/main/v.txt',
			'https://raw.githubusercontent.com/chengaopan/AutoMergePublicNodes/master/list.txt',
			'https://chromego-sub.netlify.app/sub/base64.txt',
		]

		const plainSubUrls: string[] = [
			'https://raw.githubusercontent.com/ermaozi/get_subscribe/main/subscribe/v2ray.txt',
			'https://raw.githubusercontent.com/awesome-vpn/awesome-vpn/master/all',
			'https://git.io/emzv2ray',
		]

		const singleServerUrls: string[] = [
			'vless://3ca7d8c4-de2d-48ac-a651-583a355658b1@edge.zhj13.com:443?encryption=none&security=tls&sni=edge.zhj13.com&fp=randomized&type=ws&host=edge.zhj13.com&path=%2F%3Fed%3D2560#edge.zhj13.com',
			'ss://YWVzLTI1Ni1jZmI6YW1hem9uc2tyMDVANTQuMTc4LjE5MS4yMzY6NDQz',
			'ss://YWVzLTI1Ni1jZmI6YW1hem9uc2tyMDVANDMuMjAzLjEyNy4xNTI6NDQz',
			'ss://YWVzLTI1Ni1jZmI6YW1hem9uc2tyMDVAMTguMTgxLjE3Ni4yMjc6NDQz',
			'ss://YWVzLTI1Ni1jZmI6YW1hem9uc2tyMDVAMy4xMTIuMjM2LjM6NDQz',
			'ss://YWVzLTI1Ni1jZmI6YW1hem9uc2tyMDVAMTMuMTE1LjIzMS42NDo0NDM=',
			'ss://YWVzLTI1Ni1jZmI6YW1hem9uc2tyMDVANTIuNzkuMjQ4LjE5Mzo0NDM=',
			'ss://YWVzLTI1Ni1jZmI6YW1hem9uc2tyMDVANTIuMTk0LjIxMi4yMzU6NDQz',
			'ss://YWVzLTI1Ni1jZmI6YW1hem9uc2tyMDVAMzUuOTAuMy44MTo0NDM=',
			'ss://YWVzLTI1Ni1jZmI6YW1hem9uc2tyMDVANTQuMjAyLjc3LjgxOjQ0Mw==',
			'ss://YWVzLTI1Ni1jZmI6YW1hem9uc2tyMDVANTQuMTg2LjkyLjM0OjQ0Mw==',
			'ss://YWVzLTI1Ni1jZmI6YW1hem9uc2tyMDVANDMuMjA3LjIzMi4yMjg6NDQz',
			'ss://YWVzLTI1Ni1jZmI6YW1hem9uc2tyMDVANTQuMjQ1LjIwNy4xNDQ6NDQz',
		]

		const requests: Promise<string>[] = []

		base64EncodedSubUrls.forEach((url) => {
			requests.push(requestSubs(url, request, true))
		})

		plainSubUrls.forEach((url) => {
			requests.push(requestSubs(url, request, false))
		})

		let result: string = (await Promise.all(requests)).reduce((prev, curr) => prev + curr)

		result += singleServerUrls.join('')

		try {
			const base64EncodedResult = Buffer.from(result).toString('base64')
			return new Response(base64EncodedResult, { headers: { 'Content-Type': 'text/plain' } })
		} catch (error) {
			console.error('Error parsing sub urls:', error)
			return new Response('error')
		}
	},
} satisfies ExportedHandler<Env>

async function requestSubs(subUrl: string, request: Request, isBase64: boolean): Promise<string> {
	try {
		const url = new URL(subUrl)
		const res = await fetch(url, request)

		let result = await res.text()
		if (isBase64) {
			try {
				result = Buffer.from(result, 'base64').toString('utf-8')
			} catch (error) {
				console.error(`Error decode content from ${subUrl}:`, error)
				result = ''
			}
		}

		return result
	} catch (error) {
		console.error(`Error fetching content from ${subUrl}:`, error)
		return ''
	}
}
