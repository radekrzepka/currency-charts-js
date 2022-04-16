import { getAllRates, getCurrencies } from "../apiServices.js";

async function createTable() {
	const table = document.querySelector(".currencyTable");
	const allRates = await getAllRates();
	const allCurrencies = await getCurrencies();
	allRates.EUR = 1;
	for (const currency in allRates) {
		const newRow = document.createElement("tr");
		newRow.innerHTML = `
            <td>${currency} ${allCurrencies[currency]}</td>
            <td>${Math.round((allRates[currency] / allRates.PLN) * 100) / 100}</td>
            <td>Pokaż wykres</td>
        `;
		table.append(newRow);
	}
}

createTable();
