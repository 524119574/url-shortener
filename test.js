var assert = require("assert");
var superagent = require("superagent");

describe("server", function() {
  var server;
  // start the server
  beforeEach(function() {
    server = require("./script.js");
  });
  // close the server
  afterEach(function() {
//    server.close();  
  });
  
  it ("respond to /", function(done) {
    superagent.get("http://localhost:3000/", function(err, res) {
      assert.ifError(err);
      assert.equal(res.text, "Hello World!");
      done();
    });
  });
});

// it needs to serve a webpage when accessing /

// it needs to have /new end point

// it needs to check for the url after /new/

// itnneds to shit!!! 