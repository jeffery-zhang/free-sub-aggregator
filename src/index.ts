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
			'vmess://ew0KICAidiI6ICIyIiwNCiAgInBzIjogIlRHLUB2dmtqMTEiLA0KICAiYWRkIjogIjIzLjIyNy4zOS4xMSIsDQogICJwb3J0IjogIjgwODAiLA0KICAiaWQiOiAiOTY5ZjE5MDktYzBkMy00YzMwLTgxM2QtM2FlYzVjODM4YjdkIiwNCiAgImFpZCI6ICIwIiwNCiAgInNjeSI6ICJhdXRvIiwNCiAgIm5ldCI6ICJ3cyIsDQogICJ0eXBlIjogIm5vbmUiLA0KICAiaG9zdCI6ICJkb25ndGFpd2FuZzE1LmR0a3U0Ny54eXoiLA0KICAicGF0aCI6ICIvMUlLWWpWMHIvIiwNCiAgInRscyI6ICIiLA0KICAic25pIjogIiIsDQogICJhbHBuIjogIiIsDQogICJmcCI6ICIiDQp9',
			'vmess://ew0KICAidiI6ICIyIiwNCiAgInBzIjogIlRHLUB2dmtqMTEiLA0KICAiYWRkIjogIjEwOS4xMDQuMTUyLjIyMCIsDQogICJwb3J0IjogIjIzMDk5IiwNCiAgImlkIjogIjVlM2NlNmE3LTE3MGUtNDkzOS05YWFlLWM4ZmVmYjM1YTdlYSIsDQogICJhaWQiOiAiMCIsDQogICJzY3kiOiAiYXV0byIsDQogICJuZXQiOiAid3MiLA0KICAidHlwZSI6ICJub25lIiwNCiAgImhvc3QiOiAiIiwNCiAgInBhdGgiOiAiL0h6dU9paEI2LyIsDQogICJ0bHMiOiAiIiwNCiAgInNuaSI6ICIiLA0KICAiYWxwbiI6ICIiLA0KICAiZnAiOiAiIg0KfQ==',
			'trojan://Puj01Rc8UcA9IzcFcYOs8KMOhCz6aX2Q@mfyousheng.nl.eu.org:443?security=tls&type=ws&path=%2FtjwsLhx0SFASG4l9FERJ1g#TG-%40vvkj11',
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
