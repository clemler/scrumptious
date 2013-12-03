/*
 * stories.js - Provides CRUD operations for stories
 *
 * Copyright (c) 2013 Chris Lemler
 *
 * MIT LICENSE
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
 var logger = require('./logger');

 // The StoriesDAO must be constructed with a connected database object
 function StoriesDAO(db) {
    "use strict";

    logger.info("Constructing a StoriesDAO(db)");

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof StoriesDAO)) {
        logger.warn('Warning: StoriesDAO constructor called without "new" operator');
        return new StoriesDAO(db);
    }
    else {
        logger.info("StoriesDAO() was called via the 'new' operator");
    }

    var stories = db.collection("stories");
    logger.info("stories --> ", stories);

    /**
     * Inserts a new story into the database
     *
     * @param {string} title The title of the story
     * @param {string} description The detailed description for the story
     * @param {number} points Whole number between 1 and 89
     * @param { callback(err, story)} callback [description]
     */
     this.insertStory = function(title, description, points, callback) {
        "use strict";
        logger.info("Inserting story: ", title);

        // Create the new Story object
        var story = {
            "title": title,
            "description": description,
            "points": points,
            "status": "Todo"
        };

        stories.insert(story, function(err, dbstory) {
            if (err) throw err;

            logger.info("Inserted--> ", dbstory);
            callback(err, dbstory);
        })
     }
}

module.exports = StoriesDAO;