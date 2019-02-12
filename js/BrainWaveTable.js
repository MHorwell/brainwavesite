
let request = new XMLHttpRequest();
let output = document.getElementById("output");

let distanceUnit = "K";
let timeButtons = document.getElementById("timeButtons");
let beachContainer = document.getElementById("beachContainer");
let beachDetails = document.getElementById("beachDetails");
let searchString = document.getElementById("beachName");


function searchBeaches() {
    let beachDBAPI = "http://localhost:8080/api/beach/";
    let searchString = document.getElementById("beachName").value;
    beachContainer.className = "col col-lg-4";

    if (searchString != "") {
        beachDBAPI += "name/" + searchString;
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

    let currentLatitude = document.getElementById("latitude").value;
    let currentLongtitude = document.getElementById("longtitude").value;
    let maxDistance = document.getElementById("searchDistance").value;
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
            row.setAttribute("onclick", "getSurfData('" + beachId + "');");
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
    document.getElementById("surfReport").className = "col col-lg-8";
    let surfBody = document.getElementById("surfOutput");
    surfBody.innerHTML = "";
    document.getElementById("theBeachName").innerHTML = beachName + " Beach";

    let URL = "https://magicseaweed.com/api/196a716c7205dbe82df0d3c6377936e4/forecast/?spot_id=" +
        8 +
        "&fields=swell.minBreakingHeight,swell.maxBreakingHeight,solidRating,fadedRating"
    surfBody.scrollIntoView;
    PROXY = "https://cors-anywhere.herokuapp.com/";
    request.open("GET", PROXY + URL);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        let surfData = request.response;
        for (let i = 0; i < 9; i++) {
            let surfRating = [];
            let surfRow = surfBody.insertRow();
            let surfTime = i * 3 + ":00";
            let minBreak = surfData[i].swell.minBreakingHeight;
            let maxBreak = surfData[i].swell.maxBreakingHeight;
            console.log(surfData.fadedRating);

            for (let r = 0; r < surfData[i].solidRating; r++) {
                surfRating.push('<img src="http://cdnimages.magicseaweed.com/star_filled.png"/>');
            }

            for (let r = 0; r < surfData[i].fadedRating; r++) {
                surfRating.push('<img src="http://cdnimages.magicseaweed.com/star_empty.png"/>');
            }


            let timeCell = surfRow.insertCell();
            let minBreakCell = surfRow.insertCell();
            let maxBreakCell = surfRow.insertCell();
            let surfRatingCell = surfRow.insertCell();

            timeCell.innerHTML = surfTime;
            minBreakCell.innerHTML = minBreak;
            maxBreakCell.innerHTML = maxBreak;
            surfRatingCell.innerHTML = surfRating.join(" ");
            
    
        }
        getReviews(1);
    }
}

function getReviews(beachId) {
    beachDetails.className = "container-fluid";
    let beachDescription = document.getElementById("beachDescription");
    beachDescription.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ut libero vitae elit ultricies aliquam. Morbi hendrerit dolor leo, a imperdiet elit efficitur sed. Mauris congue aliquet metus, vitae vehicula nisl ullamcorper eget. Sed eu dui sed est interdum rhoncus in ut turpis. Nam aliquet posuere tortor in pretium. Duis elit justo, fringilla ac metus volutpat, blandit scelerisque nunc. Nulla placerat id risus in accumsan. Aenean in mollis odio, sed aliquam est. Fusce a felis mi. Integer mi elit, eleifend eget risus ac, convallis rutrum elit. Sed sed neque at urna feugiat ullamcorper. Praesent sit amet orci ut lacus fringilla ornare eu vel metus. Donec rhoncus cursus purus, sed porta enim aliquet sed."
    document.getElementById("beachPic").innerHTML = "<img class='img-fluid max-width: 100%' src='https://www.visitcornwall.com/sites/default/files/product_image/Perranporth2_Matt%20Jessop.jpg'/>";
    URL = "http://localhost:8080/api/beach/" +
    beachId +
    "/reviews";
    request.open("GET", URL);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        let reviewData = request.response;
        let finalRockPoolRating = 0;

        for (let i = 0; i < reviewData.length; i++) {
            finalRockPoolRating += parseInt(reviewData[i].rockpoolRating);
        }

        console.log(finalRockPoolRating);
    }
}

function postReview(id) {

}

function changeDistance(unit){
    distanceUnit = unit;
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
