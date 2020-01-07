console.log("js here");

////Cors request handler
// (async () => {
//   const res = await fetch('http://localhost:3000/api/posts', {
//     method: 'DELETE'
//   })

//   console.log(await res.json())
// })();

// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");

//API query and key variables
//NASA API
var factAPIkey = "CpOF579ndJum1XP4s6XcPnWTQHLo9faqr4hORNMH";
var nasaFact ="https://api.nasa.gov/planetary/apod?api_key=" + factAPIkey;
var marsQuery = "https://api.nasa.gov/insight_weather/?api_key=" + factAPIkey + "&feedtype=json&ver=1.0";

var movieQuery = "https://www.omdbapi.com/?apikey=ec0b3a6b&s=astronaut"

// The API object contains methods for each kind of request we'll make
var API = {

  //random fact and picture call
  getRandomFact: function(response) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json",

      },
      type: "GET",
      url: nasaFact,
      data: JSON.stringify(response)
    }).then(function (response) {

      console.log(response);
      console.log(response.url);
      console.log(response.title);

      //appends to nasa div in index.html
      $("#nasa").append(`<img id="fact" src="${response.url}"><br> <h1>${response.title}</h1><br>${response.explanation}`);

    });
  },

  //generate random list
  getMovieList: function(response) {

    return $.ajax({
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000/, *",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "86400",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT,TRACE",
        "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
      },
      type: "GET",
      url: movieQuery,
      data: JSON.stringify(response)
    }).then(function (response) {

      response.setHeader("Access-Control-Allow-Origin", "*");
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Methods", "OPTIONS, TRACE, GET, HEAD, POST");
response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

      console.log(response)
      console.log(response.search[0].title);
      for(let i = 0; i < 3; i++ ){

      let r = response.search[0];
      r = response.search[Math.floor(Math.random() * response.search.length)];

      //appends to movie div in index.html
      $("#movie-list").append(`<img src="${r.poster}"><br> <h1>${r.title}</h1>`);

    }
  });
  }
};

var nasaAPI = {
  //make a function for the ajax call
  getExamples: function() {
    return $.ajax({
      
      url: nasaFact,
      type: "GET"
    }).then(function (response) {

      console.log(response);
      console.log(response.url);
      console.log(response.title);

      $("#nasa").append(`<img id="fact" src="${response.url}"><br> <h1>${response.title}</h1>`);

    });
  },
};



// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getExamples().then(function(data) {
    var $examples = data.map(function(example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function() {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);

API.getRandomFact();
API.getMovieList();