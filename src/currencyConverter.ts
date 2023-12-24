import { IExchangeRateService } from "./exchangeRateService.js"
import { ValidationError } from "./errors/validationError.js"
import { NotFoundError } from "./errors/notFoundError.js"
import { validCurrencies } from "./configData.js"

export class CurrencyConverter {
	private readonly FIXED_AMOUNT = 100
	constructor(private exchangeRateService: IExchangeRateService) {}

	public Convert(
		amount: number,
		fromCurrency: string,
		toCurrency: string,
		currentDate: Date
	): number {
		this.validateAmount(amount)
		this.validateCurrency(fromCurrency, "FROM CURRENCY")
		this.validateCurrency(toCurrency, "TO CURRENCY")
		this.validateCurrencySame(fromCurrency, toCurrency)
		this.validateDate(currentDate, "DATE")

		fromCurrency = fromCurrency.toUpperCase()
		toCurrency = toCurrency.toUpperCase()

		const exchangeRate = this.getExchangeRate(fromCurrency, toCurrency, currentDate)
		const exchangeRateNumeric = this.validateExchangeRate(exchangeRate)

		return this.calculateConvertedAmount(amount, exchangeRateNumeric)
	}

	public GenerateConversionReport(
		fromCurrency: string,
		toCurrency: string,
		startDate: Date,
		endDate: Date
	): string {
		const conversions: number[] = []
		const currentDate = new Date(startDate)

		this.validateCurrency(fromCurrency, "FROM CURRENCY")
		this.validateCurrency(toCurrency, "TO CURRENCY")
		this.validateCurrencySame(fromCurrency, toCurrency)
		this.validateDate(startDate, "START DATE")
		this.validateDate(endDate, "END DATE")
		this.validateDateRange(startDate, endDate)

		fromCurrency = fromCurrency.toUpperCase()
		toCurrency = toCurrency.toUpperCase()

		while (currentDate <= endDate) {
			const exchangeRate = this.getExchangeRate(fromCurrency, toCurrency, currentDate)

			const exchangeRateNumeric = this.validateExchangeRate(exchangeRate)

			this.calculateConversion(exchangeRateNumeric, conversions, currentDate)
		}

		return `Conversion Report:\n${conversions.join("\n")}`
	}

	private getExchangeRate(fromCurrency: string, toCurrency: string, currentDate: Date) {
		return this.exchangeRateService.getExchangeRate(fromCurrency, toCurrency, currentDate)
	}

	private calculateConversion(exchangeRate: number, conversions: number[], currentDate: Date) {
		// Assume a fixed amount for simplicity
		const convertedAmount = this.FIXED_AMOUNT * exchangeRate

		conversions.push(convertedAmount)
		currentDate.setDate(currentDate.getDate() + 1)
	}

	private validateExchangeRate(exchangeRate: any): number {
		if (exchangeRate == "") {
			const error = new NotFoundError("EXCHANGE RATE not found.")
			throw error
		}

		if (isNaN(exchangeRate)) {
			const error = new ValidationError("Invalid EXCHANGE RATE returned.")
			throw error
		}

		return Number(exchangeRate)
	}

	private calculateConvertedAmount(amount: number, exchangeRate: number): number {
		const convertedAmount = amount * exchangeRate
		return Number(convertedAmount.toFixed(2))
	}

	private validateAmount(amount: number) {
		if (isNaN(amount)) {
			throw new ValidationError("Invalid AMOUNT input.")
		}
	}

	private validateCurrency(currency: string, currencyName: string) {
		if (!validCurrencies.includes(currency.toUpperCase())) {
			throw new ValidationError(`Invalid ${currencyName} input.`)
		}
	}

	private validateCurrencySame(fromCurrency: string, toCurrency: string) {
		if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) {
			throw new ValidationError("FROM and TO CURRENCIES must be different.")
		}
	}

	private validateDate(date: Date, dateName: string) {
		if (!(date instanceof Date) || isNaN(date.getTime())) {
			throw new ValidationError(`Invalid ${dateName} input.`)
		}
	}

	private validateDateRange(startDate: Date, endDate: Date): void {
		if (endDate < startDate) {
			throw new ValidationError("END DATE must be greater than or equal to START DATE.")
		}
	}
}
