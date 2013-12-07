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
 var Validator = require('validator').Validator;

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

    /**
     * Represents the MongoDB stories collection
     */
    var stories = db.collection("stories");

    /**
     * Message Catalog - Object containing error codes and their associated
     *                   error messages.
     * @type {Object}
     */
    var MSG_CAT = {
        TITLE_MISSING: "Please enter a title for the story",
        TITLE_TOO_LONG: "A title cannot be longer than 80 characters",
        DESCRIPTION_MISSING: "Please enter a description for the story",
        DESCRIPTION_TOO_LONG: "The description cannot be longer than 1024 characters",
        POINTS_TOO_BIG: "A story cannot exceed 89 points"
    };

    /**
     * Returns the Message Catalog. An object containing error codes and
     * their associated error messages. This is being made accessible for
     * use in unit and functional tests.
     */
    this.getMessageCatalog = function() {
        return MSG_CAT;
    }

    /**
     * Inserts a new story into the database. The initial status
     * will be set to 'Todo'
     *
     * @param {string} title The title of the story (80 chars max)
     * @param {string} description The detailed description for the story (1024 chars max)
     * @param {number} points Whole number between 1 and 89
     * @param { callback(err, story)} callback Returns an array containing the inserted object
     */
     this.insertStory = function(title, description, points, callback) {
        "use strict";

        var validationErrors;
        // Create the new Story object
        var story = {
            "title": title,
            "description": description,
            "points": points,
            "status": "Todo"
        };


        // If no validation errors, proceed with the insertion
        validationErrors = validateStory(story);
        if (validationErrors.length == 0) {
            stories.insert(story, function(err, dbstory) {
                if (err) throw err;

                logger.info("StoriesDAO Inserted Story --> ", dbstory);
                callback(err, dbstory);
            });
        } else {
            logger.info("Validation Results: ", validationErrors);
            callback(validationErrors, null);
        }
     }

     
     /**
      * Validates the story object prior to performing MogoDB operations.
      * Returns an array of error messages if there are errors, otherwise
      * the function returns an empty array.
      * 
      * @param  {[Object]} story Story object
      * @return {[Array]}        An array containing error messages, or an
      *                          empty array if there were no errors.
      */
     function validateStory(story) {
        var v = new Validator();
        var errors = [];

        logger.info("Validating: ", story);

        v.error = function(msg) {
            errors.push(msg);
        }

        // Check for empty title, and if that passes then check for its length
        if (v.check(story.title, MSG_CAT.TITLE_MISSING).notEmpty()) {
            v.check(story.title, MSG_CAT.TITLE_TOO_LONG).len(1,80);
        }

        // Check for empty description, and if that passes then check for its length
        if (v.check(story.description, MSG_CAT.DESCRIPTION_MISSING).notEmpty()) {
            v.check(story.description, MSG_CAT.DESCRIPTION_TOO_LONG).len(1,1024);
        }
        

        return errors;
     }
}

module.exports = StoriesDAO;