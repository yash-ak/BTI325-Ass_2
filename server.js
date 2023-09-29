
/*********************************************************************************
*  BTI325 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _Yash A. Akbari_ Student ID: _126403229_ Date: _ 09-28-2023 _
*
*  Online (Cyclic) Link: ________________________________________________________
*
********************************************************************************/ 

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const blogService = require('./blog-service');

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Redirect the root URL to the '/about' route
app.get('/', (req, res) => {
  res.redirect('/about');
});

// Serve the 'about.html' file for the '/about' route
app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/views/about.html');
});

// Define routes for '/blog', '/posts', and '/categories'
app.get('/blog', (req, res) => {
  blogService.getPublishedPosts()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

app.get('/posts', (req, res) => {
  blogService.getAllPosts()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

app.get('/categories', (req, res) => {
  blogService.getCategories()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// Handle 404 (Not Found) errors
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Initialize the blog-service and start the server
blogService.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Express http server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
