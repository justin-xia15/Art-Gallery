// TODO: add follow functionality, add review/likes functionality, 

const e = require('express');
const express = require('express');
const session = require('express-session');
let app = express();

let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let db;

app.set("view engine", "pug");
app.set("views", "./views")
app.use(express.json());

app.use(session({
    secret: "abcJK#7",
    resave: true,
    saveUninitialized: true
}));

app.get("/", (req, res) => {
    res.render("pages/home", {session: req.session});
})

MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true }, function(err, client) {
    if(err) throw err;

    db = client.db('a5');

    db.collection("artworks").find().toArray(function(err, result) {
        if(err) throw err;
    })

    app.get("/register", (req, res) => {
        db.collection("users").find().toArray(function(err, result) {
            if(err) throw err;
        })
        res.render("pages/register", {});
    })

    app.get("/logout", (req, res) => {
        if(req.session.loggedin) {
            req.session.loggedin = false;
        }
        res.status(200).send();
    })

    app.get("/account", (req, res) => { // page displaying account info
        db.collection("users").findOne({"username": req.session.username}, function(err, result) {
            if(err) throw err;
            res.render("pages/account", {session: req.session, user: result, liked: result.liked, reviews: result.reviews});
        })
    })

    app.get("/artworks", (req, res) => { // search for artworks page
        res.render("pages/artworks", {session: req.session});
    })

    app.get("/addartwork", (req, res) => { // add artwork page
        res.render("pages/addartwork", {session: req.session});
    })

    app.get("/addworkshop", (req, res) => { // add workshop page
        res.render("pages/addworkshop", {session: req.session});
    })

    app.get("/artworks/:artID", (req, res) => { // individual artwork page
        db.collection("artworks").findOne({"_id": mongo.ObjectId(req.params.artID)}, function(err, result) {
            if(err) throw err;
            res.render("pages/artpage", {session: req.session, artwork: result});
        })
    })

    app.get("/artists/:name", (req, res) => { // individual artist page
        let artist, artwork;
        db.collection("users").findOne({"username": req.params.name}, function(err, result) {
            if(err) throw err;
            artist = result; // requested artist
            db.collection("artworks").find({"artist": req.params.name}).toArray(function(err, result) {
                if(err) throw err;
                artwork = result; // art created by requested artist
                db.collection("workshops").find({instructor: artist.username}).toArray(function(err, result) { // get artist's workshops
                    if(err) throw err;
                    res.render("pages/artist", {session: req.session, artistInfo: artist, art: artwork, workshops: result});
                })
                
            })
        })
    })

    app.get("/search", (req, res) => { // case insensitive queries for name, artist, and category
        let queries = [];
        if(req.query.name != "") queries.push({name: {$regex: req.query.name, $options: 'i'}});
        if(req.query.artist != "") queries.push({artist: {$regex: req.query.artist, $options: 'i'}});
        if(req.query.category != "") queries.push({category: {$regex: req.query.category, $options: 'i'}});

        db.collection("artworks").find({$and: queries}).toArray(function(err, result) {
            if(err) throw err;
            if(result.length == 0) // no artwork found
			    res.status(404).send();
		    else
			    res.send(result);
        })
    })

    app.get("/following", (req, res) => { // page displaying user's followed artists
        db.collection("users").findOne({"_id": mongo.ObjectId(req.session.userid)}, function(err, result) {
            if(err) throw err;
            let user = result;
            res.render("pages/following", {session: req.session, followed: user.following});
        })
       
    })

    app.get("/workshops/:workshopID", (req, res) => { // get individual workshop page
        db.collection("workshops").findOne({"_id": mongo.ObjectId(req.params.workshopID)}, function(err, result) {
            if(err) throw err;
            res.render("pages/workshop", {session: req.session, workshop: result});
        })
    })


    app.post("/register", (req, res) => { // register a new account
        db.collection("users").find({"username": req.body.username}).toArray(function(err, result) {
            if(err) throw err;
            if(result.length == 0) { // username not taken
                let newUser = {username: req.body.username, password: req.body.password, following: [], liked: [], reviews: [], artwork: [], workshops: [], account: "Patron"};
                db.collection("users").insertOne(newUser, function(err, result) {
                    if(err) throw err;
                    if(result.acknowledged == true) res.status(200).send();  // acknowledged = true if successful
                })
            } else {
                res.status(409).send(); // username already exists
            }
        })
    })

    app.post("/login", (req, res) => { // logging in
        db.collection("users").findOne({"username": req.body.username}, function(err, result) {
            if(err) throw err;
            if(result != null) { // user with this username exists
                if(result.password === req.body.password) {
                    req.session.loggedin = true;
                    req.session.username = result.username;
                    req.session.userid = result._id;
                    req.session.type = result.account;
                    res.status(200).send();
                } else {
                    res.status(401).send();
                }
            } else { // no user with this username exists
                res.status(401).send();
            }
        })
    })

    app.post("/artists/:name", (req, res) => { // follow an artist
        //let artist = req.params.name;
        //let userID = req.session.userid;
        db.collection("users").findOne({"username": req.params.name}, function(err, result) { // get artist to follow
            if(err) throw err;
            let artist = result;

            db.collection("users").findOne({"_id": mongo.ObjectId(req.session.userid)}, function(err, result) { // get user from session object
                if(err) throw err;
                let user = result;
                // check if the given artist is followed by the given user
                if(!((user.following).includes(artist))) { 
                    // user not following so add artist to user's following list
                    db.collection("users").updateOne({"_id": mongo.ObjectId(req.session.userid)}, {$addToSet: {following: artist}}, function(err, result) {
                        if(err) throw err;
                    })
               }
            })
        })
    })

    app.post("/unfollow/:name", (req, res) => { // unfollow an artist
        db.collection("users").findOne({"username": req.params.name}, function(err, result) { // get artist to unfollow
            if(err) throw err;
            let artist = result;
            // remove from followed list
            db.collection("users").updateOne({"_id": mongo.ObjectId(req.session.userid)}, {$pull: {following: artist}}, function(err, result) {
            if(err) throw err;
            })                
        })
    })

    app.post("/artworks/:artID", (req, res) => { // liking an artwork
        db.collection("artworks").findOne({"_id": mongo.ObjectId(req.params.artID)}, function(err, result) { // find artwork that user liked
            if(err) throw err;
            let artwork = result;
            let artist = artwork.artist;
            db.collection("users").findOne({"_id": mongo.ObjectId(req.session.userid)}, function(err, result) { // do not allow user to like own artwork
                if(err) throw err;
                if(result.username == artist) {
                    res.status(403).send();
                    return;
                }
            })
            // add artwork to user's liked list
            db.collection("users").updateOne({"_id": mongo.ObjectId(req.session.userid)}, {$addToSet: {liked: artwork}}, function(err, result) {
                if(err) throw err;
                db.collection("artworks").updateOne({"_id": mongo.ObjectId(req.params.artID)}, {$inc: {likes: 1}}, function(err, result) { // increment likes
                    if(err) throw err;
                    res.status(200).send();
                })                               
            })  
        })
    })

    app.post("/review/:artID", (req, res) => { // add review to an artwork
        let review = req.body.review;

        db.collection("artworks").findOne({"_id": mongo.ObjectId(req.params.artID)}, function(err, result) { // get artwork
            if(err) throw err;
            let artwork = result;
            let artist = artwork.artist;

            db.collection("users").findOne({"_id": mongo.ObjectId(req.session.userid)}, function(err, result) { // find user that made review
                if(err) throw err;
                let user = result;
                if(user.username == artist) {
                    res.status(403).send(); // reviewing own artwork
                    return;
                }
                let reviewObj = {artwork: artwork, text: review, reviewer: user};
                db.collection("users").updateOne({"_id": mongo.ObjectId(req.session.userid)}, {$addToSet: {reviews: reviewObj}}, function(err, result) { // add to user's reviews
                    if(err) throw err;
    
                })
                db.collection("artworks").updateOne({name: artwork.name}, {$addToSet: {reviews: reviewObj}}, function(err, result) { // add user's review to artwork 
                    if(err) throw err;
                    res.status(200).send();
                })
            })
        })
    })

    app.post("/addartwork", (req, res) => { // add art
        if(req.session.type != "Artist") {
            res.status(401).send(); // user is a patron and not authorized to submit artwork
        } else {
            let artwork = req.body;
            db.collection("artworks").find({name: artwork.name}).toArray(function(err, result) { // check if artwork name is taken as it must be unique
                if(err) throw err;
                if(result.length > 0) {
                    res.status(400).send();
                }
            })
            
            // complete artwork object
            artwork.artist = req.session.username;
            artwork.likes = 0;
            artwork.reviews = [];
            // add to database
            db.collection("artworks").insertOne(artwork, function(err, result) {
                if(err) throw err;
                if(result.acknowledged == true) res.status(201).send();
            })
        }
      
    })

    app.post("/addworkshop", (req, res) => { // add workshop
        if(req.session.type != "Artist") {
            res.status(401).send(); // user is a patron and not authorized to create workshops
        } else {
            let workshop = {name: req.body.name, instructor: req.session.username, registered: []};
            db.collection("workshops").insertOne(workshop, function(err, result) {
                if(err) throw err;
                if(result.acknowledged == true) res.status(201).send();
            })
        }
        
    })

    app.post("/workshop", (req, res) => { // enroll in workshop
        db.collection("users").findOne({"_id": mongo.ObjectId(req.session.userid)}, function(err, result) { // get user
            if(err) throw err;
            let user = result;
            db.collection("workshops").updateOne({"_id": mongo.ObjectId(req.body.workshopID)}, {$addToSet: {registered: user.username}}, function(err, result) { // add user to registered list
                if(err) throw err;
                if(result.acknowledged == true) res.status(200).send();
            })
        })
    })

    app.put("/account", (req, res) => { // switch account from patron to artist and vice versa
        let update;
        db.collection("users").findOne({"_id": mongo.ObjectId(req.session.userid)}, function(err, result) { // find user's account type
            if(err) throw err;
            let user = result;
            if(user.account== "Patron") { // if currently a patron switch to artist
                update = {$set: {account: "Artist"}};
                req.session.type = "Artist";
                db.collection("artworks").find({artist: req.session.username}).toArray(function(err, result) { // if user has no artwork, prompt them to add artwork
                    if(err) throw err;
                    if(result.length == 0) { // user does not have any artworks in the database
                        res.status(401).send();
                    }
                })
            } else { // otherwise switch to patron
                update = {$set: {account: "Patron"}};
                req.session.type = "Patron";
            }

            db.collection("users").updateOne({username: user.username}, update, function(err, result) { // change it
                if(err) throw err;
                res.status(200).send();
            })
        })
    })

    app.put("/unlike/:artID", (req, res) => { // remove like from artwork
            // remove from liked array
            db.collection("users").updateOne({"_id": mongo.ObjectId(req.session.userid)}, {$pull: {liked: {"_id": mongo.ObjectId(req.params.artID)}}}, function(err, result) { 
                if(err) throw err; 
                db.collection("artworks").updateOne({"_id": mongo.ObjectId(req.params.artID)}, {$inc: {likes: -1}}, function(err, result) { // decrement likes
                    if(err) throw err;
                    res.status(200).send();
                }) 
            })
        })
})


app.listen(3000);
console.log("Listening on port 3000");