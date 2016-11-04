// INITIALIZE MAP
  var map;
  var locMarkers = [];
  var locSightsMarkers = [];
  var locLodgingMarkers = [];
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 51.375801, lng: -2.3599039},
      zoom: 15
    });
    var locInfoWindow = new google.maps.InfoWindow();
    // Array to hold all locations and individual type arrays for categorizing
    var locTypes = [];
    var locSights = [
      {title: 'Pulteney Bridge', location: {lat: 51.3831297, lng: -2.3576228}},
      {title: 'The Roman Baths', location: {lat: 51.3809407, lng: -2.3593905}}
    ];
    locTypes.push(locSights);
    var locLodging = [
      {title: 'SACO Bath', location: {lat: 51.3793877, lng: -2.3606299}}
    ];
    locTypes.push(locLodging);
    for (var aI = 0; aI < locTypes.length; aI++) {
      for (var i = 0; i < locTypes[aI].length; i++) {
            var position = locTypes[aI][i].location;
            var title = locTypes[aI][i].title;
            var locMarker = new google.maps.Marker({
              map: map,
              title: title,
              position: position,
              animation: google.maps.Animation.DROP,
              id: i
            });
            switch (aI) {
              case 0:
                locMarkers.push(locMarker);
                locSightsMarkers.push(locMarker);
                break;
              case 1:
                locMarkers.push(locMarker);
                locLodgingMarkers.push(locMarker);
                break;
              default:
                locMarkers.push(locMarker);
            };
            locMarker.addListener('click', function() {
              locInfoWindow.setContent(this.title);
              locInfoWindow.open(map, this);
            });
       };
     };
  };

function NMViewModel() {
  this.idIcon = ko.observable('+');
  this.idOpen = ko.observable(false);
  this.openID = function() {
    this.idOpen(!this.idOpen());
    if (this.idIcon() == '+') {
      this.idIcon('-');
    } else {
      this.idIcon('+');
    };
  };
};

ko.applyBindings(new NMViewModel());

// INFO DRAWER VIEWMODEL

document.getElementById('hide-sights').addEventListener('click', hideSights);
function hideSights() {
        for (var i = 0; i < locSightsMarkers.length; i++) {
          locSightsMarkers[i].setMap(null);
        }
      }
