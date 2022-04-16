const baseUrl = "api.frankfurter.app";

export async function getCurrencies() {
	return new Promise(resolve => {
		fetch(`https://${baseUrl}/currencies`)
			.then(resp => resp.json())
			.then(data => resolve(data));
	});
}

export async function getAllRates() {
	const currencies = await getCurrencies();
	let currenciesUrl = `https://${baseUrl}/latest?to=`;
	const currenciesLength = Object.keys(currencies).length;
	let index = 0;
	for (const key in currencies) {
		if (currenciesLength - 1 == index) currenciesUrl += `${key}`;
		else currenciesUrl += `${key},`;
		index++;
	}
	return new Promise(resolve => {
		fetch(currenciesUrl)
			.then(resp => resp.json())
			.then(data => resolve(data.rates));
	});
}

export async function getCurrencyRates(rate) {
	return new Promise(resolve => {
		fetch(`https://${baseUrl}/2019-01-01..?to=${rate}`)
			.then(resp => resp.json())
			.then(data => resolve(data.rates));
	});
}
