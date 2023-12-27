import { IExchangeRateService } from "./iExchangeRateService"

export class ExchangeRateService implements IExchangeRateService {
	public getExchangeRate(
		fromCurrency: string,
		toCurrency: string,
		currentDate: Date = new Date()
	) {
		const dateString = this.convertDateToString(currentDate)

		const conversionData = this.getConversionData()

		// For 2023-12-04, for EUR the exchange rate is invalid, for USD it is missing
		// to help testing the error handling

		const conversionDataItem = this.findMatchingItem(
			conversionData,
			fromCurrency,
			toCurrency,
			dateString
		)

		if (conversionDataItem) {
			return conversionDataItem.rate
		} else {
			const conversionDataItem = this.findMatchingItem(
				conversionData,
				toCurrency,
				fromCurrency,
				dateString
			)

			return this.getExchangeRateFromItem(conversionDataItem)
		}
	}

	private getConversionData() {
		return [
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
	}

	private getExchangeRateFromItem(item: any) {
		const exchangeRateIsNumber = item && typeof item.rate === "number"
		let result

		if (exchangeRateIsNumber) {
			result = 1 / Number(item.rate)
		} else {
			result = ""
		}

		return result
	}

	private findMatchingItem(
		conversionData: (
			| { date: string; fromCurrency: string; toCurrency: string; rate: number }
			| { date: string; fromCurrency: string; toCurrency: string; rate: string }
		)[],
		fromCurrency: string,
		toCurrency: string,
		dateString: string
	) {
		return conversionData.find(
			(item) =>
				item.fromCurrency === fromCurrency &&
				item.toCurrency === toCurrency &&
				item.date === dateString
		)
	}

	private convertDateToString(currentDate: Date) {
		return currentDate.toISOString().split("T")[0]
	}
}
