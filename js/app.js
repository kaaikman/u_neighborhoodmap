// INITIALIZE MAP
  var map;
  var locAllMarkers = [];
  var locSightsMarkers = [];
  var locLodgingMarkers = [];
  var locDisplayedMarkers = locAllMarkers;


  // Array to hold all locations and individual type arrays for categorizing
  var locTypes = [];
  var locAll = [];
  var locSights = [
    {title: 'Pulteney Bridge', location: {lat: 51.3831297, lng: -2.3576228}},
    {title: 'The Roman Baths', location: {lat: 51.3809407, lng: -2.3593905}}
  ];
  locTypes.push(locSights);
  var locLodging = [
    {title: 'SACO Bath', location: {lat: 51.3793877, lng: -2.3606299}}
  ];
  locTypes.push(locLodging);
  locAll = locAll.concat(locSights, locLodging);


  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 51.375801, lng: -2.3599039},
      zoom: 15
    });
    var locInfoWindow = new google.maps.InfoWindow();
    // // Array to hold all locations and individual type arrays for categorizing
    // var locTypes = [];
    // var locSights = [
    //   {title: 'Pulteney Bridge', location: {lat: 51.3831297, lng: -2.3576228}},
    //   {title: 'The Roman Baths', location: {lat: 51.3809407, lng: -2.3593905}}
    // ];
    // locTypes.push(locSights);
    // var locLodging = [
    //   {title: 'SACO Bath', location: {lat: 51.3793877, lng: -2.3606299}}
    // ];
    // locTypes.push(locLodging);
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
                locAllMarkers.push(locMarker);
                locSightsMarkers.push(locMarker);
                break;
              case 1:
                locAllMarkers.push(locMarker);
                locLodgingMarkers.push(locMarker);
                break;
              default:
                locAllMarkers.push(locMarker);
            };
            locMarker.addListener('click', function() {
              locInfoWindow.setContent(this.title);
              locInfoWindow.open(map, this);
            });
       };
     };
    //  console.log(locAllMarkers);
  };

function NMViewModel() {
  var self = this;
  self.locTypeSelect = ko.observableArray(['All', 'Sights', 'Lodging']);
  self.locTypeSelected = ko.observable('All');
  self.locsSelected = ko.observableArray(locAll);
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
  self.locsSelectedSet = function() {
    switch(self.locTypeSelected()) {
      case 'All': self.locsSelected(locAll); break;
      case 'Sights': self.locsSelected(locSights); break;
      case 'Lodging': self.locsSelected(locLodging); break;
      default: self.locsSelected(locAll);
    };
  };
};

ko.applyBindings(new NMViewModel());

// INFO DRAWER VIEWMODEL

// function filterMarkers(type) {
//         var buildMarkerArray = window['loc' + type + 'Markers'];
//         console.log(buildMarkerArray);
//         for (var i = 0; i < buildMarkerArray.length; i++) {
//           console.log(buildMarkerArray.length);
//           buildMarkerArray[i].setMap(null);
//         }
// };
function filterMarkers(type) {
        for (var cM = 0; cM < locDisplayedMarkers.length; cM++) {
          locDisplayedMarkers[cM].setMap(null);
        };
        var buildMarkerArray = window['loc' + type + 'Markers'];
        locDisplayedMarkers = buildMarkerArray;
        for (var dM = 0; dM < locDisplayedMarkers.length; dM++) {
          locDisplayedMarkers[dM].setMap(map);
        }
};
