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
}

createSelect();

document.querySelector("#calcButton").addEventListener("click", calculator);
async function calculator() {
	let firstValue = document.querySelector("#currenciesSelectFirst").value;
	let secondValue = document.querySelector("#currenciesSelectSecond").value;
	const allRates = await getAllRates();
	allRates.EUR = 1;
	let conversion = Math.round((allRates[secondValue] / allRates[firstValue]) * 100) / 100;
	document.querySelector("#calcResult").innerHTML = `1 ${firstValue} = ${conversion} ${secondValue}`;
}
