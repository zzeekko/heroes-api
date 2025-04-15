// localhost:3000
// 1a
const express = require('express')
const router = express.Router()
const axios = require('axios')
const PORT = process.env.PORT || 3000

// 2
router.use(express.static('public'))

const endpoints = [ 'hero', 'franchise', 'team', 'power', 'species']

// individual routes
// router.use('/api/hero', require('./api/heroRoutes'))
// router.use('/api/franchise', require('./api/franchiseRoutes'))
endpoints.forEach(endpoint => {
    router.use(`/api/${endpoint}`, require(`./api/${endpoint}Routes`))
})

// 3 
// router.get(path, callback function)
router.get('/', (req, res)=> {

    let randomHero = {}
    let message = ''
    const url = `http://localhost:${PORT}/api/hero`

    axios.get(url)
    .then(resp => {
        randomHero = resp.data[Math.floor(Math.random() * resp.data.length)]
        // console.log(randomHero)

        let heroName = randomHero.hero_name != null ? randomHero.hero_name : `${randomHero.first_name} ${randomHero.last_name}`

        switch (randomHero.alignment) {

            case 'HERO':
                message = `Great news! ${heroName} is here to save you!`
                break;
            case 'ANTIHERO':
                message = `I guess you need to get on ${heroName}'s good side if you want to live.`
                break;
            case 'VILLAIN':
                message = `Looks like ${heroName} is here to destroy you and everything you love...`
                break;
            default:
                message = ''
        }
        // console.log(message)
        res.render('pages/home', {
            title: 'Home',
            name: 'My Hero Website',
            randomHero,
            message,
            heroName
        })
    })
})

// 1b
module.exports = router