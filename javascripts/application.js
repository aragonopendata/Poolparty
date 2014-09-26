var position = [42.571716599999990000, -0.547055399999976500];

function showGoogleMaps() {

  var latLng = new google.maps.LatLng(position[0], position[1]);

  var mapOptions = {
    zoom: 13,
    streetViewControl: false, // hide the yellow Street View pegman
    scaleControl: true, // allow users to zoom the Google Map
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: latLng,
    draggable: true
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}

google.maps.event.addDomListener(window, 'load', showGoogleMaps);

function toggleDashboard(){
  $(this).parents('.dashboard').children('div').each(function() {
    $(this).fadeToggle();
  });
};

$(document).ready(function(){
  $('.info').hide();

  $('.icon-info').on('click', toggleDashboard);
});
