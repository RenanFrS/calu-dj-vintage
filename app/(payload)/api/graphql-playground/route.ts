/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

async function getConfig() {
	const { default: config } = await import('@payload-config')
	return config
}

export const GET = async (req: Request, res: Response) => {
	const config = await getConfig()
	return GRAPHQL_PLAYGROUND_GET(config)(req, res)
}
