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
		const subUrls = [
			'https://raw.githubusercontent.com/aiboboxx/v2rayfree/main/v2',
			'https://raw.gitmirror.com/sun9426/sun9426.github.io/main/subscribe/v2ray.txt',
			'https://raw.githubusercontent.com/ermaozi/get_subscribe/main/subscribe/v2ray.txt',
		]

		const resCollection: Promise<string>[] = []
		subUrls.forEach(async (url) => {
			resCollection.push(requestSubs(url, request))
		})

		const resStrCollection: string[] = await Promise.all(resCollection)

		const result = resStrCollection.reduce((r, curr) => {
			if (!curr) return r
			try {
				const originString = Buffer.from(curr, 'base64').toString('utf-8')
				return r + originString
			} catch (error) {
				console.error(`Error parsing content from encoded content:`, error)
				return r
			}
		}, '')

		const encodedResult = Buffer.from(result).toString('base64')

		return new Response(encodedResult, { headers: { 'Content-Type': 'text/plain' } })
	},
} satisfies ExportedHandler<Env>

async function requestSubs(subUrl: string, request: Request): Promise<string> {
	try {
		const url = new URL(subUrl)
		const res = await fetch(url, request)

		return await res.text()
	} catch (error) {
		console.error(`Error fetching content from ${subUrl}:`, error)
		return ''
	}
}
