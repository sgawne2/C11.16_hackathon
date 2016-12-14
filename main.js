/* Sean, Miles, Mike, Vernon    Music Venue     Hack-a-thon     December 12-13, 2016    */

//START GOOGLE PLACES API

/**
 *  https://developers.google.com/maps/documentation/javascript/places
 */

//html elements
var input_zipcode;
var imageSearch;
var places_list;

//url parameters
var venue_name;
var lat_from_landing;
var long_from_landing;
var radius_from_landing;

//google maps variables
var map;
var infowindow;
var places_array = [];

var tweet_storage_array = [];   // where I store all the tweets for the current venue
var tweetNum;                   // which Tweet number we are on, the 1st of five
var totalTweetNum;              // the number of tweets we have pulled from Twitter API for the current venue
var YT_num = 1;

$(document).ready(function() {

    //initMap(51.4826,0.0077,100000);

    $(".dropPhotosButton").click(function () {
        $(".Container1").show();
        $(".Container2").hide();
        $(".Container3").hide();
    });

    $(".dropYouTubeButton").click(function () {
        $(".Container3").show();
        $(".Container1").hide();
        $(".Container2").hide();
    });
    $(".dropTweetsButton").click(function () {
        $(".Container2").show();
        $(".Container1").hide();
        $(".Container3").hide();
    });


    lat_from_landing = parseFloat(getUrlParameter("lat"));
    long_from_landing = parseFloat(getUrlParameter("long"));
    radius_from_landing = parseInt(getUrlParameter("radius"));

    if (lat_from_landing && long_from_landing) {
        initMap(lat_from_landing, long_from_landing, radius_from_landing);
    }

    places_list = $('.places-list');
    $(places_list).on('click', '.mediaButton', function(){
        var index = $(this).index('.mediaButton');
        var name = places_array[index].name;
        alert(name);
    });

    input_zipcode = $('#zipcode');
    $('.zipCodeButton').click(zipCodeButtonClicked);

    $('.landingPageButton').click(landingPageButtonClicked);



    $('.followingTweets').click(displayFollowingTweets);    // clears current tweets and displays the next 5 tweets
    $('.precedingTweets').click(displayPrecedingTweets);    // clears current tweets and displays the preceding 5 tweets

    $('.autoLocationButton').click(function() {
        "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyC87SYazc5x5nNq7digLxdNnB3riG_eaVc"
    });
    venue_name = getUrlParameter("name");
    var vicinity = getUrlParameter("vicinity");
    $('.infoVenueName').append(venue_name);
    $(".infoAddress").append(vicinity);
    getAndDisplayFirstTweets(venue_name); // call function to get tweets from Twitter API and display on info.html
    getAndDisplayYTVideos(venue_name);  // call function to get YouTube videos from YouTube API and display on info.html
    // flicker API call begins here
    getAndDisplayFlickrPhotos(venue_name);
});

/**
 * Converts miles to meters
 * @param miles
 * @returns {number}
 */
function milesToMeters(miles) {
    var meters = miles * 1609.34;
    console.log(miles + " miles to " + meters + " meters");
    return meters;
}

/**
 * Creates a Google Map element inside the #map div and
 * @param lat
 * @param long
 * @param radius
 */
function initMap(lat, long, radius) {
    // var lat = 33;
    // var long = -117;
    //var radius = 50000;
    //radius in meters
    var keyword = "music venues";
    if (!radius) {
        radius = 50000;
    } else {
        radius = milesToMeters(radius);
    }
    var original_location = {lat: lat, lng: long};

    //var original_location = {lat: -33.867, lng: 151.195};

    map = new google.maps.Map(document.getElementById('map'), {
        center: original_location,
        zoom: 10
    });

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: original_location,
        radius: radius,
//                type: ['store']
        keyword: "music venues"
    }, callback);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
    console.log(results);
    places_array = results;
    populateList();
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function populateList() {
    var len = places_array.length;
    $(places_list).html("");
    for(var i = 0; i < len; i++) {
        addPlaceToDom(places_array[i]);
    }
}

function addPlaceToDom(placeObj) {
    var name = placeObj.name;
    var vicinity  = placeObj.vicinity;
    var rating  = placeObj.rating;
    var hours = false;
    if (placeObj.opening_hours) {
        hours = placeObj.opening_hours.open_now;
    }
    var tr = $('<tr>');
    var media_button = $('<button type="button" class="btn btn-info mediaButton"><a href="info.html?name=' + name + '&vicinity='+vicinity+' ">Images</a></button>');
    tr.append( $('<td>').html('<a href="#">' + name + '</a>') );
    tr.append( $('<td>').text(vicinity) );
    tr.append( $('<td>').text(hours) );
    tr.append( $('<td>').text(rating) );
    tr.append( $('<td>').append(media_button) );
    tr.appendTo(places_list);

}
//END GOOGLE PLACES API

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

function landingPageButtonClicked() {
    zipcode = input_zipcode.val();
    radius = $('#radius').val();
    console.log('click initiated');
    $.ajax({
        dataType: 'json',
        url: 'http://maps.googleapis.com/maps/api/geocode/json?address='+ zipcode,
        method: "POST",
        success: function(data) {
            console.log('AJAX Success function called, with the following result:', data);
            latitude = data.results[0].geometry.location.lat;
            longitude= data.results[0].geometry.location.lng;
            console.log(data);
            console.log("Lat = "+latitude+"- Long = "+longitude + " - Radius = " +radius);
            document.location.href = "index.html?lat=" + latitude + "&long=" + longitude + "&radius=" + radius;
        }
    });
    console.log('End of click function');
}


function zipCodeButtonClicked() {
    zipcode = input_zipcode.val();
    radius = $('#radius').val();
    console.log('click initiated');
    $.ajax({
        dataType: 'json',
        url: 'http://maps.googleapis.com/maps/api/geocode/json?address='+ zipcode,
        method: "POST",
        success: function(data) {
            console.log('AJAX Success function called, with the following result:', data);
            latitude = data.results[0].geometry.location.lat;
            longitude= data.results[0].geometry.location.lng;
            console.log(data);
            console.log("Lat = "+latitude+"- Long = "+longitude + " - Radius = " +radius);
            initMap(latitude, longitude, radius);
        }
    });
    console.log('End of click function');
}

function getAndDisplayFlickrPhotos(string) {
    $(".container1").show();
    //imageSearch = $("#imageSearch").val();
    imageSearch = string;
    console.log('click initiated' , imageSearch);
    $.ajax({
        dataType: 'json',
        url: "https://api.flickr.com/services/rest?method=flickr.photos.search&api_key=4291af049e7b51ff411bc39565109ce6&format=json&nojsoncallback=1&text=" + imageSearch,
        success: function(result) {
            var server = result.photos.photo[0].server;
            var photoId = result.photos.photo[0].id;
            var secret = result.photos.photo[0].secret;
            var image = $("<img>").attr("src", "https://farm1.staticflickr.com/" + server + "/" + photoId + "_" + secret + ".jpg");
            var photosArray = result.photos.photo;

            for (var i = 0; i < 10 && i < photosArray.length; i++) {
                server = result.photos.photo[i].server;
                photoId = result.photos.photo[i].id;
                secret = result.photos.photo[i].secret;
                image = $("<img>").attr("src", "https://farm1.staticflickr.com/" + server + "/" + photoId + "_" + secret + ".jpg");
                if ( !i ) {
                    var imageDiv = $("<div>").addClass("item active");
                    $("#myCarousel .carousel-inner").append(imageDiv);
                    $(imageDiv).append(image);
                }
                else{
                    imageDiv = $("<div>").addClass("item");
                    $("#myCarousel .carousel-inner").append(imageDiv);
                    $(imageDiv).append(image);
                }
            }
        }
    });
    console.log('End of click function');
}

 function getAndDisplayFirstTweets (Twitter_searchTerm) {
        var photo, picLink;
        tweetNum = 1;

        console.log("in function getAndDisplayFirstTweets");

        $.ajax ({
            dataType:   'json',
            url:        'http://s-apis.learningfuze.com/hackathon/twitter/index.php',
            method:     "POST",
            data: {search_term: Twitter_searchTerm, lat: 34, long: -118, radius: 500},
            success: function(result) {
                console.log("result: ", result);
                console.log('AJAX successfully called');

                var array = result.tweets.statuses;
                var length = array.length;
                totalTweetNum = length;

                for (var j = 0; j < length; j++) {
                    console.log("j: " + j);
                    tweet_storage_array[j] = {};
                    tweet_storage_array[j].urlPic = result.tweets.statuses[j].user.profile_image_url;
                    tweet_storage_array[j].twt = result.tweets.statuses[j].text;
                }
                displayTweets();
                console.log("tweet_storage_array: ", tweet_storage_array);

            }
    });
}

    function displayTweets() {
        var length, photo, picLink, secondNumber, tweet;

        secondNumber = tweetNum + 4;

        if (secondNumber > totalTweetNum) {     // don't want something like "6 to 10 of 8 tweets", want "6 to 8 of 8 tweets"
            secondNumber = totalTweetNum;
        }

        $(".Container2 .twit thead tr th:nth-child(3)").text(tweetNum);
        $(".Container2 .twit thead tr th:nth-child(5)").text(secondNumber);
        $(".Container2 .twit thead tr th:nth-child(7)").text(totalTweetNum);

        for (var w=tweetNum - 1; w < tweetNum + 4 ; w++) {
            $(".Container2 .twit tbody").append($("<tr>"));     // append table row

            for (var v=0; v < 2; ++v) {                         // append 2 columns to the row just created
                $(".Container2 .twit tbody tr:last-child").append($("<td>"));
            }

            picLink = tweet_storage_array[w].urlPic;
            photo = $("<img>", {
                src: picLink
            });
            $(".Container2 .twit tbody tr:last-child td:first-child").append(photo);

            tweet = tweet_storage_array[w].twt;
            $(".Container2 .twit tbody tr:last-child td:nth-child(2)").append(tweet);
        }
    }

    function displayFollowingTweets () {
        tweetNum += 5;
        $("tbody tr").remove();

        if (tweetNum > totalTweetNum) {
            tweetNum = 1;
        }

        displayTweets();
    }

    function displayPrecedingTweets () {
        var remainer;

        tweetNum -= 5;
        $("tbody tr").remove();

        if (tweetNum < 1) {             // if you're already at the 1st 5 tweets, then wrap around to the last tweets
            remainder = totalTweetNum % 5;

            if (remainder === 0) {      // tweetNum always starts at 1, 6, 11, 16, etc.
                tweetNum = totalTweetNum - 4;
            } else {
                tweetNum = totalTweetNum - remainder + 1;
            }
        }

        displayTweets();
    }

function getAndDisplayYTVideos (YT_searchTerm) {
    var title, id_video, vid;
    console.log("in function getAndDisplayYTVideos");

    $.ajax({
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/hackathon/youtube/search.php?',
        method: "POST",
        data: {q: YT_searchTerm, maxResults: 5},
        success: function (result) {
            console.log('AJAX successfully called');
            console.log("result: ", result);

            var array = result.video;
            // var length = array.length;

            for (var j = 0; j < YT_num; j++) {
                console.log("j: " + j);

                title = result.video[j].title;
                id_video = result.video[j].id;
                console.log("id: ", id_video);

                vid = $("<iframe>", {
                    src: "https://www.youtube.com/embed/" + id_video
                });
                if (!j) {
                    var youTubeDiv = $("<div>").addClass("item active");
                    $("#myCarousel2 .carousel-inner").append(youTubeDiv);
                    $(youTubeDiv).append(vid);
                }
                else {
                    youTubeDiv = $("<div>").addClass("item");
                    $("#myCarousel2 .carousel-inner").append(youTubeDiv);
                    $(youTubeDiv).append(vid);
                }
            }
        }
    });
}
