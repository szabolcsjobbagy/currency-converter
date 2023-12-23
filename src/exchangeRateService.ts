export class IExchangeRateService {
	public getExchangeRate(
		fromCurrency: string,
		toCurrency: string,
		currentDate: Date = new Date()
	) {
		const dateString = currentDate.toISOString().split("T")[0]
		const conversionData = [
			{
				date: "2023-12-01",
				fromCurrency: "EUR",
				toCurrency: "HUF",
				rate: 382.15,
			},
			{
				date: "2023-12-01",
				fromCurrency: "USD",
				toCurrency: "HUF",
				rate: 351.27,
			},
			{
				date: "2023-12-02",
				fromCurrency: "EUR",
				toCurrency: "HUF",
				rate: 381.32,
			},
			{
				date: "2023-12-02",
				fromCurrency: "USD",
				toCurrency: "HUF",
				rate: 350.03,
			},
			{
				date: "2023-12-03",
				fromCurrency: "EUR",
				toCurrency: "HUF",
				rate: 383.07,
			},
			{
				date: "2023-12-03",
				fromCurrency: "USD",
				toCurrency: "HUF",
				rate: 352.12,
			},
			{
				date: "2023-12-04",
				fromCurrency: "EUR",
				toCurrency: "HUF",
				rate: "invalid rate",
			},
		]

		// For 2023-12-04, for EUR the exchange rate is invalid, for USD it is missing
		// to help testing the error handling

		try {
			const conversionDataItem = conversionData.find(
				(item) =>
					item.fromCurrency === fromCurrency &&
					item.toCurrency === toCurrency &&
					item.date === dateString
			)

			if (conversionDataItem) {
				const result = conversionDataItem.rate
				return result
			} else {
				return ""
			}
		} catch (error) {
			const conversionDataItem = conversionData.find(
				(item) =>
					item.fromCurrency === toCurrency &&
					item.toCurrency === fromCurrency &&
					item.date === dateString
			)

			if (conversionDataItem) {
				const result = conversionDataItem.rate
				return result
			} else {
				return ""
			}
		}
	}
}
