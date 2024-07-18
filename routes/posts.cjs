const express = require("express")
const router = express.Router()
const Post = require("../models/Post.cjs")

router.get('/', (req, res) => {
   if (req.originalUrl === '/') {
      try {
         Post.find().then((posts) => {
            res.json(posts);
         });
      } catch (err) {
         res.json({ message: err });
      }
   } else {
      const limit = parseInt(req.query.limit) || 12; // default limit is 16
      const skip = parseInt(req.query.skip) || 0; // default skip is 0

      try {
         Post.find()
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .skip(skip)
            .limit(limit)
            .then((posts) => {
               res.json(posts);
            });
      } catch (err) {
         res.json({ message: err });
      }
   }
});
router.delete('/:id', async (req, res) => {
   const { id } = req.params;

   try {
      const post = await Post.findByIdAndDelete(id);
      if (!post) {
         return res.status(404).json({ message: "Post not found" });
      }
      res.status(200).json({ message: "Post deleted successfully" });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});
router.put('/:id', async (req, res) => {
   const { id } = req.params;
   const { title, description, city, country, phone, email } = req.body;

   try {
      const post = await Post.findByIdAndUpdate(id, {
         title,
         description,
         city,
         country,
         phone,
         email
      }, { new: true });

      if (post) {
         res.json(post);
      } else {
         res.status(404).json({ message: "Post not found" });
      }
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});
router.get('/:id', (req, res) => {
   const { id } = req.params;
   try {
      Post.findById(id).then((post) => {
         if (post) {
            res.json(post);
         } else {
            res.status(404).json({ message: "Post not found" });
         }
      });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
});

router.post('/', async (req, res) => {
   const { title, by, desc, phone, email, city, country, image } = req.body

   try {
      const post = await Post.create({
         title,
         by,
         desc,
         phone,
         email,
         city,
         country,
         image
      })
      res.status(200).json(post)
   }
   catch (error) {
      response.status(400).json({ error: error.message })
   }
})
module.exports = router