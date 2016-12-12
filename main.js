/* Sean, Miles, Mike, Vernon    Music Venue     Hack-a-thon     December 12-13, 2016    */


var zipcode;
var imageSearch;

$(document).ready(function(){
    $('.zipCodeButton').click(function(){
        zipcode = $('.zipcode').val();
        console.log('click initiated');
        $.ajax({
            dataType: 'json',
            url: 'http://maps.googleapis.com/maps/api/geocode/json?address='+ zipcode,
            method: "POST",
            success: function(data) {
                console.log('AJAX Success function called, with the following result:', data);
                latitude = data.results[0].geometry.location.lat;
                longitude= data.results[0].geometry.location.lng;
                alert("Lat = "+latitude+"- Long = "+longitude);
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
//         console.log("button clicked");
//         $.ajax({
//             dataType:   'json',
//             url:    'http://s-apis.learningfuze.com/hackathon/youtube/search.php?q=The Copper Door&maxResults=12',
//             method: "POST",
//             success: function(result) {
//                 array = result.video;
//                 length = array.length
//
//                 console.log('AJAX successfully called');
//                 var abc;
//                 for (var i=0, i < length) {
//
//                 }
//                 abc = result.video[1].title;
//
//                 {"title":"Private Dining at Copper Door Restaurant","id":"E_0k-gceifk"}
//             }
//         });
//     });

});


