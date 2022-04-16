import { getCurrencies, getAllRates } from "../apiServices.js";

async function createSelect() {
	const currencies = await getCurrencies();
	for (let x = 0; x < Object.keys(currencies).length; x++) {
		let newCurrency1 = document.createElement("option");
		let newCurrency2 = document.createElement("option");
		newCurrency1.innerHTML = Object.keys(currencies)[x];
		newCurrency2.innerHTML = Object.keys(currencies)[x];
		document.querySelector("#currenciesSelectFirst").appendChild(newCurrency1);
		document.querySelector("#currenciesSelectSecond").appendChild(newCurrency2);
	}
	calculator();
}

createSelect();

const inputNumber = document.querySelector("#currenciesNumber");
inputNumber.addEventListener("input", replaceWrongCharacters);

async function replaceWrongCharacters() {
	let result = inputNumber.value.match(/([0-9.])/g);
	if (result != null) result = result.join("");
	inputNumber.value = result;
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
	let conversion = (numberCurr * Math.round((allRates[secondCurr] / allRates[firstCurr]) * 100)) / 100;
	document.querySelector("#calcResult").innerHTML = `${numberCurr} ${firstCurr} = ${conversion} ${secondCurr}`;
}
