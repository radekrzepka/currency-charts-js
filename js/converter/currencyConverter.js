import { getCurrencies, getAllRates } from "../apiServices.js";

async function createSelect() {
	const currencies = await getCurrencies();
	for (let x = 0; x < Object.keys(currencies).length; x++) {
		let newCurrency1 = document.createElement("option");
		let newCurrency2 = document.createElement("option");
		newCurrency1.innerHTML = Object.keys(currencies)[x];
		newCurrency2.innerHTML = Object.keys(currencies)[x];
		if (x == 8) newCurrency1.selected = "selected";
		if (x == 24) newCurrency2.selected = "selected";
		document.querySelector("#currenciesSelectFirst").appendChild(newCurrency1);
		document.querySelector("#currenciesSelectSecond").appendChild(newCurrency2);
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
	let dotcount = 0;
	let firstdot = 14;
	for (let i = 0; i < number.length; i++) {
		if (number.charAt(i) == "." || number.charAt(i) == ",") {
			dotcount += 1;
		}
	}
	if (dotcount > 1) {
		for (let i = 0; i < number.length; i++) {
			if (number.charAt(i) == "." || number.charAt(i) == ",") {
				if (i < firstdot) firstdot = i;
				if (i != firstdot) number = number.slice(0, i) + number.slice(i + 1);
			}
		}
	}
	number = number.replace(",", ".");
	inputNumber.value = number;
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
	const allRates = await getAllRates(currenciesNumber);
	allRates.EUR = 1;
	let conversion = String((numberCurr * Math.round((allRates[secondCurr] / allRates[firstCurr]) * 100)) / 100);
	let afterdot = conversion.substr(conversion.indexOf(".") + 1);
	if (!conversion.includes(".")) {
		conversion += ".00";
	}
	if (afterdot.length == 1) {
		afterdot += 0;
	}
	if (afterdot.length > 2) {
		afterdot = afterdot / Math.pow(10, afterdot.length - 2);
		if (afterdot < 14) {
			afterdot = Math.round(afterdot);
		} else {
			afterdot = Math.floor(afterdot);
		}
	}
	let beforedot = conversion.slice(0, conversion.lastIndexOf("."));
	conversion = beforedot + "." + afterdot;
	if (conversion == "NaN.NaN") conversion = "0.00";
	document.querySelector("#calcResult").innerHTML = `${conversion}`;
}
