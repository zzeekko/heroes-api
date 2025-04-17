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

// heroAside data and count
let heroAsideData = []
let heroCount = 0

axios.get(`http://localhost:${PORT}/api/hero/sort`)
.then(resp => {
    heroAsideData = resp.data
    heroCount = resp.data.length
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

        let heroName = randomHero.hero_name != null ? randomHero.hero_name : `${randomHero.first_name} ${randomHero.last_name}`

        switch (randomHero.alignment) {

            case 'HERO': 
                message = `Great news! ${heroName} is here to save you!`
                break;
            case 'ANTIHERO':
                message = `I guess you need to get on ${heroName}'s good side if you want to live.`
                break;
            case 'VILLAIN':
                message = `Looks like ${heroName} is here to destroy you and everything you love`
                break;
            default:
                    message = ''
                    break;
        }
    
        // console.log(randomHero)
        res.render('pages/home', {
            title: 'Home',
            name: 'My Hero Website',
            randomHero,
            message,
            heroName
        })

    })

})

// hero page
router.get('/heroes', (req, res)=> {

    const url = `http://localhost:${PORT}/api/hero`

    axios.get(url)
    .then(resp => {
        res.render('pages/hero', {
            title: 'All Heroes',
            name: 'Heroes',
            data: resp.data,
            asideData: heroAsideData
        })
    })
})

// hero single
router.get('/heroes/:id', (req, res)=> {

    const id = req.params.id 
    // let heroPowers = []
    const url = `http://localhost:${PORT}/api/hero/${id}`

    axios.get(url)
    .then(resp => {

        let heroName = resp.data.hero_name == null ? `${resp.data.first_name} ${resp.data.last_name}` : resp.data.hero_name

        res.render('pages/heroSingle', {
            title: heroName,
            name: heroName,
            data: resp.data,
            asideData: heroAsideData,
            count: heroCount

        })
    })
})

// subpages

    router.get(`/power`, (req, res)=> {
        const url = `http://localhost:${PORT}/api/power`
    
        axios.get(url)
        .then(resp => {

            res.render('pages/allPower', {
                title: 'Powers',
                name: `All Powers`,
                data: resp.data
            })
        })

    })

router.get('/power/pow/:power', (req, res)=> {
    const power = req.params.power

    const url = `http://localhost:${PORT}/api/power/pow/${power}`

    axios.get(url)
    .then(resp => {
        res.render('pages/powerSingle', {
            title: power,
            name: `Heroes with ${power}`,
            data: resp.data
        })
    })
})

router.get(`/team`, (req, res)=> {
    const url = `http://localhost:${PORT}/api/team`

    axios.get(url)
    .then(resp => {

        res.render('pages/allTeam', {
            title: 'Teams',
            name: `All Teams`,
            data: resp.data
        })
    })

})


router.get('/team/team/:team', (req, res)=> {
    const team = req.params.team

    const url = `http://localhost:${PORT}/api/team/team/${team}`

    axios.get(url)
    .then(resp => {
        res.render('pages/teamSingle', {
            title: team,
            name: `Heroes in ${team}`,
            data: resp.data
        })
    })
})

router.get(`/species`, (req, res)=> {
    const url = `http://localhost:${PORT}/api/species`

    axios.get(url)
    .then(resp => {

        res.render('pages/allSpecies', {
            title: 'Species',
            name: `All Species`,
            data: resp.data
        })
    })

})

router.get('/species/spec/:species', (req, res)=> {
const species = req.params.species

const url = `http://localhost:${PORT}/api/species/spec/${species}`

axios.get(url)
.then(resp => {
    res.render('pages/speciesSingle', {
        title: species,
        name: `${species} heroes`,
        data: resp.data
    })
})
})

router.get(`/franchise`, (req, res)=> {
    const url = `http://localhost:${PORT}/api/franchise`

    axios.get(url)
    .then(resp => {

        res.render('pages/allFranchise', {
            title: 'Franchises',
            name: `All Franchises`,
            data: resp.data
        })
    })

})


router.get('/franchise/fran/:franchise', (req, res)=> {
    const franchise = req.params.franchise

    const url = `http://localhost:${PORT}/api/franchise/fran/${franchise}`

    axios.get(url)
    .then(resp => {
        res.render('pages/franchiseSingle', {
            title: franchise,
            name: `${franchise} Heroes`,
            data: resp.data
        })
    })
})

// 1b
module.exports = router