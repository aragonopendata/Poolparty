var position = [42.571716599999990000, -0.547055399999976500];

function showGoogleMaps() {

  var latLng = new google.maps.LatLng(position[0], position[1]);

  var mapOptions = {
    zoom: 14,
    streetViewControl: false, // hide the yellow Street View pegman
    scaleControl: true,       // allow users to zoom the Google Map
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: latLng
  };

  new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
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

  showGoogleMaps();
});
