const app = require('./app')
const http = require('http')
const config = require('./utils/config')

const server = http.createServer(app)

console.log(`Env: ${process.env.NODE_ENV}`)

server.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
})