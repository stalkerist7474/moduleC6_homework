let elemPageNum = null;
let elemLimit = null;
let elemGallery = null;

async function doRequest() {
	const elemErr = document.querySelector(".error_text");

	elemGallery.innerHTML = "";
	
	const err = checkInputData();

	if (err !== "OK") {
		elemErr.innerText = err;
		elemErr.style.display = "block";
	} else {
		elemErr.innerText = "";
		elemErr.style.display = "none";

		const pg = elemPageNum.value;
		const lim = elemLimit.value;
		const req = `https://picsum.photos/v2/list?page=${pg}&limit=${lim}`;
		const inputData = {pagenum: pg, limit: lim};
		const requestResult = await useRequest(req);

		localStorage.setItem("inputdata", JSON.stringify(inputData));
		localStorage.setItem("gallery", JSON.stringify(requestResult));

		buildGalery(requestResult);
	}
}

function buildGalery(arrGal) {
	let gal = "";

	arrGal.map(x => {
		gal = gal + `
			<div class="gal-item" style="background: no-repeat center / cover url('` + 
			x.download_url + `')"></div>`;
	});

	elemGallery.innerHTML = gal;
}


function useRequest(req) {
	return fetch(req)
    .then((response) => {
    	return response.json();
    })
    .catch(() => { console.log('error') });
}

function checkInputData() {
	let result = "OK"; 
	let errPhrase = "";

	if (checkNumber10(elemPageNum.value) !== "OK") errPhrase += "pagenum_";
	if (checkNumber10(elemLimit.value) !== "OK") errPhrase += "limit_";

	if (errPhrase.indexOf("pagenum_limit_") >= 0)
		result = "Номер страницы и лимит вне диапазона от 1 до 10";
	else if (errPhrase.indexOf("pagenum_") >= 0)
		result = "Номер страницы вне диапазона от 1 до 10";
	else if (errPhrase.indexOf("limit_") >= 0)
		result = "Лимит вне диапазона от 1 до 10";		

	return result;
}

function checkNumber10(val) {
	let result = "Некорректное значение";

	val = +val; 

	if (typeof val === "number" && !isNaN(val)) {
		if (val >= 1 && val <= 10) result = "OK";
	}

	return result;
}

document.addEventListener("DOMContentLoaded", () => {
	elemPageNum = document.querySelector(".page-num");
	elemLimit = document.querySelector(".limit");
	elemGallery = document.querySelector(".galery")
	
	document.querySelector(".btn").addEventListener("click", doRequest);

	let inputData = JSON.parse(localStorage.getItem("inputdata"));
	if (inputData) {
		elemPageNum.value = inputData.pagenum;
		elemLimit.value = inputData.limit;
	}

	let galleryData = JSON.parse(localStorage.getItem("gallery"));
	if (galleryData)
		buildGalery(galleryData);
});