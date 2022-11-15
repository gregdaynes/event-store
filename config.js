import { join } from 'desm'
import envSchema from 'env-schema'
import S from 'fluent-json-schema'

const schema = S.object()
	.prop('NODE_ENV', S.string().default('development'))
	.prop('DB_PASSSWORD', S.string())
	.prop('DB_USER', S.string())

const env = envSchema({
	schema,
	dotenv: { path: join(import.meta.url, '.env') },
})

export default env
