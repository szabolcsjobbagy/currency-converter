export class IExchangeRateService {
	public getExchangeRate(fromCurrency: string, toCurrency: string): number {
		const exchangeRatesForCurrencies: { [key: string]: any } = {
			USD: {
				USD: 1.0,
				HUF: 351.12,
				EUR: 0.91,
			},
			HUF: {
				USD: 0.0028,
				EUR: 0.0026,
				HUF: 1.0,
			},
			EUR: {
				USD: 1.1,
				EUR: 1.0,
				HUF: 385.0,
			},
		}

		return exchangeRatesForCurrencies[fromCurrency][toCurrency]
	}
}
