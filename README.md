# onionScraper

Whenever a user visits the site, the app will scrape stories from The Onion.
Cheerio grabs the site content and Mongoose saves it to a MongoDB database.
All users can leave comments on the stories. 
They can also delete whatever comments they want removed. All stored comments are visible to every user.
 Mongoose's model system associates comments with particular articles.
