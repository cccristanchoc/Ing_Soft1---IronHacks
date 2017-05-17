var map;
var polMarks = [];
var rentMarks = [];

function myMap() {
	var mapCanvas = document.getElementById("map");
	var myCenter = new google.maps.LatLng(41.8708,-87.6505); 
	var mapOptions = {center: myCenter, zoom: 13};
	map = new google.maps.Map(mapCanvas,mapOptions);
	var marker = new google.maps.Marker({
        position: myCenter,
        icon:"../img/Uic2.ico" ,
        animation: google.maps.Animation.BOUNCE
	});
	marker.setMap(map);
    
    
    // Create a <script> tag and set the USGS URL as the source.
    //var script = document.createElement('script');
    // This example uses a local copy of the GeoJSON stored at
    // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
    //script.src = 'https://data.cityofchicago.org/resource/9rg7-mz9y.json';
    //document.getElementsByTagName('map')[0].appendChild(script); 
    thePolice();//.marker.setVisible(false);
    theRent();
    
}

function clima(){
    //https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND:US1ILCK0036
    var climReq = new XMLHttpRequest();
    //curl -H "token:<gKdqVrXdXCiBUxPUONyJtHEDmEZqSXXk>" "url"
    console.log(
    $.ajax({ url:"https://www.ncdc.noaa.gov/cdo-web/api/v2/locations?locationcategoryid=CITY:US170006", 
            data:{
                "id": "CITY:US170006",
                "name": "Chicago, IL US",
                "datacoverage": 1,
                "mindate": "2017-04-09",
                "maxdate": "2017-04-15"
            }, headers:{ token:"gKdqVrXdXCiBUxPUONyJtHEDmEZqSXXk" } })
    );
}

//create a new httprequest for this session
var xmlhttp = new XMLHttpRequest();
//json format data resource url 
var url = "http://api.openweathermap.org/data/2.5/weather?q=Chicago,US&appid=102b1170c24d8266cc3e5d66f3c8967b";
xmlhttp.open("GET", url, true);
xmlhttp.send();

//once the request is accepted, process the fowllowing function to get data and complete the app information
xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var myArr = xmlhttp.responseText;
        var text = myArr;
        var json = JSON.parse(text);
        //alert(JSON.parse(text).coord.lon);
        //document.getElementById("id01").innerHTML = myArr;
    
        document.getElementById("weather").innerHTML = " At this moment the weather is <em><b>" + json.weather[0].main + "</b></em>";
	}
};


function theRent(){
    var url1 = "https://data.cityofchicago.org/resource/uahe-iimk.json";
    var jren = new XMLHttpRequest();
    jren.open("GET", url1, true);
    jren.send();

    jren.onreadystatechange = function() {
        if (jren.readyState == 4 && jren.status == 200) {
            var myArr = jren.responseText;
            var text = myArr;
            var jso = JSON.parse(text);
            console.log(jso);
            
            for (var i = 0; i < jso.length; i++) {
                //var coords = jso[i].location.coordinates;
                var Lat = jso[i].latitude;
                var Lng = jso[i].longitude;
                var titl = jso[i].address;
                var labe = jso[i].community_area_number;

                var marker = new google.maps.Marker({
                    position: {lat: Number(Lat), lng: Number(Lng)}, 
                    icon: "../img/rent.png",
                    title: titl,
                    map: map
                });

                var message =   "<b>Com Area:  </b>" + jso[i].community_area + "<br>" + 
                                "<b>Addr:  </b>" + jso[i].address + "<br>" +                    
                                "<b>Manag Comp:  </b>" + jso[i].management_company + "<br>" + 
                                "<b>Phone:  </b>" + jso[i].phone_number + "<br>" +
                                "<b>Prop Name:  </b>" + jso[i].property_name + "<br>" + 
                                "<b>Prop type:  </b>" + jso[i].property_type + "<br>" +
                                "<b>Units:  </b>" + jso[i].units ;
                var infowindow = new google.maps.InfoWindow();
                
                //console.log(rentMarks);
                google.maps.event.addListener(marker,'click', (function(marker, message, infowindow) {
                  return function(){
                      infowindow.setContent(message);
                      infowindow.open(map,marker);
                  };
                })(marker, message,infowindow));
                rentMarks.push(marker);
                
            }
        }
    };
}

function rentSetMap(map){
    for (var i = 0; i < rentMarks.length; i++) {
        rentMarks[i].setMap(map);
        //marker.setVisible(true);
    }
}

function rentClMark() {
    rentSetMap(null);
}

function rentShowMark() {
    rentSetMap(map);
}


function thePolice(){
    var url2 = "https://data.cityofchicago.org/resource/9rg7-mz9y.json";
    var jpol = new XMLHttpRequest();
    jpol.open("GET", url2, true);
    jpol.send();

    jpol.onreadystatechange = function() {
        if (jpol.readyState == 4 && jpol.status == 200) {
            var myArr = jpol.responseText;
            var text = myArr;
            var json = JSON.parse(text);
            console.log(json);

            for (var i = 0; i < json.length; i++) {
                var coords = json[i].location.coordinates;
                var Lat = json[i].latitude;
                var Lng = json[i].longitude;
                var titl = json[i].district_name;
                var labe = json[i].district;
                //polAddMarker( lat, Lng, title, label );
                //console.log(lat, Lng);
                var marker = new google.maps.Marker({
                    position: {lat: Number(Lat), lng: Number(Lng)}, 
                    icon: "../img/police.png",
                    title: titl ,
                    label: {
                        text: labe,
                        color: 'blue'
                    },
                    map: map
                });

                var message =   "<b>Dis. Name: </b>" + json[i].district_name + "<br>" + 
                                "<b>Addr: </b>" + json[i].address + "<br>" +                    
                                "<b>Phone: </b>" + json[i].phone + "<br>" + 
                                "<b>Fax: </b>" + json[i].fax + "<br>" + 
                                "<a href="+ json[i].website +">Website</a>";
                var infowindow = new google.maps.InfoWindow();
                
                //console.log(polMarks);
                google.maps.event.addListener(marker,'click', (function(marker, message, infowindow) {
                  return function(){
                      infowindow.setContent(message);
                      infowindow.open(map,marker);
                  };
                })(marker, message,infowindow));
                polMarks.push(marker);
            }
        }
    };
}

function setMapOnAll(map){
    for (var i = 0; i < polMarks.length; i++) {
        polMarks[i].setMap(map);
        //marker.setVisible(true);
    }
}

function clearMarkers() {
    setMapOnAll(null);
}

function showMarkers() {
    setMapOnAll(map);
}