mapboxgl.accessToken = 'pk.eyJ1IjoiYmFwdGlzdGVsciIsImEiOiJjbTczNjVxODAwNXc1MmpzNmxzZnlwcnoxIn0.6GA4OBEpTW9PN1bQKtwffw';

const map = new maplibregl.Map({
  container: 'map',
  style: "maplibregl://styles/maplibregl/outdoors-v12",
  center: [-1.669099, 48.114799],
  zoom: 11.5
});

// Fonction pour ajouter la couche des routes
function addLayer() {
 map.addSource('maplibregl-streets-v8', {
    type: 'vector',
    url: 'https://openmaptiles.geo.data.gouv.fr/data/france-vector.json'
  });

  map.addLayer({
    "id": "Routes",
    "type": "line",
    "source": "maplibregl-streets-v8",
    "layout": { 'visibility': 'visible' },
    "source-layer": 'transportation',
    "filter": ["all",  ["in", "class", "motorway", "trunk", "primary"]],
    "paint": { "line-color": "red", "line-width": 1 },
    "maxzoom": 14
  }, map.getStyle().layers[map.getStyle().layers.length - 1].id);
 
  
  ///eau 
  map.addLayer({
    "id": "eau",
    "type": "fill",
    "source": "maplibregl-streets-v8",
    "layout": { 'visibility': 'visible' },
    "source-layer": "water",
    "paint": { "fill-color": '#219EBC'}
  }, map.getStyle().layers[map.getStyle().layers.length - 1].id);
 

  // Ajout Batiment
map.addSource(
  'BDTOPO', {
    type: 'vector',
    url: 'https://data.geopf.fr/tms/1.0.0/BDTOPO/metadata.json',
    minzoom: 15,
    maxzoom: 19
    }
             );
  
map.addLayer({
    'id': 'batiments',
    'type': 'fill-extrusion',
    'source': 'BDTOPO',
    'source-layer': 'batiment',
    'paint': {
      'fill-extrusion-color':{
        property:'hauteur',

'stops': [[1, '#1a9850'],
[10, '#91cf60'],
[20, '#d9ef8b'],
[50, '#ffffbf'],
[100, '#fee08b'],
[150, '#fc8d59'],
[200, '#d73027']
  ]
},
      'fill-extrusion-height':{'type': 'identity','property': 'hauteur'},
'fill-extrusion-opacity': 0.90,
'fill-extrusion-base': 0},
 'layout': {'visibility': 'visible'}
});
   
     // arrets bus
  map.addSource('Arrets', {
    type: 'vector',
    url: 'maplibregl://ninanoun.58widelk'});

  map.addLayer({
    'id': 'Arrets',
    'type': 'circle',
    'source': 'Arrets',
    'source-layer': 'Bus-5ypx1k',
    'layout': {'visibility': 'none'},
    'paint': {'circle-radius': {'base': 1.5,'stops': [[13, 2], [22, 60]]}, 'circle-color': '#f31616',}, minzoom:12
  });
 
  
 
  //Proprietes
  map.addSource('Proprietes', {
    type: 'vector',
    url: 'maplibregl://ninanoun.a4kdgiot'
  });
  map.addLayer({
    'id': 'Proprietes',
    'type': 'line',
    'source': 'Proprietes',
    'source-layer': 'limites_proprietes',
    'layout': {'visibility': 'none',
    'line-join': 'round','line-cap': 'round'},
    'paint': {'line-color': '#FFFFFF', 'line-width': 0.5},
    "minzoom": 16
  });

 
 
 
 
 
  // AJOUT DU CADASTRE ETALAB
  map.addSource('Cadastre', {
    type: 'vector',
    url: 'https://openmaptiles.geo.data.gouv.fr/data/cadastre.json'
  });
 
  map.addLayer({
    'id': 'Cadastre',
    'type': 'line',
    'source': 'Cadastre',
    'source-layer': 'parcelles',
    'layout': {'visibility': 'none'},
    'paint': {'line-color': '#000000'},
    'minzoom':16,
    'maxzoom':19
  });
 
   //metro
  map.addSource('metro', {
    type: 'geojson',
    data: 'data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/metro-du-reseau-star-traces-de-laxe-des-lignes/records?limit=100'
  });
  map.addLayer({
    'id': 'metro_rennes',
    'type': 'line',
    'source': 'metro',
    'layout': {'visibility': 'visible',
    'line-join': 'round','line-cap': 'round'},
    'paint': {'line-color': '#FFFFFF', 'line-width': 0.5}
  });
 
  // Contour commune
  
 dataCadastre = 'https://apicarto.ign.fr/api/cadastre/commune?code_insee=35238';
jQuery.when( jQuery.getJSON(dataCadastre)).done(function(json) {
for (i = 0; i < json.features.length; i++) {
json.features[i].geometry = json.features[i].geometry;
};
map.addLayer(
{'id': 'Contourcommune',
'type':'line',
'source': {'type': 'geojson','data': json},
'paint' : {'line-color': 'black',
'line-width':2.5},
'layout': {'visibility': 'none'}
});
});
  
  // Parkings relais
  
  $.getJSON(
    'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/tco-parcsrelais-star-etat-tr/records?limit=20',
    function(data) {
      var geojsonData4 = {
        type: 'FeatureCollection',
        features: data.results.map(function(element) {
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [
                element.coordonnees.lon, 
                element.coordonnees.lat
              ]},
            properties: {
              name: element.nom,
              capacity: element.jrdinfosoliste
            }
          };
        })
      };
      map.addLayer({
        'id': 'Parcrelais',
        'type':'circle',
        'source': {
          'type': 'geojson',
          'data': geojsonData4
        },
        'paint': {
          'circle-color': 'orange',
                    'circle-stroke-color': 'blue',
          'circle-stroke-width':0.1,
                    'circle-radius': {
            property: 'capacity',
                  type: 'exponential',
                  stops: [[1, 5],[500, 20]]
                },
          'circle-opacity': 0.8
        }
      });
    }
  );
    
  // velo star
  
   $.getJSON(
     'https://data.explore.star.fr/api/explore/v2.1/catalog/datasets/vls-stations-etat-tr/records?limit=60',
     function(data) {
       var geojsonVLS = {
         type: 'FeatureCollection',
         features: data.results.map(function(element) {
return {type: 'Feature',
geometry: {type: 'Point',
coordinates: [element.coordonnees.lon, element.coordonnees.lat]},
properties: { name: element.nom,
emplacements: element.nombreemplacementsdisponibles,
            velos : element.nombrevelosdisponibles}};
})
};
map.addLayer({ 'id': 'station',

'type':'circle',
'source': {'type': 'geojson',
'data': geojsonVLS},
'paint': {'circle-color': 'purple'},
 'layout': {'visibility': 'none'}
});
});
  
  /// bus star
 $.getJSON('https://data.explore.star.fr/api/explore/v2.1/catalog/datasets/tco-bus-vehicules-position-tr/records?limit=50',
function(data) {var geojsonbus = {
type: 'FeatureCollection',
features: data.results.map(function(element) {
return {type: 'Feature',
geometry: {type: 'Point',
coordinates: [element.coordonnees.lon, element.coordonnees.lat]},
properties: { name: element.nom,
emplacements: element.nombreemplacementsdisponibles,
            velos : element.nombrevelosdisponibles}};
})
};
                
map.addSource('Arrets', {
type: 'vector',
url: 'maplibregl://ninanoun.7mtp5buo'});                
                
                
map.addLayer(
  { 
    'id': 'ligne',
    'type':'symbol',
    'source': {'type': 'geojson',
    'data': geojsonbus},
    'layout': {
    'visibility': 'none',
    'icon-image': 'bus',
      'icon-size': 1.5},
              
});
});
  
  // API overpass
  
  const ville = "Rennes";
  $.getJSON(`https://overpass-api.de/api/interpreter?data=[out:json];area[name="${ville}"]->.searchArea;(node["amenity"="bar"](area.searchArea););out center;`,
function(data) {var geojsonData = {
type: 'FeatureCollection',
features: data.elements.map(function(element) {
return {type: 'Feature',
geometry: { type: 'Point',coordinates: [element.lon, element.lat] },
properties: {}};
})
};
map.addSource('customData', {
type: 'geojson',
data: geojsonData
});
map.addLayer({
'id': 'pubs',
'type': 'circle',
'source': 'customData',
'paint': {'circle-color': 'green',
'circle-radius': 4},
'layout': {'visibility': 'none'}
});
});
  
       switchlayer = function (lname) 
       {
            if (document.getElementById(lname + "CB").checked) 
            {
                map.setLayoutProperty(lname, 'visibility', 'visible');
            } else {
                map.setLayoutProperty(lname, 'visibility', 'none');
           }
        }
 
  /// FIN DU MAP ON
}

// Ajoute la couche des routes au chargement initial
map.on('load', addLayer);

// Gestion du changement de style
document.getElementById('style-selector').addEventListener('change', function () {
  map.setStyle(this.value);
  map.once('style.load', addLayer); // Réapplique la couche après le changement de style
});

// Ajout Marqueur
const marker1 = new maplibregl.Marker()
  .setLngLat([-1.67459, 48.11299])
  .addTo(map);

// Contenu de la popup du marqueur
var popup = new maplibregl.Popup({ offset: 25 })
  .setHTML("<h3>Square de la Motte</h3><p>Joyeux anniversaire !</p><img src='https://www.wiki-rennes.fr/images/thumb/3/3d/Le_square_de_la_Motte.png/500px-Le_square_de_la_Motte.png' width=140/>");

// Associer Contenu et Marqueur
marker1.setPopup(popup);

// Boutons de navigation
var nav = new maplibregl.NavigationControl();
map.addControl(nav, 'top-left');

// Ajout Échelle cartographique
map.addControl(new maplibregl.ScaleControl({
  maxWidth: 120,
  unit: 'metric'
}));

// Bouton de géolocalisation
map.addControl(new maplibregl.GeolocateControl({
  positionOptions: { enableHighAccuracy: true },
  trackUserLocation: true,
  showUserHeading: true
}));



//// INTERACTIVITE


//Interactivite CLICK parc relais


map.on('click', function (e) {
var features = map.queryRenderedFeatures(e.point, { layers: ['Parcrelais'] });
if (!features.length) {
return;
}
var feature = features[0];
var popup = new maplibregl.Popup({ offset: [0, -15] })
.setLngLat(feature.geometry.coordinates)
.setHTML('<h2>' + feature.properties.name + '</h2><hr><h3>'

+"Parcrelais : " + feature.jrdinfosoliste + '</h3><p>'
+"Accessibilité PMR : " + feature.properties.estaccessiblepmr + '</p>' )

.addTo(map);

});
map.on('mousemove', function (e) {
var features = map.queryRenderedFeatures(e.point, { layers: ['Parcrelais'] });
map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});




//Interactivite HOVER velo


var popup = new maplibregl.Popup({
closeButton: false,
closeOnClick: false });
map.on('mousemove', function(e) {
var features = map.queryRenderedFeatures(e.point, { layers: ['station'] });
// Change the cursor style as a UI indicator.
map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
if (!features.length) {
popup.remove();
return;
}
var feature = features[0];
popup.setLngLat(feature.geometry.coordinates)
.setHTML('</h2>'+ feature.properties.name + '</h2><hr><h3>'
  + feature.nombreemplacementsdisponibles + 'velos <h3>')
.addTo(map);

});




/// arret de BUS

var popup = new maplibregl.Popup({
closeButton: false,
closeOnClick: false });
map.on('mousemove', function(e) {
var features = map.queryRenderedFeatures(e.point, { layers: ['station'] });
// Change the cursor style as a UI indicator.
map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
if (!features.length) {
popup.remove();
return;
}
var feature = features[0];
popup.setLngLat(feature.geometry.coordinates)
.setHTML('</h2>'+ feature.properties.name + '</h2><hr><h3>'
  + feature.nombreemplacementsdisponibles + 'velos <h3>')
.addTo(map);

});




// Configuration onglets geographiques 

//// GARE


document.getElementById('Gare').addEventListener('click', function ()
      {
  map.flyTo({zoom: 16,

center: [-1.672, 48.1043],
pitch: 30});

});


//// Rennes2

document.getElementById('Rennes2').addEventListener('click', function ()
      {
  map.flyTo({zoom: 16,

center: [-1.70334, 48.11915],
pitch: 30,});

});


//// Rennes1

document.getElementById('Rennes1').addEventListener('click', function ()
      {
  map.flyTo({zoom: 16,

center: [-1.64395, 48.11935],
pitch: 30,});

});