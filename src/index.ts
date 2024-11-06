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
		]

		const plainSubUrls: string[] = ['https://raw.githubusercontent.com/ermaozi/get_subscribe/main/subscribe/v2ray.txt']

		const singleServerUrls: string[] = [
			'vless://3ca7d8c4-de2d-48ac-a651-583a355658b1@edge.zhj13.com:443?encryption=none&security=tls&sni=edge.zhj13.com&fp=randomized&type=ws&host=edge.zhj13.com&path=%2F%3Fed%3D2560#edge.zhj13.com',
		]

		// const resCollection: Promise<string>[] = []
		// base64EncodedSubUrls.forEach(async (url) => {
		// 	resCollection.push(requestSubs(url, request))
		// })

		// const resStrCollection: string[] = await Promise.all(resCollection)

		// let result = resStrCollection.reduce((r, curr) => {
		// 	if (!curr) return r
		// 	try {
		// 		const originString = Buffer.from(curr, 'base64').toString('utf-8')
		// 		return r + originString
		// 	} catch (error) {
		// 		console.error(`Error parsing content from encoded content:`, error)
		// 		return r
		// 	}
		// }, '')

		// result + extraServer.map((s) => s).join('')

		// const encodedResult = Buffer.from(result).toString('base64')

		// return new Response(encodedResult, { headers: { 'Content-Type': 'text/plain' } })

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
