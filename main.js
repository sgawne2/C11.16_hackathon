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


