const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('database/database.json')
const db = low(adapter)

db.defaults({ admin: [], products: [], category: [], sell: [] })
  .write()

module.exports = db;
