// INITIALIZE MAP
  var map;
  var locMarkers = [];
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 51.375801, lng: -2.3599039},
      zoom: 15
    });
    var locInfoWindow = new google.maps.InfoWindow();
    var locSights = [
      {title: 'Pulteney Bridge', location: {lat: 51.3831297, lng: -2.3576228}},
      {title: 'The Roman Baths', location: {lat: 51.3809407, lng: -2.3593905}}
    ];
    for (var i = 0; i < locSights.length; i++) {
          var position = locSights[i].location;
          var title = locSights[i].title;
          var locMarker = new google.maps.Marker({
            map: map,
            title: title,
            position: position,
            animation: google.maps.Animation.DROP,
            id: i
          });
          locMarkers.push(locMarker);
          locMarker.addListener('click', function() {
            locInfoWindow.setContent(this.title);
            locInfoWindow.open(map, this);
          });
     };
  };

// INFO DRAWER
  var listBoxToggle = document.getElementById('toggler');
  var mapBox = document.getElementById('map');
  var listBox = document.getElementById('list-box');
  if(listBoxToggle) {
    listBoxToggle.addEventListener('click', function() {
          mapBox.classList.toggle('map-small');
          listBox.classList.toggle('l-box-show');
          if (listBoxToggle.innerHTML == "+") {
            listBoxToggle.innerHTML = "-";
          }
          else {
            listBoxToggle.innerHTML = "+";
          };
        });
    };

// INFO DRAWER VIEWMODEL
  
