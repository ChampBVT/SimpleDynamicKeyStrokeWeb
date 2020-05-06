const path = require('path');
const express = require('express')
const bodyParser = require('body-parser')
const distancejs = require('distancejs');
const app = express()
const dist_threshold = 180;
const cosine_threshold = .85;

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

        app.listen(process.env.PORT || 3000, function(){
            console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
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
                        const savedTimeMap = mapToArray(result.stroke)
                        const inputTimeMap = mapToArray(req.body.stroke)
                        const euclidean = distancejs.euclidean(inputTimeMap, savedTimeMap);
                        const cosine = distancejs.cosineSimilarity(inputTimeMap, savedTimeMap);
                        const savedFlightMap = mapToArray(result.flight)
                        const inputFlightMap = mapToArray(req.body.flight)
                        const euclideanF = distancejs.euclidean(inputFlightMap, savedFlightMap);
                        const cosineF = distancejs.cosineSimilarity(inputFlightMap, savedFlightMap);
                        const response = {
                            username: result.username,
                            euclidean_dist_stroke: euclidean,
                            cosine_sim_stroke: cosine,
                            euclidean_dist_flight: euclideanF,
                            cosine_sim_flight: cosineF,
                        }
                        if (euclidean<=dist_threshold&&euclideanF<=dist_threshold&&cosine>=cosine_threshold&&cosineF>=cosine_threshold) {
                            response.status = "authenticated"
                            res.status(200).send(response)
                        } else {
                            response.status = "unauthenticated"
                            res.status(401).send(response)
                        }
                    }
                }
            })
        })
    })

const mapToArray = (map => {
    return Object.keys(map).map(function (key) {
        return map[key][`${Object.keys(map[key])[0]}`]
    });
});



