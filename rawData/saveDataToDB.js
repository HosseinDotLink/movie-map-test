// store data.json to database
const Movies = require('../models/movies');
const file = require('./data.json');
const connectDb = require("../configs/db");
const axios = require('axios');


// connect to database
connectDb().then(() => {
    for (let i in file) {
        const movie = file[i];
        const data = {
            title: movie.title,
            release_year: Number(movie.release_year),
            locations: movie.locations,
            production_company: undefined,
            director: undefined,
            writer: undefined,
            actor: []
        };
        if (movie.production_company)
            data.production_company = movie.production_company.split('/ ');
        if (movie.director)
            data.director = movie.director.split('/ ');
        if (movie.writer)
            data.writer = movie.writer.split(', ');
        if (movie.actor_1)
            data.actor.push(movie.actor_1);
        if (movie.actor_2)
            data.actor.push(movie.actor_2);
        if (movie.actor_3)
            data.actor.push(movie.actor_3);
        if (movie.locations)
            storeToDB(data);
    }
});

const storeToDB = (data) => {
    axios.get(encodeURI('https://api.opencagedata.com/geocode/v1/json?key=08f8d56112cc4c24b7ce9a50213dece9&q=' + data.locations + ' san francisco'))
        .then((response) => {
            let coordinates = undefined;
            if (response.data.results[0]) {
                coordinates = [response.data.results[0].geometry.lat, response.data.results[0].geometry.lng];
            }
            const movie = new Movies(data);
            movie.locationGeometricData = {
                coordinates
            };
            movie.save((err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data.title + '  Saved to DB');
                }
            });
        })
        .catch((error) => {
            console.log(error);
        })
}