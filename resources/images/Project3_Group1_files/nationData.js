// Set origin and zoom level
let mapCoords = [38.09, -97.71];
let mapZoomLevel = 4.3;


// Make call to json
let path = '../../python/resources/json_datasets/wageInfo.json'
// Use if fecth does not work (CORS Error)
path = 'https://raw.githubusercontent.com/MrGoots/Project_3/main/python/resources/json_datasets/wageInfo.json'

fetch(path).then((response) => response.json()).then(function(data) {
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  createData(data);

});


// Create map
function createMap(employment) {
  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  let satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });


  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo,
    "Satellite Map": satellite
  };

  // Create an overlays object.
  let overlayMaps = {
    "Employement": employment
  };

  // Create a new map.
  let myMap = L.map("map", {
    center: mapCoords,
    zoom: mapZoomLevel,
    layers: [street, employment]
  });

  L.control.layers(baseMaps, overlayMaps).addTo(myMap);

  // Create legend for map 
  let legend = L.control({
    position: 'bottomright'
  });
  legend.onAdd = function(map) {

    let div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<i style="background: rgb(255,95,101)"></i><65k<br>';
    div.innerHTML += '<i style="background: rgb(252,163,93)"></i>65k-70k<br>';
    div.innerHTML += '<i style="background: rgb(253,183,42)"></i>70k-75k<br>';
    div.innerHTML += '<i style="background: rgb(247,219,17)"></i>75k-80k<br>';
    div.innerHTML += '<i style="background: rgb(220,244,0)"></i>80k-85k<br>';
    div.innerHTML += '<i style="background: rgb(163,246,0)"></i>85k+<br>';

    return div;
  };

  legend.addTo(myMap);
  console.log(myMap)


};

// Create layer to pass into map
function createData(employData) {
  let employment = [];
  console.log(employData)
  for (i = 0; i < employData.length; i++) {
    lat = employData[i].latitude;
    long = employData[i].longitude;
    entry = L.circle([lat, long], {
      stroke: true,
      fillOpacity: 0.5,
      weight: 0.5,
      color: 'black',
      fillColor: wageColor(employData[i].PREVAILING_WAGE_CALCULATED),
      radius: (employData[i].LISTING_CNT ** .25) * 10000
    })
    entry.bindPopup(`<h3>${employData[i].name}</h3> <p>
        Four Year Count: ${employData[i].LISTING_CNT}<br>
        Median Wage: ${employData[i].PREVAILING_WAGE_CALCULATED}<br>
        </p>`);
    employment.push(entry);

  };
  employmentLayer = L.layerGroup(employment);

  createMap(employmentLayer);

};

// Return color based on wage
function wageColor(wage) {
  if (wage < 65000) {
    return 'rgb(255,95,101)'
  } else if (wage < 70000) {
    return 'rgb(252,163,93)'
  } else if (wage < 75000) {
    return 'rgb(253,183,42)'
  } else if (wage < 80000) {
    return 'rgb(247,219,17)'
  } else if (wage < 85000) {
    return 'rgb(220,244,0)'
  } else {
    return 'rgb(163,246,0)'
  }
};