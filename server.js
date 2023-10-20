/*********************************************************************************
*  BTI325 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _Yash A. Akbari_ Student ID: _126403229_ Date: _ 09-28-2023 _
*
*  Online (Cyclic) Link: https://poised-dove-threads.cyclic.cloud/about

********************************************************************************/

const express = require("express");
const path = require("path"); // Import the path module
const app = express();

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: "dp8pjxtwe",
  api_key: "531922566116931",
  api_secret: "lltZhDmbjUkxi28ln6YRS9oZse0",
  secure: true,
});

const upload = multer();

const port = process.env.PORT || 8080;

const blogService = require("./blog-service");

// Serve static files from the 'public' folder
app.use(express.static("public"));

// Redirect the root URL to the '/about' route
app.get("/", (req, res) => {
  res.redirect("/about");
});

// Serve the 'about.html' file for the '/about' route
app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/views/about.html");
});

// Route to serve addPost.html
app.get("/posts/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "addPost.html"));
});

// Step 2: Adding the "Post" route
app.post("/posts/add", upload.single("featureImage"), async (req, res) => {
  try {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    const uploaded = await upload(req);

    req.body.featureImage = uploaded.url;

    const postData = {
      title: req.body.title,
      body: req.body.body,
      category: req.body.category,
      published: req.body.published === "on",
      featureImage: uploaded.url,
    };

    const addedPost = await blogService.addPost(postData);
    console.log("Added post:", addedPost);
    res.redirect("/posts");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error uploading image" });
  }
});


// Define routes for '/blog', '/posts', and '/categories'
app.get("/blog", (req, res) => {
  blogService
    .getPublishedPosts()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// Update the "/posts" route to handle category and minDate filters
app.get("/posts", (req, res) => {
  const { category, minDate } = req.query;

  if (category) {
    // Filter by category
    blogService.getPostsByCategory(parseInt(category))
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  } else if (minDate) {
    // Filter by minDate
    blogService.getPostsByMinDate(minDate)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  } else {
    // Return all posts without any filter
    blogService.getAllPosts()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  }
});

// Add the "/post/value" route to get a single post by ID
app.get("/post/:id", (req, res) => {
  const postId = parseInt(req.params.id);

  blogService.getPostById(postId)
    .then((post) => {
      if (!post) {
        res.status(404).json({ message: "Post not found" });
      } else {
        res.json(post);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});


app.get("/categories", (req, res) => {
  blogService
    .getAllCategories()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// Handle 404 (Not Found) errors
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// Initialize the blog-service and start the server
blogService
  .initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Express http server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
