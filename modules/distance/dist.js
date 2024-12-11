hideNetworkErr();
hideLocationErr();
hideInfo();

function hideInfo(){
	stopLoading();
	var ele = document.getElementById("infos");
	ele.style.display = "none";
	var inp = document.getElementById("input");
	inp.style.display = "block";
	console.log('Info hidden');
}

//##

var distScreen = document.getElementById('distance-popup');

var closeButton = document.querySelector('.close-button');
closeButton.addEventListener('click', function(event) {
    event.preventDefault(); //for preventing defult action
    distScreen.style.display = 'none'; 
});

//##

function showInfo(){
	var ele = document.getElementById("infos");
	ele.style.display = "block";
	var inp = document.getElementById("input");
	inp.style.display = "none";
	console.log('Info shown');
}

//##

function showLocationErr(){
	var ele = document.getElementById("locerr");
	ele.style.display = "block";
	hideInfo();
}

//##

function hideLocationErr(){
	var ele = document.getElementById("locerr");
	ele.style.display = "none";
}

function mapLink(lat1, lon1, lat2, lon2, distance) {
	console.log(distance);
    const baseUrl = 'https://maps.geoapify.com/v1/staticmap';
    const apiKey = '2cdf21140e974ba8af8fae8dab9bbbb1';

	let zooma = 11;

		if (distance <= 0.2) zooma =  15; // If distance is very short, use maximum zoom
		else if (distance <= 50) zooma =  8; 
        else if (distance <= 300) zooma =  5; // For distances up to 300 km, use zoom level 6
        else if (distance <= 600) zooma = 4; // For distances up to 531 km, use zoom level 4
		else if (distance <= 1500) zooma = 3;
		else if (distance <= 3000) zooma = 2;
        else if (distance <= 30000) zooma =  0; // For distances up to 12000 km, use zoom level 0


    const marker1 = `lonlat:${lon1},${lat1};color:red;size:medium`;
    const marker2 = `lonlat:${lon2},${lat2};color:blue;size:medium`;

    const queryParams = new URLSearchParams({
        style: 'osm-bright',
        width: 760,
        height: 230,
        center: `lonlat:${(lon1 + lon2) / 2},${(lat1 + lat2) / 2}`,
        zoom: zooma,
        apiKey: apiKey,
    });

    // Manually append markers to queryParams
    queryParams.append('marker', marker1);
    queryParams.append('marker', marker2);

    const formattedLink = `${baseUrl}?${queryParams}`;
    console.log(formattedLink);
	return formattedLink;
}


function getDistanceInfo(source, destination) {
	console.log(source);
	console.log(destination);
    const apiKey = "6mvxaDxNfMOP5XXheg2F9G59AA0rfq1xxFMsYxmBNdhj1VRh017YZgdvJ2KR0LRB";
    const url = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${source.latitude},${source.longitude}&destinations=${destination.latitude},${destination.longitude}&key=${apiKey}`;

	console.log(url);
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const distanceInfo = data.rows[0].elements[0];
            //const distance = distanceInfo.distance.text;
			//console.log(distance);
            //const duration = distanceInfo.duration.text;
            
			//console.log(duration);
			if(distanceInfo.status== "OK")
			{
				const distance = distanceInfo.distance.text;
				console.log(distance);
				const duration = distanceInfo.duration.text;
				document.getElementById('by-road-distance').textContent = distance;
				
				document.getElementById('time-to-travel').textContent = duration;
				hideNetworkErr();
				hideLocationErr();
				showInfo();
			}
			else
			{
				document.getElementById('by-road-distance').textContent = "No path found";
				document.getElementById('time-to-travel').textContent = "No path found";
				hideNetworkErr();
				hideLocationErr();
				showInfo();
			}	
		})
        .catch(error => {
			showNetworkErr();
			console.log(error);
        }
		);
}

//##

function showNetworkErr(){
	var ele = document.getElementById("conerr");
	ele.style.display = "block";
	hideInfo();
	console.log('Network error shown');
}

//##

function hideNetworkErr(){
	var ele = document.getElementById("conerr");
	ele.style.display = "none";
	console.log('Network error hidden');
}

//##

function checkConnection() {
    if (navigator.onLine) {
        return true;
    } else {
        return false;
    }
}

//##


function degreesToRadians(degrees) {
	var radians = (degrees * Math.PI)/180;
	return radians;
}

//##

function calcDistance (startCoords, destCoords){
	let startingLat = degreesToRadians(startCoords.latitude);
	let startingLong = degreesToRadians(startCoords.longitude);
	let destinationLat = degreesToRadians(destCoords.latitude);
	let destinationLong = degreesToRadians(destCoords.longitude);

	// Radius of the Earth in kilometers
	let radius = 6571;
	// Haversine equation
	let distanceInKilometers = Math.acos(Math.sin(startingLat) * Math.sin(destinationLat) + Math.cos(startingLat) * Math.cos(destinationLat) * Math.cos(startingLong - destinationLong)) * radius;
	
	return distanceInKilometers;
}

//##

document.getElementById('go-back').addEventListener('click', function(){
	hideInfo();
});

//*
function startLoading() {
    const icon = document.querySelector('#get-info i');
    icon.classList.remove('fa-search');
    icon.classList.add('fa-spinner', 'fa-spin');
}

function stopLoading() {
    const icon = document.querySelector('#get-info i');
    icon.classList.remove('fa-spinner', 'fa-spin');
    icon.classList.add('fa-search');
}
//*


function buttonClick() {
	var SourceLat;
	var DestLat;
	var DestLng;
	var SourceLng;
	var textbox1Value = document.getElementById('source').value;
	var textbox2Value = document.getElementById('destination').value;
	
	hideLocationErr();
	hideNetworkErr();
	
	if(!textbox1Value == "" && !textbox2Value == "")
	{
			console.log("function entered once");
			startLoading();
			var sourceURL = "https://api.distancematrix.ai/maps/api/geocode/json?key=oPRZQuv6wqP1R6IfxUTONtm1lYXB4Ob0W1kH5HHQKX9w9m8u42i39OkyZiujLRMC&address=" + encodeURIComponent(textbox1Value);
			
			var destURL = "https://api.distancematrix.ai/maps/api/geocode/json?key=oPRZQuv6wqP1R6IfxUTONtm1lYXB4Ob0W1kH5HHQKX9w9m8u42i39OkyZiujLRMC&address=" + encodeURIComponent(textbox2Value);
			
			
			
			if(checkConnection()){
				fetch(sourceURL)
					.then(response => response.json())
					.then(data => {
						console.log("fetched once");
						console.log(data.result)
					SourceLat = data.result[0].geometry.viewport.southwest.lat;
					SourceLng = data.result[0].geometry.viewport.southwest.lng;
					
					document.getElementById('source-lat').textContent = SourceLat.toFixed(5);
					document.getElementById('source-lng').textContent = SourceLng.toFixed(5);
					
					console.log(SourceLat);
					console.log(SourceLng);
					
					fetch(destURL)
					.then(response => response.json())
					.then(data => {
					DestLat = data.result[0].geometry.viewport.southwest.lat;
					DestLng = data.result[0].geometry.viewport.southwest.lng;
					
					document.getElementById('destination-lat').textContent = DestLat.toFixed(5);
					document.getElementById('destination-lng').textContent = DestLng.toFixed(5);
					
					console.log(DestLat);
					console.log(DestLng);
					
					if(SourceLat!=0&&SourceLng!=0&&DestLat!=0&&DestLng!=0)
				{
					let x = {
						latitude: SourceLat,
						longitude: SourceLng
					}
  
					let y = {
						latitude: DestLat,
						longitude: DestLng
					}
					rawDist = calcDistance(x,y);

					let mapsrc = mapLink(x.latitude,x.longitude,y.latitude,y.longitude, rawDist);

					const map = document.getElementById('minimap2');

					map.src = mapsrc;
					console.log("SRC IS:" + map.src);

					console.log(rawDist, x, y);
						
						
					//Code for api
					
					if (rawDist >= 1) {
            // Distance is in kilometers
            rawDist = `${rawDist.toFixed(2)} km`;
        } else {
            // Distance is less than 1 kilometer, format as meters
            rawDist = (rawDist * 1000).toFixed(2) + " m";
        }
					
					document.getElementById('direct-distance').textContent = rawDist;
					
					getDistanceInfo(x,y);
					
				}
				else{
					showLocationErr();
				}
					
				})
				.catch(error => {
					showNetworkErr();	
					console.log(error);
				})
				})
				.catch(error => {
					showNetworkErr();
					console.log(error);
				});	
				
				
				
					
				
			}
			else{
				showNetworkErr();
			}
			
	}
}

//*
document.addEventListener('keydown', function(event) {
	// Check if the pressed key is 'Enter'
	if (event.key === 'Enter') {
			const icon = document.querySelector('#get-info i');
			if (icon.classList.contains('fa-search')) {
			buttonClick();
			}
		}
});
//*


//*
document.getElementById('get-info').addEventListener('click', function(event) {
	const icon = document.querySelector('#get-info i');
			if (icon.classList.contains('fa-search')) {
			buttonClick();
			}
});
