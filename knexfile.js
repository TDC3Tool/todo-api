const { knexSnakeCaseMappers } = require('objection')

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './db.sqlite3'
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    // See Footnote #1
    useNullAsDefault: false,
    pool: {
      afterCreate: (conn, cb) => {
        // See Footnote #2
        conn.run('PRAGMA foreign_keys = ON', cb)
      }
    },
    ...knexSnakeCaseMappers()
  },

  staging: {},

  production: {}

}

/*
 * Footnote #1:
 *
 * In the example below, the `complete` column has a default value of `false`,
 * and the `title` column is required. When useNullAsDefault is set to false,
 * the example will fail. When set to true, knex will insert null for the second
 * todo item. Because SQLite allows columns to have default values, but it does
 * not support a DEFAULT keyword in queries, this means that it is not possible
 * to do a bulk insert where some rows explicity set a column value and other
 * rows rely on the default column value. See this question on stack overflow
 * for more details.
 * https://stackoverflow.com/questions/58695302/how-to-insert-rows-in-sqlite-using-default-values/58695642
 *
 * exports.seed = function(knex) {
 *  return knex('todo').insert([{
 *    title: 'Pickup dry cleaning',
 *    complete: true
 *  }, {
 *    title: 'Finish homework'
 *  }])
 * }
 *
 */

/*
 * Footnote #2:
 *
 * Foreign keys are turned off by default in SQLite. Alternatively, rather than
 * turning on FKs in the knexfile, you could do it right after instantiating
 * knex.
 *
 * const knex = Knex(knexConfig.development)
 * knex.client.pool.on('createSuccess', (eventId, resource) => {
 *   resource.run('PRAGMA foreign_keys = ON', () => {})
 * })
 * Model.knex(knex)
 *
 */
