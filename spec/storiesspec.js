/*
 * storiesspec.js - Jasmine test cases for the StoriesDAO object
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

 var MongoClient = require('mongodb').MongoClient // Driver for connecting to MongoDB
 var Server = require('mongodb').Server;
 var StoriesDAO = require("../lib/stories");
 var logger = require('../lib/logger');


// Tests that exercise the StoriesDAO object that manages Scrum stories
describe("StoriesDAO", function() {
    var dbServer = new Server('localhost', 27017);
    var mongoClient = new MongoClient(dbServer);
    var db = null;
    var storiesDAO = null;
    var MSG = null;

    // Initialize MongoDB Connection before each test
    beforeEach(function(done) {
        
        // Define a new Matcher to test for integers
        this.addMatchers({
            isInteger: function(expected) {
                var actual = this.actual;
                return actual != "" && !isNaN(actual) && Math.round(actual) == actual;
            }

        });

        // Open the MongoDB connection
        mongoClient.open(function(err, client) {
            if (err) throw err;

            logger.info("Entered mongoClient.open()");
            debugger;
            db = client.db("scrumptious");
            storiesDAO = new StoriesDAO(db);
            MSG = storiesDAO.getMessageCatalog();
            done();
        });
    });


    it("should insert a new story", function testInsertStory(done) {
        logger.info("Executing: insert a new story");
        var title = "My test story",
            description = "A really complex story that requires a month",
            points = 21;

        storiesDAO.insertStory( title, description, points, function(err, result) {
            if (err) throw err;

            logger.info("Inserted story: ", result);
            expect(title).toEqual(result[0].title);
            expect(description).toEqual(result[0].description);
            expect(points).toEqual(result[0].points);
            done();
        });
    });

     /**
      * Verify that StoriesDAO checks for an empty title
      */
     it("should require a non-empty title", function(done) {
        logger.info("Executing: insert story with title validation");
        var title = "",
            description = "A really complex story that requires a month",
            points = 21;

        storiesDAO.insertStory( title, description, points, function(err, result) {
            expect(err.length).toEqual(1);
            expect(err[0]).toEqual(MSG.TITLE_MISSING);
            done();
        });
    });


    /**
      * Verify that StoriesDAO checks for the MAX title length
      */
     it("should verify a title is less than 80 characters", function(done) {
        logger.info("Executing: insert story with title validation");
        var title = "Validates the story object prior to performing MogoDB operations. Returns an array of error messages if there are errors, otherwise the function returns an empty array.",
            description = "A really complex story that requires a month",
            points = 21;

        storiesDAO.insertStory( title, description, points, function(err, result) {
            expect(err.length).toEqual(1);
            expect(err[0]).toEqual(MSG.TITLE_TOO_LONG);
            done();
        });
    }); 

    /**
     * Verify that StoriesDAO checks that 'points' is an integer
     */
    it("should verify that story points is an integer", function(done) {
        logger.info("Executing: insert story with points validation");
        var title = "Validates the story object prior to performing MogoDB operations.",
            description = "A really complex story that requires a month",
            points = "seven";

        storiesDAO.insertStory( title, description, points, function(err, result) {
            expect(err.length).toEqual(1);
            expect(err[0]).toEqual(MSG.POINTS_INVALID);
            done();
        });
    });

    /**
     * Verify that StoriesDAO checks that 'points' is greater than 0
     */
    it("should verify that story points is an integer >= 0", function(done) {
        var title = "Validates the story object prior to performing MogoDB operations.",
            description = "A really complex story that requires a month",
            points = "-1";

        storiesDAO.insertStory( title, description, points, function(err, result) {
            expect(err.length).toEqual(1);
            expect(err[0]).toEqual(MSG.POINTS_INVALID);
            done();
        });
    });

    /**
     * Verify that StoriesDAO checks that 'points' is less than 89
     */
    it("should verify that story points is an integer <= 89", function(done) {
        var title = "Validates the story object prior to performing MogoDB operations.",
            description = "A really complex story that requires a month",
            points = "90";

        storiesDAO.insertStory( title, description, points, function(err, result) {
            expect(err.length).toEqual(1);
            expect(err[0]).toEqual(MSG.POINTS_INVALID);
            done();
        });
    });

     /**
     * Verify that StoriesDAO checks that 'points' is less than 89
     */
    it("should return an array of open stories", function(done) {

        storiesDAO.getOpenStories(function(err, results) {
            logger.error("Entered get stories test case");
            expect(err.length).toEqual(0);
            //logger.info("Results type: ", typeof(results));
            //logger.info(results);
            expect(results[0].status).toEqual("Todo");
            done();
        });
    });


    // Tear-down the MongoDB Connection after each test
    afterEach(function(done) {
        logger.info("Entered mongoClient.close()");
        mongoClient.close(function(err, rc) {
            if (err) throw err;

            db = null;
            done();
        });
    });

});
