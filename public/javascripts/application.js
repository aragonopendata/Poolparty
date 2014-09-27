
function showGoogleMaps(position) {
  if(position){
    var latLng = new google.maps.LatLng(position[0], position[1]);

    var mapOptions = {
      zoom: 12,
      streetViewControl: false, // hide the yellow Street View pegman
      scaleControl: true,       // allow users to zoom the Google Map
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false,
      center: latLng
    };

    new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }
}

function toggleDashboard(){
  var divVisible = $(this).parents('.dashboard').children('div:visible:first');
  var divInvisible = $(this).parents('.dashboard').children('div:hidden:first');
  $(divVisible).fadeToggle('fast', function(){
    $(divInvisible).fadeToggle();
  });
};

$(document).ready(function(){
  $('.info').hide();

  $('.icon-info').on('click', toggleDashboard);

  var location = $('#map-canvas').data('location');
  var position = [];

  var url = "http://jacathon-huracan.cartodb.com/api/v2/sql?q=SELECT%20ST_X(ST_Centroid(the_geom::geometry)),ST_Y(ST_Centroid(the_geom::geometry))%20FROM%20esp_adm4%20WHERE%20name_4=%27" + location + "%27"
  jQuery.get(url, function(data){
    position[0] = data.rows[0].st_y;
    position[1] = data.rows[0].st_x;
    showGoogleMaps(position);
  });

});
