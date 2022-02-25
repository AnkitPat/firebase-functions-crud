const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const admin = require("firebase-admin");
admin.initializeApp({
    serviceAccountId:
        "firebase-adminsdk-7l4xl@fir-a0f2a.iam.gserviceaccount.com"
});

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: true }));


// build multiple CRUD interfaces:
app.get('/:id', async (req, res) => {

    let ref = admin
        .firestore()
        .collection("check")
        .doc('check1');

    let checkDoc = await ref.get();
    const temp = checkDoc.data();

    let data = [];

    console.log(req.params.id)
    Object.keys(temp).map(key => {
        data.push({ audioId: key, ...temp[key] })
    })
    data = data.filter(item => item.users.find(user => user.userId === req.params.id) === undefined)
    data = data.sort((a, b) => a.users.length - b.users.length)

    data = data.slice(0, 10)

    res.send(JSON.stringify(data));
});
app.post('/', async (req, res) => {

    let ref = admin
        .firestore()
        .collection("check")
        .doc('check1');

    let checkDoc = await ref.get();

    let audio1 = {
        audio2: {
            actorName: "vaibhav",
            path: "/path2",
            users: [
                {
                    userId: '3',
                    emotion: "sad",
                    audiobility: true
                }
            ]
        }
    }

    ref.update(audio1);
    res.send('Done');
});


app.post('/1', async (req, res) => {

    let ref = admin
        .firestore()
        .collection("check")
        .doc('check1');

    let checkDoc = await ref.get();

    const path = require('path');
    const fs = require('fs');
    //joining path of directory 
    const directoryPath = path.join(__dirname, 'Documents');
    //passsing directoryPath and callback function
    fs.readdir('./audios', function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            console.log(file);
            fs.readdir(`./audios/${file}`, function (err, audioFiles) {
                //handling error
                if (err) {
                    return console.log('Unable to scan directory: ' + err);
                }
                //listing all files using forEach
                audioFiles.forEach(function (audioFile) {
                    // Do whatever you want to do with the file
                    console.log(audioFile, file);
                    let audio1 = {
                        [`${file}_${audioFile}`]: {
                            actorName: file,
                            path: '',
                            audioName: audioFile,
                            users: [
                               
                            ]
                        }
                    }
                
                    console.log(JSON.stringify(audio1))
                    
                });
            });
            
        });
    });
    res.send('Done');
});

app.put('/updateStatus/:userId', async (req, res) => {
    let ref = admin
        .firestore()
        .collection("check")
        .doc('check1');
    const bodyObj = req.body;

    bodyObj.forEach(async (doc) => {
        let audioId = doc.audioId;
        let data = await (await ref.get()).get(audioId);
        //console.log(audioId, data);
        await ref.update({
            [audioId]: {
                ...data,
                users: data.users.concat([{
                    userId: req.params.userId,
                    emotion: doc.emotion,
                    audiobility: doc.audiobility
                }])
            }
        })
    });
    res.send('done')

});
// app.delete('/:id', (req, res) => res.send(Widgets.delete(req.params.id)));
// app.get('/', (req, res) => res.send(Widgets.list()));

// Expose Express API as a single Cloud Function:
exports.audios = functions.https.onRequest(app);
// exports.getAudios = functions.https.onRequest(async (request, response) => {
//     functions.logger.info("Hello logs!", { structuredData: true });


// });


// exports.updateAudioStatus = functions.https.onRequest(async (request, response) => {

//     // let ref = admin
//     //     .firestore()
//     //     .collection("check")
//     //     .doc('check1');

//     // let checkDoc = await ref.get();
//     // const temp = checkDoc.data();
//     // console.log(request.query.userId);

//     // let data = [];

//     // Object.keys(temp).map(key => {
//     //     data.push({ audioId: key, ...temp[key] })
//     // })
//     // data = data.filter(item => item.users.find(user => user.userId === request.query.userId) === undefined)
//     // data = data.sort((a, b) => a.users.length - b.users.length)

//     // if (data.length > 2) {
//     //     data = data.slice(0, 2)
//     // }

//     console.log('')
//     response.send('hello');
// });




// 1. audio where you have not labeled
// 2. audio which has lower count of users enteries