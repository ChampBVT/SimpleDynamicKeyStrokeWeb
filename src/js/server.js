const path = require('path');
const express = require('express')
const bodyParser = require('body-parser')
const distancejs = require('distancejs');
const app = express()
const dist_threshold = 120;
const cosine_threshold = .95;

const htmlPath = path.join(__dirname, '../');
app.use(express.static(htmlPath));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb+srv://admin:security@dynamickeystroke-iaiao.mongodb.net/test?retryWrites=true&w=majority",
    {useUnifiedTopology: true}, (error, client) => {
        if (error) throw error;

        const db = client.db("User")

        console.log("connected to the database ");

        app.listen(3000, () => {
            console.log('Start server at port 3000.')
        });

        app.get(
            "/users",
            (req, res) => {
                db.collection("Users").find().toArray((err, result) => {
                    if (err) return res.status(500).send(err.toString());
                    res.status(200).send(result);
                });
            }
        );

        app.post('/create', (req, res) => {
            db.collection("Users").findOne({
                username: req.body.username
            }, (err, result) => {
                if (err) throw err;
                if (result != null) {
                    res.status(400).send({status: "duplicate username"})
                } else {
                    db.collection("Users").insertOne({
                        ...req.body
                    }).then(r => {
                        res.status(201).send({
                            status: "created",
                            ...r.ops
                        });
                    })
                }
            })
        })

        app.post('/login', (req, res) => {
            db.collection("Users").findOne({
                username: req.body.username
            }, (err, result) => {
                if (err) throw err;
                if (result === null) {
                    res.status(400).send({status: "invalid username or password"})
                } else {
                    if (result.password !== req.body.password)
                        res.status(400).send({status: "invalid username or password"});
                    else {
                        const savedTimeMap = Object.keys(result.stroke).map(function (key) {
                            return result.stroke[key][`${Object.keys(result.stroke[key])[0]}`]
                        });
                        const inputTimeMap = Object.keys(req.body.stroke).map(function (key) {
                            return req.body.stroke[key][`${Object.keys(req.body.stroke[key])[0]}`]
                        });
                        const euclidean = distancejs.euclidean(inputTimeMap, savedTimeMap);
                        const manhattan = distancejs.manhattan(inputTimeMap, savedTimeMap);
                        const chebyshev = distancejs.chebyshev(inputTimeMap, savedTimeMap);
                        const angular = distancejs.angularSimilarity(inputTimeMap, savedTimeMap);
                        const cosine = distancejs.cosineSimilarity(inputTimeMap, savedTimeMap);
                        const response = {
                            username: result.username,
                            distance: euclidean,
                            manhattan_dist: manhattan,
                            chebyshev_dist: chebyshev,
                            angular_sim: angular,
                            cosine_sim: cosine
                        }
                        if (euclidean > dist_threshold) {
                            response.status = "unauthenticated"
                            res.status(401).send(response)
                        } else {
                            response.status = "authenticated"
                            res.status(200).send(response)
                        }
                    }
                }
            })
        })
    })



