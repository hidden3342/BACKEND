const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require('./routes/users.cjs');
const postRoutes = require("./routes/posts.cjs");
const ImageKit = require('imagekit');
require('dotenv').config();

const port = process.env.PORT || 4000;
const uri = process.env.MONGO_URI;

const app = express();

app.use(cors());
app.use(express.json());

app.use(function (req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

const imagekit = new ImageKit({
   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
   privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

// Middleware to handle favicon requests and prevent them from reaching routes
app.get('/favicon.ico', (req, res) => {
   res.status(204).end(); // Respond with a 204 No Content status for favicon requests
});

// Route handling /auth endpoint
app.get('/auth', async (req, res) => {
   try {
      if (!imagekit) {
         throw new Error('ImageKit is not initialized.');
      }
      const result = await imagekit.getAuthenticationParameters();
      res.json(result); // Assuming result is JSON
   } catch (error) {
      console.error('Error in /auth endpoint:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
});

// Ensure all routes are included as required 
app.use("/", postRoutes)
app.use('/', userRoutes)
app.use('/', userRoutes)
app.use("/objavi", postRoutes)
app.use("/usluga", postRoutes)
app.use("/korisnik", userRoutes)
app.use("/korisnik", postRoutes)
app.use("/profil", userRoutes)
app.use("/profil", postRoutes)
app.use("/nalog", userRoutes)
app.use("/nalog", postRoutes)

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => {
      app.listen(port, () => {
         console.log(`Server is running on port ${port}`);
      });
   })
   .catch((error) => {
      console.error('Database connection error:', error);
   });
