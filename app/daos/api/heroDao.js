const con = require('../../config/dbconfig')

const heroDao = {
    table: 'hero',
    ...require('../daoCommon'),
    findHeroes: (res, table)=> {
        con.query(
            `SELECT h.hero_id, h.hero_name, h.first_name,
            h.last_name, h.alias, f.franchise, s.species, 
            h.place_of_origin, h.first_app, h.alignment, h.img_url
            FROM hero h 
            JOIN franchise f USING (franchise_id)
            JOIN species s USING (species_id)
            ORDER BY h.hero_id;`,
            (error, rows) => {
                if (!error) {
                    if (rows.length === 1) {
                        res.json(...rows)
                    } else {
                        res.json(rows)
                    }
                } else {
                    console.log(`DAO ERROR: ${table}`, error)
                }
            }
        )
    },

    findHeroById: (res, table, id)=> {
        let powers = []
        let rivals = []
        con.query(
            `SELECT ${table}.hero_id, p.power 
            FROM ${table}
            JOIN hero_to_power hp ON ${table}.hero_id = hp.hero_id
            JOIN power p ON p.power_id = hp.power_id
            WHERE ${table}.hero_id = ${id};`,
            (error, rows)=> {
                if (!error) {

                    Object.values(rows).forEach(obj => {
                        powers.push(obj.power)
                    })
                    // write a rivals query
                    con.query(
                        `SELECT h1.hero_name hero, h2.hero_name rival
                        FROM hero_to_rival hr 
                        JOIN hero h1 ON h1.hero_id = hr.hero_id 
                        JOIN hero h2 ON h2.hero_id = hr.hero_id 
                        WHERE h1.hero_id = ${id};`,
                        (error, rows) => {
                            if (!error) {
                                Object.values(rows).forEach(obj => {
                                    rivals.push(obj.rival)
                                })
                            }
                        }
                    )


                    con.query(
                        `SELECT h.hero_id, h.hero_name, h.first_name,
                        h.last_name, h.alias, f.franchise, s.species, 
                        h.place_of_origin, h.first_app, h.alignment, h.img_url
                        FROM hero h 
                        JOIN franchise f USING (franchise_id)
                        JOIN species s USING (species_id)
                        WHERE h.hero_id = ${id};`,
                        (error, rows) => {
                        
                            rows.forEach(row => {
                                row.powers = powers
                            })
                            if (!error) {
                                if (rows.length === 1) {
                                    res.json(...rows)
                                } else {
                                    res.json(rows)
                                }

                            } else {
                                console.log(`DAO ERROR: ${table}`, error)
                            }
                        }
                    )

                } else {
                    console.log(error)
                }
            }
        )
    },

    findByAlignment:(res, table, alignment)=> {
        con.query(
            `SELECT h.hero_id, h.hero_name, h.first_name, 
            h.last_name, h.alias, f.franchise, s.species,
            h.place_of_origin, h.first_app, h.alignment, 
            h.img_url 
            FROM hero h 
            JOIN franchise f USING (franchise_id) 
            JOIN species s USING (species_id) 
            WHERE h.alignment = '${alignment}' 
            ORDER BY h.hero_id;`,
            (error, rows) => {
                if (!error) {
                    if (rows.length === 1) {
                        res.json(...rows)
                    } else {
                        res.json(rows)
                    }
                } else {
                    console.log(`DAO ERROR: ${table}`, error)
                }
            }
        )
    },
    sort: (res, table)=> {
        con.query(
            `SELECT h.hero_id, h.hero_name, h.first_name, 
            h.last_name, h.alias, f.franchise, s.species,
            h.place_of_origin, h.first_app, h.alignment, 
            h.img_url 
            FROM hero h 
            JOIN franchise f USING (franchise_id) 
            JOIN species s USING (species_id) 
            ORDER BY h.hero_name, h.last_name, h.first_name;`,
            (error, rows) => {
                if (!error) {
                    if (rows.length === 1) {
                        res.json(...rows)
                    } else {
                        res.json(rows)
                    }
                } else {
                    console.log(`DAO ERROR: ${table}`, error)
                }
            }
        )
    }
}

module.exports = heroDao