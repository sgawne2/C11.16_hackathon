/* Sean, Miles, Mike, Vernon    Music Venue     Hack-a-thon     December 12-13, 2016    */

//START GOOGLE PLACES API
var zipcode;
var imageSearch;

var map;
var infowindow;
var places_array = [];
var places_list;

function initMap(lat, long, radius) {
    // var lat = 33;
    // var long = -117;
    //var radius = 50000;
    //radius in meters
    var keyword = "music venues";

    var original_location = {lat: lat, lng: long};

    //var original_location = {lat: -33.867, lng: 151.195};

    map = new google.maps.Map(document.getElementById('map'), {
        center: original_location,
        zoom: 5
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
    var delete_button = $('<button type="button" class="btn btn-info">Images</button>');
    tr.append( $('<td>').text(name) );
    tr.append( $('<td>').text(vicinity) );
    tr.append( $('<td>').text(hours) );
    tr.append( $('<td>').text(rating) );
    tr.append( $('<td>').append(delete_button) );
    tr.appendTo(places_list);
}
//END GOOGLE PLACES API


$(document).ready(function(){
    $('.zipCodeButton').click(function(){
        zipcode = $('#zipcode').val();
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
                alert("Lat = "+latitude+"- Long = "+longitude + " - Radius = " +radius);
                initMap(latitude, longitude, radius);
            }
        });
        console.log('End of click function');
    });
    // flicker API call begins here
    
      $('.photosButton').click(function(){
            imageSearch = $("#imageSearch").val();
            console.log('click initiated');
            $.ajax({
                dataType: 'json',
                url: "https://api.flickr.com/services/rest?method=flickr.photos.search&api_key=4291af049e7b51ff411bc39565109ce6&format=json&nojsoncallback=1&text=" + imageSearch,
                success: function(result) {
                    var server = result.photos.photo[0].server;
                    var photoId = result.photos.photo[0].id;
                    var secret = result.photos.photo[0].secret;
                    var image = $("<img>").attr("src", "https://farm1.staticflickr.com/" + server + "/" + photoId + "_" + secret + ".jpg");
                    var photosArray = result.photos.photo;

                    for (var i = 0; i < 10 && photosArray.length ; i++) {
                        server = result.photos.photo[i].server;
                        photoId = result.photos.photo[i].id;
                        secret = result.photos.photo[i].secret;
                        var image = $("<img>").attr("src", "https://farm1.staticflickr.com/" + server + "/" + photoId + "_" + secret + ".jpg");
                        $('body').append(image);
                    }
                }
            });
            console.log('End of click function');
        });


// $('.youTubeButton').click(function() {
//                     console.log("button clicked");
//                     $.ajax({
//                         dataType:   'json',
//                         url:    'http://s-apis.learningfuze.com/hackathon/youtube/search.php?',
//                         method: "POST",
//                         data: {q: "The Observatory", maxResults: 12 },
//                         success: function(result) {
//                             console.log("result: ", result);
//                             var array = result.video;
//                             var length = array.length;
//                             var jkl, mno, pqr;
//
//                             console.log('AJAX successfully called');
//
//                             for (var j=0; j < length; j++) {
//                                 console.log("j: " + j);
//
//                                 jkl = result.video[j].title;
//                                 $("main").append(jkl);
//                                 $("main").append("<br>");
//
//                                 mno = result.video[j].id;
//                                 console.log("id: ", mno);
//
//                                 pqr = $("<iframe>", {
//                                     src: "https://www.youtube.com/embed/" + mno
//                                 });
//
//                                 $("main").append(pqr);
//                                 $("main").append("<br>");
//
//                             }
//             }
//         });
//     });

    //initMap();
    places_list = $('.places-list');
    $('.youTubeButton').click(function() {
        console.log("button clicked");
        $.ajax({
            dataType:   'json',
            url:    'http://s-apis.learningfuze.com/hackathon/twitter/index.php',
            method: "POST",
            data: {search_term: "Fuck", lat: 35, long: -120, radius: 5000 },
            success: function(result) {
                console.log("result: ", result);
                var array = result.tweets.statuses;
                var length = array.length;
                var abc, def, ghi;

                console.log('AJAX successfully called');

                for (var j=0; j < length; j++) {
                    console.log("j: " + j);
                    abc = result.tweets.statuses[j].text;
                    $("main").append(abc);
                    $("main").append("<br>");

                    def = result.tweets.statuses[j].user.profile_image_url;
                    console.log("def: ", def);

                    ghi = $("<img>",{src: def});
                    $("main").append(ghi);
                    $("main").append("<br>");
                }
            }
        });
    });
});


