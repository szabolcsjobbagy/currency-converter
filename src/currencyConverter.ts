import { ExchangeRateService } from "./exchangeRateService.js"
import { ValidationError } from "./errors/validationError.js"
import { NotFoundError } from "./errors/notFoundError.js"
import { inputNames, validCurrencies } from "./configData.js"

export class CurrencyConverter {
	private readonly FIXED_AMOUNT = 100
	constructor(private exchangeRateService: ExchangeRateService) {}

	public Convert(
		amount: number,
		fromCurrency: string,
		toCurrency: string,
		currentDate: Date
	): number {
		this.validateAmount(amount)
		this.validateCurrencies(fromCurrency, toCurrency)
		this.validateDates(currentDate)

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

		this.validateCurrencies(fromCurrency, toCurrency)
		this.validateDates(startDate, endDate)

		while (currentDate <= endDate) {
			const exchangeRate = this.getExchangeRate(fromCurrency, toCurrency, currentDate)

			const exchangeRateNumeric = this.validateExchangeRate(exchangeRate)

			this.calculateConversion(exchangeRateNumeric, conversions, currentDate)
		}

		return `Conversion Report:\n${conversions.join("\n")}`
	}

	private validateCurrencies(fromCurrency: string, toCurrency: string) {
		this.validateCurrency(fromCurrency, inputNames.fromCurrency)
		this.validateCurrency(toCurrency, inputNames.toCurrency)
		this.validateCurrencySame(fromCurrency, toCurrency)

		fromCurrency = fromCurrency.toUpperCase()
		toCurrency = toCurrency.toUpperCase()
	}

	private validateDates(startDate: Date, endDate?: Date) {
		if (!endDate) {
			this.validateDate(startDate, inputNames.currentDate)
			return
		}

		this.validateDate(startDate, inputNames.startDate)
		this.validateDate(endDate, inputNames.endDate)
		this.validateDateRange(startDate, endDate)
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
			throw new ValidationError(`Invalid ${inputNames.amount} input.`)
		}
	}

	private validateCurrency(currency: string, name: string) {
		const notValidCurrency = !validCurrencies.includes(currency.toUpperCase())

		if (notValidCurrency) {
			throw new ValidationError(`Invalid ${name} input.`)
		}
	}

	private validateCurrencySame(fromCurrency: string, toCurrency: string) {
		const currenciesAreSame = fromCurrency.toUpperCase() === toCurrency.toUpperCase()
		if (currenciesAreSame) {
			throw new ValidationError(
				`${inputNames.fromCurrency} and ${inputNames.toCurrency} must be different.`
			)
		}
	}

	private validateDate(date: Date, name: string) {
		if (!(date instanceof Date) || isNaN(date.getTime())) {
			throw new ValidationError(`Invalid ${name} input.`)
		}
	}

	private validateDateRange(startDate: Date, endDate: Date): void {
		if (endDate < startDate) {
			throw new ValidationError(
				`${inputNames.endDate} must be greater than or equal to ${inputNames.startDate}.`
			)
		}
	}
}
