const fs = require("fs"); 
const path = require('path');

// const data_folder = "./data/";

// Define global arrays to hold data
let posts = [];
let categories = [];


// Function to initialize data by reading JSON files
function initialize() {
  return new Promise((resolve, reject) => {
    // Read posts.json file
    fs.readFile(path.join(__dirname, 'data', 'posts.json'), 'utf8', (err, postData) => {
      if (err) {
        reject('Unable to read posts file');
      } else {
        try {
          posts = JSON.parse(postData);

          // Read categories.json file after successfully reading posts.json
          fs.readFile(path.join(__dirname, 'data', 'categories.json'), 'utf8', (err, categoryData) => {
            if (err) {
              reject('Unable to read categories file');
            } else {
              try {
                categories = JSON.parse(categoryData);
                resolve('Data initialization successful');
              } catch (categoryError) {
                reject('Error parsing categories JSON');
              }
            }
          });
        } catch (postError) {
          reject('Error parsing posts JSON');
        }
      }
    });
  });
}

// Function to get all posts
function getAllPosts() {
  return new Promise((resolve, reject) => {
    if (posts.length === 0) {
      reject('No results returned');
    } else {
      resolve(posts);
    }
  });
}

// Function to get published posts
function getPublishedPosts() {
  return new Promise((resolve, reject) => {
    const publishedPosts = posts.filter((post) => post.published === true);
    if (publishedPosts.length === 0) {
      reject('No published posts found');
    } else {
      resolve(publishedPosts);
    }
  });
}

// Function to get all categories
function getAllCategories() {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) {
      reject('No categories found');
    } else {
      resolve(categories);
    }
  });
}

// Export the functions
module.exports = {
  initialize,
  getAllPosts,
  getPublishedPosts,
  getAllCategories,
};
