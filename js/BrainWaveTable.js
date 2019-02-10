
let request = new XMLHttpRequest();
let output = document.getElementById("output");

let beachDBAPI = "http://localhost:8080/api/beach/";
let searchString = document.getElementById("beachName").value;
let currentLatitude = document.getElementById("latitude").value;
let currentLongtitude = document.getElementById("longtitude").value;
let maxDistance = document.getElementById("searchDistance").value;
let distanceUnit = "N";
let timeButtons = document.getElementById("timeButtons");
let beachTable = document.getElementById("beachTable");
let beachAccordion = document.getElementById("beachAccordion");


function searchBeaches() {
    beachTable.className = "col";

    if (searchString != "") {
        beachDBAPI += "name/" + searchString;
    }

    if (document.getElementById("km").checked) {
        distanceUnit = "K";
    }

    output.innerHTML = "";

    request.open("GET", beachDBAPI, true);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        processBeachData(request.response);


    }
}

function processBeachData(beachData) {
    for (let i = 0; i < beachData.length; i++) {
        let beachId = beachData[i].id;
        let beachName = beachData[i].name;
        let beachLatitude = beachData[i].latitude;
        let beachLongtitude = beachData[i].longtitude;
        let beachDistance = distance(currentLatitude, currentLongtitude,
            beachLatitude, beachLongtitude, distanceUnit);
        if (beachDistance < maxDistance || maxDistance == 0) {
            let row = output.insertRow();
            row.setAttribute("class", "clickable");
            row.setAttribute("data-toggle", "collapse");
            row.setAttribute("data-target", "#beach" + beachId);
            row.setAttribute("href", "#beach" + beachId);
            row.setAttribute("onclick", "getSurfData('" + beachName + "')");
            let idCell = row.insertCell();
            let nameCell = row.insertCell();
            let distanceCell = row.insertCell();
            idCell.innerHTML = beachId;
            nameCell.innerHTML = beachName;
            if (currentLatitude == 0 || currentLongtitude == 0) {
                distanceCell.innerHTML = "";
            } else {
                distanceCell.innerHTML = beachDistance;
            }


        }
    }

}


function getSurfData(beachName) {
    document.getElementById("surfReport").className="col";
    let surfBody = document.getElementById("surfOutput");
    surfBody.innerHTML= "";
    document.getElementById("theBeachName").innerHTML = beachName;
    
    let URL = "https://magicseaweed.com/api/196a716c7205dbe82df0d3c6377936e4/forecast/?spot_id=" +
        8 +
        "&fields=swell.minBreakingHeight,swell.maxBreakingHeight,solidRating"
    surfBody.scrollIntoView;
    PROXY = "https://cors-anywhere.herokuapp.com/";
    request.open("GET", PROXY + URL);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        let surfData = request.response;

        for (let i = 0; i < 9; i++) {
            let surfRow = surfBody.insertRow();
            let surfTime = i * 3 + ":00";
            let minBreak = surfData[i].swell.minBreakingHeight;
            let maxBreak = surfData[i].swell.maxBreakingHeight;
            let surfRating = surfData[i].solidRating;
            console.log(minBreak);

            let timeCell = surfRow.insertCell();
            let minBreakCell = surfRow.insertCell();
            let maxBreakCell = surfRow.insertCell();
            let surfRatingCell = surfRow.insertCell();

            timeCell.innerHTML = surfTime;
            minBreakCell.innerHTML = minBreak;
            maxBreakCell.innerHTML = maxBreak;
            surfRatingCell.innerHTML = surfRating;
        }
    }
}


function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist;
    }
}
