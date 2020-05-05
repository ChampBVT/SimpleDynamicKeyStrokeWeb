const path = require('path');
const express = require('express')
const bodyParser = require('body-parser')
const distance = require('euclidean-distance')
const coDistance = require( 'compute-cosine-distance' );
const distancejs = require('distancejs');
const coSim = require('cos-similarity')
const app = express()
const fs = require('fs');
const dist_threshold = 120;
const cosine_threshold = .95;

const htmlPath = path.join(__dirname, 'src');
app.use(express.static(htmlPath));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/login', (req, res) => {
    const dbjson = fs.readFileSync('db.json');
    const db = JSON.parse(dbjson);
    const response = { }
    if(db.password === req.body.password) {
        //console.log(db.stroke)
        //console.log(req.body.stroke)
        const savedTimeMap = Object.keys(db.stroke).map(function (key) {
            return db.stroke[key][`${Object.keys(db.stroke[key])[0]}`]
        });
        const inputTimeMap = Object.keys(req.body.stroke).map(function (key) {
            return req.body.stroke[key][`${Object.keys(req.body.stroke[key])[0]}`]
        });
        console.log("euclidean "+distancejs.euclidean(inputTimeMap, savedTimeMap));
        console.log("manhattan "+distancejs.manhattan(inputTimeMap, savedTimeMap));
        console.log("chebyshev "+distancejs.chebyshev(inputTimeMap, savedTimeMap));
        console.log("angularSim"+distancejs.angularSimilarity(inputTimeMap, savedTimeMap));
        console.log("cosine "+distancejs.cosineSimilarity(inputTimeMap, savedTimeMap));
        console.log("angular "+distancejs.angular(inputTimeMap, savedTimeMap));
        console.log('\n')
        const dist = distance(inputTimeMap, savedTimeMap)
        const cosim = coSim(inputTimeMap, savedTimeMap)
        response.username = db.username;
        response.distance = dist;
        response.cosine = cosim;
        if(dist > dist_threshold || cosim < cosine_threshold)
            response.status = "unauthenticated"
        else
            response.status = "authenticated"
        //console.log(dist)
    }else{
        response.status = "failed"
    }
    res.json(response);
})

app.post('/create', (req, res) => {
    fs.writeFileSync('db.json', JSON.stringify(req.body));
    const data = {
        status : "created",
        ...req.body
    }
    res.json(data);
})

app.listen(3000, () => {
    console.log('Start server at port 3000.')
})

