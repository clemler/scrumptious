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

    // Initialize MongoDB Connection before each test
    beforeEach(function(done) {
        mongoClient.open(function(err, client) {
            if (err) throw err;

            logger.info("Entered mongoClient.open()");
            debugger;
            db = client.db("scrumptious");
            storiesDAO = new StoriesDAO(db);
            done();
        })
    });

    it("should pass", function() {
        logger.info("Executing TEST");
        expect('6').toBe('6');
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
