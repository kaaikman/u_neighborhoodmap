// INITIALIZE MAP
  var map;
  var locAllMarkers = [];
  var locSightsMarkers = [];
  var locLodgingMarkers = [];
  var locFoodMarkers = [];
  var locDisplayedMarkers = locAllMarkers;


  // Array to hold all locations and individual type arrays for categorizing
  var locTypes = [];
  var locAll = [];
  var locSights = [
    {title: 'Prior Park', location: {lat: 51.36669, lng: -2.341332}, fsID: '4bb88fedcf2fc9b6fb9d9f02'},
    {title: 'The Roman Baths', location: {lat: 51.3809407, lng: -2.3593905}, fsID: '4b6d7961f964a520db762ce3'},
    {title: 'The Royal Crescent', location: {lat: 51.3872644, lng: -2.3681693}, fsID: '4c7e2ce55af8b60cae969110'}
  ];
  locTypes.push(locSights);
  var locLodging = [
    {title: 'The Bath Priory', location: {lat: 51.39011439999999, lng: -2.3824621}, fsID: '4b9a07cbf964a520bb9b35e3'},
    {title: 'The Gainsborough Bath Spa Hotel', location: {lat: 51.380272, lng: -2.361003}, fsID: '5596cad5498e32a68a99a295'},
    {title: 'Hilton Bath City', location: {lat: 51.384326, lng: -2.359279}, fsID: '4bc8edff762beee19ab63d38'}
  ];
  locTypes.push(locLodging);
  var locFood = [
    {title: 'Sotto Sotto', location: {lat: 51.380634, lng: -2.356589}, fsID: '4f259508e4b0e12082cf23cb'},
    {title: 'Graze', location: {lat: 51.37746, lng: -2.35771}, fsID: '50c242a1e4b09f38abc2a32f'},
    {title: 'Acorn Vegetarian Kitchen', location: {lat: 51.380756, lng: -2.358394}, fsID: '4bd04fe9b221c9b65765d3d0'}
  ];
  locTypes.push(locFood);
  locAll = locAll.concat(locSights, locLodging, locFood);


  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 51.375801, lng: -2.3599039},
      zoom: 15
    });
    mcf = map.getCenter();
    ko.applyBindings(new NMViewModel());
  };

  function NMViewModel() {
    var self = this;

    var locInfoWindow = new google.maps.InfoWindow();
    for (var aI = 0; aI < locTypes.length; aI++) {
      for (var i = 0; i < locTypes[aI].length; i++) {
            var selfRef = locTypes[aI][i];
            var position = locTypes[aI][i].location;
            var title = locTypes[aI][i].title;
            var locMarker = new google.maps.Marker({
              map: map,
              title: title,
              position: position,
              // pImg: PlacePhoto.getUrl(),
              selfRef: selfRef,
              animation: google.maps.Animation.DROP,
              id: i
            });
            locTypes[aI][i].marker = locMarker;
            switch (aI) {
              case 0:
                locAllMarkers.push(locMarker);
                locSightsMarkers.push(locMarker);
                break;
              case 1:
                locAllMarkers.push(locMarker);
                locLodgingMarkers.push(locMarker);
                break;
              case 2:
                locAllMarkers.push(locMarker);
                locFoodMarkers.push(locMarker);
                break;
              default:
                locAllMarkers.push(locMarker);
            };
            locMarker.addListener('click', function(data) {
              fourSquare(this.selfRef);
              // locInfoWindow.setContent(this.title);
              // locInfoWindow.open(map, this);
              var self = this;
              self.setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(function() {
                  self.setAnimation(null);
              }, 600);
            });
       };
       markerBounds();
     };

    self.locTypeSelect = ko.observableArray(['All', 'Sights', 'Lodging', 'Food']);
    self.locTypeSelected = ko.observable('All');
    self.locsSelected = ko.observableArray(locAll);
    self.idIcon = ko.observable('+');
    self.idOpen = ko.observable(false);
    self.openID = function() {
      self.idOpen(!this.idOpen());
      if (self.idIcon() == '+') {
        self.idIcon('-');
      } else {
        self.idIcon('+');
      };
      // markerBounds();
      setTimeout(markerBounds, 303);
    };
    self.locsSelectedSet = function() {
      switch(self.locTypeSelected()) {
        case 'All': self.locsSelected(locAll); break;
        case 'Sights': self.locsSelected(locSights); break;
        case 'Lodging': self.locsSelected(locLodging); break;
        case 'Food': self.locsSelected(locFood); break;
        default: self.locsSelected(locAll);
      };
      filterMarkers(self.locTypeSelected());
    };

    // self.testllama = function() {
    //   markerBounds();
    // };

    self.highlightMarker = function(object) {
            var marker = object.marker;
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 600);
            fourSquare(object);
            // placesImg(object);
            // var content = fourSquare(object);
            // locInfoWindow.setContent(object.title + '<br/>' + content);
            // locInfoWindow.open(map, marker);
        };

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

    function fourSquare(loc) {
      var fSLink = 'https://api.foursquare.com/v2/venues/'
                    + loc.fsID
                    + '?client_id=FQCEACSH5BBV2BQRYOW44DA0W02J2B40JLZRRMQ0V3XVMZ3I&client_secret=ZKBND1BGYZTNOI3EJH014BUE5VPQDGKSSE1PI2GRMYJJ5VKD&v=20161111';
      var fsRate;
      $.getJSON(fSLink)
      .done(function(data, status) {
        fsRate = data.response.venue.rating;
        locInfoWindow.setContent(loc.title + '<br/>' + fsRate + '/10');
        locInfoWindow.open(map, loc.marker);
        var fSImgTag = data.response.venue.photos.groups[0].items[0];
        var pietest = data.response.venue.photos.groups[0].items[0].prefix;
        var pietest2 = data.response.venue.photos.groups[0].items[0].suffix;
        var pietest3 = fSImgTag.prefix + '500x300' + fSImgTag.suffix;
        var pietest4 = 'Source: ' + fSImgTag.user.firstName + ' ' + fSImgTag.user.lastName;
        self.placesImg(pietest3, pietest4);
      });
    };

    self.placeImg = ko.observable('<img src="https://lh5.googleusercontent.com/proxy/6F-Y7c0MfrXopNCV4P23h3ZKuNiGLdFN7NHe2Cg0VUEZAz5nRrIIrBWFKxH3-zGmkevZDukEakeWaPaXXE_Hb2_KyKbkoYg=w408-h275"></img>');
    self.placesImg = function(pImg, pSrc) {
      self.placeImg('<img src="' + pImg + '" title="' + pSrc + '"></img>');
    };

    function markerBounds() {
        google.maps.event.trigger(map, 'resize');

        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < locAllMarkers.length; i++) {
          bounds.extend(locAllMarkers[i].position);
        }
        map.fitBounds(bounds);
    };
  };
