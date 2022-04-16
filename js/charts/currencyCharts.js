import { getAllRates, getCurrencies, getCurrencyRates } from "../apiServices.js";

async function createTable() {
	const table = document.querySelector(".currencyTable");
	const allRates = await getAllRates();
	const allCurrencies = await getCurrencies();
	for (const currency in allRates) {
		const newRow = document.createElement("tr");
		newRow.innerHTML = `
            <td>${currency} ${allCurrencies[currency]}</td>
            <td>${Math.round(allRates[currency] * 100) / 100}</td>
            <td class = 'showChart' id='${currency}'>Pokaż wykres</td>
        `;
		table.append(newRow);
	}
	return document.querySelectorAll(".showChart");
}

const showChartButtons = await createTable();

async function printChart(currency) {
	const historicalRates = await getCurrencyRates(currency);
	const dates = [];
	const rates = [];
	const currencyName = document.querySelector("#currencyName");
	currencyName.textContent = currency;
	for (const date in historicalRates) {
		dates.push(date);
		rates.push(historicalRates[date][currency]);
	}

	const ctx = document.getElementById("chart").getContext("2d");
	const myChart = new Chart(ctx, {
		type: "line",
		data: {
			labels: dates,
			datasets: [
				{
					label: "Wartość",
					data: rates,
					backgroundColor: ["rgb(0,0,0)"],
					borderColor: ["rgb(0,0,0)"],
					borderWidth: 1,
				},
			],
		},
	});
	return new Promise(resolve => resolve(myChart));
}

let actualChart = await printChart("PLN");

showChartButtons.forEach(button => {
	button.addEventListener("click", async () => {
		actualChart.destroy();
		actualChart = await printChart(button.id);
	});
});
