/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes'

async function getConfig() {
	const { default: config } = await import('@payload-config')
	return config
}

export const GET = async (req: Request, res: Response) => {
	const config = await getConfig()
	return REST_GET(config)(req, res)
}
export const POST = async (req: Request, res: Response) => {
	const config = await getConfig()
	return REST_POST(config)(req, res)
}
export const DELETE = async (req: Request, res: Response) => {
	const config = await getConfig()
	return REST_DELETE(config)(req, res)
}
export const PATCH = async (req: Request, res: Response) => {
	const config = await getConfig()
	return REST_PATCH(config)(req, res)
}
export const PUT = async (req: Request, res: Response) => {
	const config = await getConfig()
	return REST_PUT(config)(req, res)
}
export const OPTIONS = async (req: Request, res: Response) => {
	const config = await getConfig()
	return REST_OPTIONS(config)(req, res)
}
