import config from './config.js'

export default {
	development: {
		client: 'sqlite3',
		connection: {
			filename: './messagedb.sqlite3',
		},
		useNullAsDefault: true,
	},

	test: {
		client: 'sqlite3',
		connection: {
			filename: ':memory:',
		},
		useNullAsDefault: true,
	},

	production: {
		client: 'postgresql',
		connection: {
			database: 'messagedb',
			user: config.DB_USER,
			password: config.DB_PASSWORD,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: 'knex_migrations',
		},
	},
}
