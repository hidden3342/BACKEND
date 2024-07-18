const mongoose = require("mongoose")
const Schema = mongoose.Schema
const postSchema = new Schema({
   title: {
      type: String,
      required: true,
   },
   by: {
      type: String,
      required: true
   },
   desc: {
      type: String,
      required: true
   },
   phone: {
      type: String,
      required: true
   },
   email: {
      type: String,
   },
   country: {
      type: String,
      required: true
   },
   city: {
      type: String,
      required: true
   },
   image: {
      type: String,
   }
}, { timestamps: true })

module.exports = mongoose.model("Post", postSchema)