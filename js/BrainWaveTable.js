let requestURL = "http://192.168.1.104:8080/api/beach/";
let request = new XMLHttpRequest();
let output = document.getElementById("output");


function searchFilms() {

    let searchString = document.getElementById("filmFilter").value;
    let minRuntime = document.getElementById("minRuntime").value;
    let maxRuntime = document.getElementById("maxRuntime").value;
    if (maxRuntime == 0) {
        maxRuntime = 1000;
    }
    let filmCategory = document.getElementById("filmCategory").value;

    output.innerHTML = "";

    request.open("GET", requestURL);
    request.responseType = "json";
    request.send();
    request.onload = function () {


        let requestData = request.response;

        for (let i = 0; i < requestData.length; i++) {

            let beachId = requestData[i].beachId;
            let beachName = requestData[i].beachName;
            let runtime = requestData[i].length;
            let category = requestData[i].category;
            let rating = requestData[i].rating;
            let description = requestData[i].description;
            let actors = titleCase(requestData[i].actors);

            if beachId == 8 || beachId == 
            
            }
        }
    }



function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
    }
}


