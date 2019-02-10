
let request = new XMLHttpRequest();
let output = document.getElementById("output");

let beachDBAPI = "http://localhost:8080/api/beach/";
let searchString = document.getElementById("beachName").value;
let currentLatitude = document.getElementById("latitude").value;
let currentLongtitude = document.getElementById("longtitude").value;
let maxDistance = document.getElementById("searchDistance").value;
let distanceUnit = "N";
let timeButtons = document.getElementById("timeButtons");
let time = 0;
let beachTable = document.getElementById("beachTable");

function searchBeaches() {

    beachTable.className = "d-flex justify-content-around";
    document.getElementById("setTime").className = "d-flex justify-content-around";

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
        let beachData = request.response;

        for (let i = 0; i < beachData.length; i++) {

            let beachId = beachData[i].id;
            let beachName = beachData[i].name;
            let beachLatitude = beachData[i].latitude;
            let beachLongtitude = beachData[i].longtitude;
            let row = output.insertRow();
            row.className = (beachId + beachName)

            let idCell = row.insertCell();
            let nameCell = row.insertCell();
            let distanceCell = row.insertCell();
            
            

            nameCell.innerHTML = beachName;
            if (currentLatitude == 0 || currentLongtitude == 0) {
                distanceCell.innerHTML = "";
            } else {
                distanceCell.innerHTML = distance(currentLatitude, currentLongtitude,
                    beachLatitude, beachLongtitude, distanceUnit);
            }

        }

    }
}


function getSurfData() {
    for (i = 0; i < timeButtons.length; i++) {
        if (timeButtons[i].checked) {
            time = timeButtons[i].value;
            console.log("It's a match");
            if (document.getElementById("PM").checked) {
                time += 4;
            }
        }
    }
    let URL = "https://magicseaweed.com/api/196a716c7205dbe82df0d3c6377936e4/forecast/?spot_id=" +
    969 +
    "&fields=swell.*"
    PROXY = "https://cors-anywhere.herokuapp.com/";
    request.open("GET", PROXY + URL);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        let surfData = request.response[time];
        let beachTable = document.getElementById("output");
        for (var i = 0, row; row = beachTable.rows[i]; i++){
            let minBreakCell = row.insertCell();
            minBreakCell.innerHTML = surfData.swell.minBreakingHeight;
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
