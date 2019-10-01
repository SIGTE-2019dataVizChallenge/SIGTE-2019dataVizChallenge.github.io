var map = L.map('map').setView([41.403081, 2.177954], 14);


//var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<\/a> contributors'
//}).addTo(map);

//var osmLayer = L.tileLayer.mbTiles('http://localhost/app/temperatura_barcelona/countries-raster.mbtiles').addTo(map);
//var lst = L.tileLayer.mbTiles('./LST.mbtiles', {
  //minZoom: 0,
  //maxZoom: 22
//}).addTo(map);


//var lst = L.tileLayer('https://api.mapbox.com/styles/v1/josepsitjar/ck0hx14503xd21ck0oanm5cqv/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9zZXBzaXRqYXIiLCJhIjoiNXhaUDE0byJ9.f72o2M2gG-g0TqZlIemYvg', {
//        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//        tileSize: 512,
//        zoomOffset: -1
//    }).addTo(map);




//var stamenLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//    attribution:
//        'Map tiles by <a href="http://stamen.com">Stamen Design<\/a>, ' +
//        '<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0<\/a> &mdash; ' +
//        'Map data {attribution.OpenStreetMap}'
//}).addTo(map);





//const rasterUrl = "https://s3-us-west-2.amazonaws.com/planet-disaster-data/hurricane-harvey/SkySat_Freeport_s03_20170831T162740Z3.tif";
function loadTemperatureMap(){
  const rasterUrl = "http://localhost/app/temperatura_barcelona/tif/LST_0607_4326.tif";
  //const rasterUrl = "https://georaster-layer-for-leaflet.s3.amazonaws.com/wind_direction.tif";
  parseGeoraster(rasterUrl).then(georaster => {
    const { noDataValue } = georaster;
    var pixelValuesToColorFn = values => {
      //if (values.some(value => value === noDataValue)) {
      //  return 'rgba(66,112,48,1)';
      //} else {
      //  const [r, g, b] = values;
      //  return `rgba(${r},${g},${b},.85)`;
      //}
      if (values.some(value => value > 56)) {
        return 'rgba(215, 25, 28,1)';
      }else if(values.some(value => value > 50)){
        return 'rgba(246, 144, 83,1)';
      }else if(values.some(value => value > 45)){
        return 'rgba(255, 255, 191,1)';
      }else if(values.some(value => value > 40)){
        return 'rgba(171, 221, 164,1)';
      }else if(values.some(value => value > 35)){
        return 'rgba(43, 131, 186,1)';
      }
    };
    const resolution = 64;
    var layer = new GeoRasterLayer({
      attribution: "Planet",
      georaster, pixelValuesToColorFn, resolution, opacity:0.7
    });
    layer.addTo(map);
    //map.fitBounds(layer.getBounds());
  });

}

loadTemperatureMap()

var basemapGrey = L.tileLayer('https://api.mapbox.com/styles/v1/josepsitjar/ck0xpy0xd1ewc1cmzdo07t0ie/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9zZXBzaXRqYXIiLCJhIjoiNXhaUDE0byJ9.f72o2M2gG-g0TqZlIemYvg', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  tileSize: 512,
  zoomOffset: -1
}).addTo(map);




// Tilelayer mapbox NDVI Barcleona
// Amb tippecannoe convertim json a mbtiles, i exportem a mapbox
var ndviLayer = L.tileLayer('https://api.mapbox.com/styles/v1/josepsitjar/cjrqgkxvz3qa82sr5dvtmdpv2/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9zZXBzaXRqYXIiLCJhIjoiNXhaUDE0byJ9.f72o2M2gG-g0TqZlIemYvg', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 512,
    zoomOffset: -1
});

// layer barris temperatura
function getColorBarris(d) {
		return d > 46 ? '#d7191c' :
				d > 44  ? '#fec980' :
				d > 40  ? '#c7e9ad' :
				d > 36  ? '#2b83ba' :
							'#FFEDA0';
}

function style(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: getColorBarris(feature.properties._mean)
		};
	}

geojson = L.geoJson(tempBarris, {
		style: style,
    onEachFeature: function(feature, layer) {
      console.log(feature);
      //layer.bindPopup(tempBarris.properties._mean);
      layer.bindTooltip(feature.properties.NOM);
    }
	});


// end barris temperatura

setTimeout(function(){
  ndviLayer.addTo(map);
  var overlayMaps = {
      "Neighborhood": geojson,
      "Vegetation": ndviLayer
  };
  L.control.layers(null,overlayMaps,{collapsed:false}).addTo(map);
  $(".leaflet-control-layers-overlays").append("<label>Transparency</label>");
  $(".leaflet-control-layers-overlays").append("<div class='slidecontainer'><input type='range' min='0' max='1' step='0.1' value='1' class='slider' id='myRange' onchange='updateOpacity(this.value)'></div>");

}, 1000);

/*L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox.streets'
}).addTo(map);*/


//$(".leaflet-control-layers-overlays").append("<div class='slidecontainer'><input type='range' min='0' max='1' step='0.1' value='1' class='slider' id='myRange' onchange='updateOpacity(this.value)'></div>");

//opaciti
//http://jsfiddle.net/m13ojymf/2/
function updateOpacity(value) {
    ndviLayer.setOpacity(value);
}


//legend
var legend = L.control({position: 'bottomleft'});

function getColor(d) {
  return d > 56 ? '#d7191c' :
         d > 50  ? '#f69053' :
         d > 45  ? '#ffffbf' :
         d > 40  ? '#abdda4' :
         d > 35   ? '#2b83ba' :
                    '#FFEDA0';
}

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
    grades = [35, 40, 45, 50, 56],
    labels = [];

  div.innerHTML += '<div class="text-visor"><h4>Land Surface Temperature</h4></div></br>';
  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  div.innerHTML += '</br></br><div class="text-visor"><h4>Vegetation areas</h4></div></br><i style="background: green"></i>';

  return div;

};

legend.addTo(map);


// graph 1
var graph1 = L.control({position: 'bottomright'});
graph1.onAdd = function(map){
  var div = L.DomUtil.create('div', 'graph1');
  div.innerHTML += '<div class="text-visor text-graph"><h4>Correlation graph between temperature and vegetation</h4></div>'
  div.innerHTML += '<img src="graph/0607_ndvi_temp_graph-1.png" height="390" width="600">';

  return div;
};

graph1.addTo(map);


// title
var title = L.control({position: 'topcenter'});
title.onAdd = function(map){
  var div = L.DomUtil.create('div', 'title');
  div.innerHTML += '<h1>Land Surface Temperature at Barcelona</h1>';
  div.innerHTML += '<h3>Comparing green and grey urban areas</h3>';

  return div;
}

title.addTo(map);


// add slider over map
/*
var Slider = L.Control.extend({
options: {
    position: "bottomright"
},
  onAdd: function(map) {
      this._div = L.DomUtil.create('div', 'info');
      L.DomEvent.disableClickPropagation(this._div);
      this.update();
      return this._div;
  },
  update: function(d) {
      this._div.innerHTML += '<h4>Pick your value:</h4></br>'
      this._div.innerHTML += '<div class="slidecontainer"><input type="range" min="1" max="4" value="1" class="slider" id="myRange"><p><span id="demo"></span></p></div>';
  }
});

var slider = new Slider().addTo(map);

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = '</br>Current situation';

slider.oninput = function() {
  switch(this.value){
    case '1':
      output.innerHTML = '</br>Current situations';
      break;
    case '2':
      output.innerHTML = '</br>Increase 30% vegetation';
      break;
    case '3':
      output.innerHTML = '</br>Increase 50% vegetation';
      break;
    case '4':
      output.innerHTML = '</br>100% vegetation';
      break;

  }
  //output.innerHTML = this.value;
}
*/


// easy button
L.easyButton('fa-info-circle', function(btn, map){
    //alert('info projecte');
    $('#mymodal').modal('show');
}).addTo(map);
