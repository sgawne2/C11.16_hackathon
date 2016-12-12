/* Sean, Miles, Mike, Vernon    Music Venue     Hack-a-thon     December 12-13, 2016    */




var zipcode;

$(document).ready(function(){


    $('button').click(function(){
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
});