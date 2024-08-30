const fs = require('fs');
let artworks;
let artists = [];

fs.readFile("gallery.json", function(err, data) {
    if(err) throw err;

    artworks = JSON.parse(data);
    for(let i = 0; i < artworks.length; i++) {
        artworks[i].likes = 0;
        artworks[i].reviews = [];
    }    
})

let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let db;

MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true }, function(err, client) {
    if(err) throw err;

    db = client.db('a5');

    db.dropCollection("artworks", function(err, result) {  // clear artwork data
        if(err) {
            console.log("Error");
        } else {
            console.log("Cleared artworks");
        }

        db.dropCollection("users", function(err, result) { // clear user data
            if(err) {
                console.log("Error");
            } else {
                console.log("Cleared user data");
            }
        });

        db.dropCollection("workshops", function(err, result) { // clear workshop data
            if(err) {
                console.log("Error, the workshop collection is already empty");
            } else {
                console.log("Cleared workshop data");
            }
        });
       

        db.collection("artworks").insertMany(artworks, function(err, result) { // adds art to database
            if(err) throw err;
            console.log(`Successfully inserted ${result.insertedCount} artworks`);
            //process.exit();
            
            db.collection("artworks").distinct("artist", function(err, result) { // gets all artists
                if(err) throw err;
                //console.log(result);
                for(let i = 0; i < result.length; i++) {
                    artists.push({username: result[i], account: "artist", workshops: []}); // new artist account
                }
               
                db.collection("users").insertMany(artists, function(err, result) { // add artist accounts
                    if(err) throw err;
                    console.log(`Successfully inserted ${result.insertedCount} artist accounts`);
                    process.exit();
                })
            })
        })
        
        // db.createCollection("users", function(err, result) {
        //     if(err) throw err;
        // })

        // db.createCollection("workshops", function(err, result) {
        //     if(err) throw err;
        // })
       
    });

   
   

    
})