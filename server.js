// step 1
const express = require('express')
const server = express()
const helmet = require('helmet')
const cors = require('cors')
//router goes here
const router = require('./app/routes/router')
const PORT = process.env.PORT || 3000
//step 3
//Handle security
//server.use(helmet())
server.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    directives: {
        "img-src": ["'self'", "https: data:"],
        "scriptSrc": ["'self'", "cdn.jsdelivr.net"]
    }
}))

server.use(cors())

server.use(express.json())
server.use(express.urlencoded( { extended: true }))

// step 4
// Build root route
// localhost:3000/api
server.get('/api', (req, res)=> {
    res.json({
        'All Heroes': `http://localhost:${PORT}/api/hero`
    })
})
// step 5
// add a router
server.use('/', router)
server.set('view engine', 'ejs')

//step 2
server.listen(PORT, ()=> console.log(`The port is ${PORT}, dumdum`))