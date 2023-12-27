export interface IExchangeRateService {
	getExchangeRate(fromCurrency: string, toCurrency: string, currentDate: Date): any
}
