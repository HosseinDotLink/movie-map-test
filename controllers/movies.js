const Movies = require("../models/movies");
const path = require("path")
const fs = require("fs");
const handlebars = require('handlebars');
const _ = require('lodash');

// index file
exports.index = async (req, res) => {
    const search = req.query.search || '';
    const regex = new RegExp(search, 'i');
    const production_company = req.query.company || undefined;
    const locations = req.query.locations || undefined;
    const director = req.query.director || undefined;
    const writer = req.query.writer || undefined;
    const actor = req.query.actor || undefined;
    try {
        let query = {
            $or: [{
                title: regex
            }, {
                locations: regex
            }]
        }
        if (locations)
            query.locations = locations;
        if (director)
            query.director = director;
        if (writer)
            query.writer = writer;
        if (actor)
            query.actor = actor;
        if (production_company)
            query.production_company = production_company;
        const movies = await Movies.find(query);
        let sideData = {
            locations: [],
            company: [],
            actor: [],
            writer: [],
            director: []
        };
        for (movie of movies) {
            sideData.locations.push(movie.locations);
            for (const company of movie.production_company) {
                sideData.company.push(company);
            }
            for (const actor of movie.actor) {
                sideData.actor.push(actor);
            }
            for (const writer of movie.writer) {
                sideData.writer.push(writer);
            }
            for (const director of movie.director) {
                sideData.director.push(director);
            }
        }
        readHTMLFile(path.join(__dirname, '../templates/index.html'), (err, html) => {
            let template = handlebars.compile(html);
            let replacements = {
                movies: JSON.stringify(movies),
                sideData: {
                    locations: _.uniq(sideData.locations).sort(),
                    company: _.uniq(sideData.company).sort(),
                    actor: _.uniq(sideData.actor).sort(),
                    writer: _.uniq(sideData.writer).sort(),
                    director: _.uniq(sideData.director).sort()

                }
            };
            let htmlToSend = template(replacements);
            res.send(htmlToSend);
        })
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            msg: 'An error occured while loading index'
        });
    }
};

// search on movies
exports.search = async (req, res) => {
    const search = req.query.search || '';
    const regex = new RegExp(search, 'i');
    const production_company = req.query.company || undefined;
    const locations = req.query.locations || undefined;
    const director = req.query.director || undefined;
    const writer = req.query.writer || undefined;
    const actor = req.query.actor || undefined;
    try {
        let query = {
            $or: [{
                title: regex
            }, {
                locations: regex
            }]
        }
        if (locations)
            query.locations = locations;
        if (director)
            query.director = director;
        if (writer)
            query.writer = writer;
        if (actor)
            query.actor = actor;
        if (production_company)
            query.production_company = production_company;

        const movies = await Movies.find(query);
        res.status(200).json(movies);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            msg: 'An error occured while loading movies data'
        });
    }
};

const readHTMLFile = async (path, callback) => {
    fs.readFile(path, {
        encoding: 'utf-8'
    }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        } else {
            callback(null, html);
        }
    });
};