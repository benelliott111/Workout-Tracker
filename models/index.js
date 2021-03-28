const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  name: String,
  type: String,
  sets: Number,
  reps: Number,
  weight: Number,
  duration: Number,
  distance: Number,
});

const workoutSchema = new Schema(
  {
    day: {
      type: Date,
      default: Date.now
    },
    exercises: [
      ExerciseSchema
    ]
  },
  {
    toJSON: {
      // include any virtual properties when data is requested
      virtuals: true
    }
  }
);


workoutSchema.virtual("totalDuration").get(function () {
  // "reduce" array of exercises down to just the sum of their durations
  return this.exercises.reduce((total, exercise) => {
    return total + exercise.duration;
  }, 0);
});


const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;