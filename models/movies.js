const mongoose = require("mongoose")

const moviesSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    release_year: {
        type: Number,
    },
    locations: {
        type: String,
    },
    locationGeometricData: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: [{
            type: Number,
        }, ],
    },
    production_company: [{
        type: String,
    }],
    director: [{
        type: String,
    }],
    writer: [{
        type: String,
    }],
    actor: [{
        type: String,
    }, ]
});

module.exports = mongoose.model("Movies", moviesSchema);