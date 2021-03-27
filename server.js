const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config()

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(express.static("public"));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());



mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
app.get('/exercise', (req, res) => {
  res.sendFile(__dirname + "/public/exercise.html")
})

app.get('/stats', (req, res) => {
  res.sendFile(__dirname + "/public/stats.html")
})

app.get('/api/workouts', (req, res) => {

  db.Workout.find({}).then(dbNote => { res.send(dbNote) }).catch(err => { res.send(err) })
})

app.get("/api/workouts/range", (req, res) => {
  db.Workout.find({})
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.put('/api/workouts/:id', (req, res) => {
  const id = req.params.id
  if (req.body.type == "resistance") {
    db.Workout.updateOne({ _id: `${id}` }, {
      $push: {
        exercises:
        {
          "type": req.body.type,
          "name": req.body.name,
          "duration": req.body.duration,
          "weight": req.body.weight,
          "reps": req.body.reps,
          "sets": req.body.sets,
        }
      }
    }).then(dbUpdate => res.send(dbUpdate))
  } else {
    db.Workout.updateOne({ _id: `${id}` }, {
      $push: {
        exercises:
        {
          "type": req.body.type,
          "name": req.body.name,
          "duration": req.body.duration,
          "distance": req.body.distance,

        }
      }
    }).then(dbUpdate => res.send(dbUpdate))
  }
})

app.post("/api/workouts", (req, res) => {

  let data = req.body;

  db.Workout.create({
    day: new Date().setDate(new Date().getDate())
  }).then(dbUpdate => {
    res.json(dbUpdate);
  })
    .catch(err => {
      res.json(err);
    });
});


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});