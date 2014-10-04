
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
  $('input').focus();

  $('.info').hide();

  $('.icon-info').on('click', toggleDashboard);

  if($('#map-canvas').length > 0){
    var position = [$('#map-canvas').data('lon'), $('#map-canvas').data('lat')];
    showGoogleMaps(position);
  }
});
