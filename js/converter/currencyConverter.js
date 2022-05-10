import { getCurrencies, getAllRates, getRatesByDate } from "../apiServices.js";

const allRates = await getAllRates(currenciesNumber);
allRates.EUR = 1;

let hasVariablesBeenAwaited = false;
async function createSelect() {
	const currencies = await getCurrencies();
	for (let x = 0; x < Object.keys(currencies).length; x++) {
		if (x != 13) {
			let newCurrency1 = document.createElement("option");
			let newCurrency2 = document.createElement("option");
			newCurrency1.innerHTML = Object.keys(currencies)[x];
			newCurrency2.innerHTML = Object.keys(currencies)[x];
			if (x == 8) newCurrency1.selected = "selected";
			if (x == 24) newCurrency2.selected = "selected";
			document.querySelector("#currenciesSelectFirst").appendChild(newCurrency1);
			document.querySelector("#currenciesSelectSecond").appendChild(newCurrency2);
		}
	}
	calculator();
}
createSelect();

const inputNumber = document.querySelector("#currenciesNumber");
inputNumber.addEventListener("input", replaceWrongCharacters);

async function replaceWrongCharacters() {
	let number = inputNumber.value;
	number = number.replace(/[^0-9.,]/gm, "");
	number = String(number);
	let dotCount = 0;
	let firstDot = 12;
	for (let i = 0; i < number.length; i++) {
		if (number.charAt(i) == "." || number.charAt(i) == ",") {
			dotCount += 1;
		}
	}
	if (dotCount > 1) {
		for (let i = 0; i < number.length; i++) {
			if (number.charAt(i) == "." || number.charAt(i) == ",") {
				if (i < firstDot) firstDot = i;
				if (i != firstDot) number = number.slice(0, i) + number.slice(i + 1);
			}
		}
	}

	number = number.replace(",", ".");

	if (number.includes(".")) {
		let originalBeforeDot = parseInt(number.slice(0, number.lastIndexOf(".")));
		let originalAfterDot = number.substr(number.indexOf("."));
		number = originalBeforeDot + originalAfterDot;
		if (originalBeforeDot != 0) {
			originalBeforeDot = parseInt(originalBeforeDot);
		}
	} else if (number != 0) {
		number = parseInt(number);
	}

	inputNumber.value = number;

	if (inputNumber.value == "") {
		document.querySelector("#currenciesNumber").value = "0";
	}

	calculator();
}

const inputCurrencies = document.querySelectorAll("[name='currencies']");
for (let x = 0; x < inputCurrencies.length; x++) {
	inputCurrencies[x].addEventListener("change", calculator);
}

async function calculator() {
	let firstCurr = document.querySelector("#currenciesSelectFirst").value;
	let secondCurr = document.querySelector("#currenciesSelectSecond").value;
	let numberCurr = document.querySelector("#currenciesNumber").value;
	if (numberCurr == "") numberCurr = "0";
	let conversion = String((numberCurr * Math.round((allRates[secondCurr] / allRates[firstCurr]) * 100)) / 100);
	let afterDot = conversion.substr(conversion.indexOf(".") + 1);
	if (!conversion.includes(".")) {
		conversion += ".00";
		afterDot = "00";
	}
	if (afterDot.length == 1) {
		afterDot += 0;
	}
	if (afterDot.length > 2) {
		afterDot = afterDot / Math.pow(10, afterDot.length - 2);
		if (afterDot < 12) {
			afterDot = Math.round(afterDot);
		} else {
			afterDot = Math.floor(afterDot);
		}
	}
	let beforeDot = conversion.slice(0, conversion.lastIndexOf("."));
	if (numberCurr) conversion = beforeDot + "." + afterDot;
	document.querySelector("#calcResult").innerHTML = `${conversion}`;
	if (!hasVariablesBeenAwaited) {
		await variablesForChart();
		hasVariablesBeenAwaited = true;
	}
	chart(firstCurr, secondCurr, numberCurr);
}

async function variablesForChart() {
	const dateNow = new Date();
	let year = dateNow.getYear() + 1900;
	let month = dateNow.getMonth();
	let day = dateNow.getDate();
	const monthsInPolish = ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"];
	window.lastMonths = [];
	let wasYearChanged = false;
	let wasIndexChanged = false;
	window.allConversionsByDates = [];
	for (let x = 11; x >= 0; x--) {
		window.index = month - x;
		if (index < 0) {
			index = index + 12;
			if (!wasYearChanged) {
				year--;
				wasYearChanged = true;
			}
			wasIndexChanged = true;
		}
		if (index == 0 && wasIndexChanged) {
			year++;
		}
		lastMonths[Math.abs(x - 11)] = monthsInPolish[index] + " " + year;
		index += 1;
		if (index < 10) {
			index = "0" + index;
			if (index == "00") index = "12";
		}
		let thisDate = year + "-" + index + "-" + day;
		allConversionsByDates[11 - x] = await getRatesByDate(thisDate);
		allConversionsByDates[11 - x].EUR = 1;
	}
}
let hasChartBeenGenerated = false;
function chart(firstCurr, secondCurr, number) {
	let conversions = [];
	for (let x = 0; x <= 11; x++) {
		conversions[x] = String((number * Math.round((allConversionsByDates[x][secondCurr] / allConversionsByDates[x][firstCurr]) * 100)) / 100);
		// console.log(x);
		let afterDot = conversions[x].substr(conversions[x].indexOf(".") + 1);
		if (!conversions[x].includes(".")) {
			conversions[x] += ".00";
			afterDot = "00";
		}
		if (afterDot.length == 1) {
			afterDot += 0;
		}
		if (afterDot.length > 2) {
			afterDot = afterDot / Math.pow(10, afterDot.length - 2);
			if (afterDot < 12) {
				afterDot = Math.round(afterDot);
			} else {
				afterDot = Math.floor(afterDot);
			}
		}
	}

	let data = conversions;
	let label = firstCurr + " w porównaniu do " + secondCurr;
	let bgcolor = "rgba(0, 160, 0, .4)";
	let labels = lastMonths;

	const ctx = document.querySelector("#chart").getContext("2d");
	if (hasChartBeenGenerated) destroyChart();
	function generateChart() {
		hasChartBeenGenerated = true;
		window.mychart = new Chart(ctx, {
			type: "bar",
			data: {
				labels: labels,
				datasets: [
					{
						label: label,
						data: data,
						backgroundColor: bgcolor,
						borderColor: bgcolor,
						borderWidth: 2,
					},
				],
			},
			options: {
				legend: {
					onClick: null,
					labels: {
						boxWidth: 0,
					},
				},
				tooltips: {
					displayColors: false,
				},
			},
		});
	}
	function destroyChart() {
		mychart.destroy();
	}
	generateChart();
}
