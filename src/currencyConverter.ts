import { IExchangeRateService } from "./exchangeRateService"

export class CurrencyConverter {
	private readonly FIXED_AMOUNT = 100
	constructor(private exchangeRateService: IExchangeRateService) {}

	public Convert(amount: number, fromCurrency: string, toCurrency: string): number {
		this.validateAmount(amount)
		const exchangeRate = this.getExchangeRate(fromCurrency, toCurrency)
		this.validateExchangeRate(exchangeRate)
		return amount * exchangeRate
	}

	public GenerateConversionReport(
		fromCurrency: string,
		toCurrency: string,
		startDate: Date,
		endDate: Date
	): string {
		const conversions: number[] = []
		const currentDate = new Date(startDate)

		while (currentDate <= endDate) {
			const exchangeRate = this.exchangeRateService.getExchangeRate(fromCurrency, toCurrency)
			this.validateExchangeRate(exchangeRate)
			this.calculateConversion(exchangeRate, conversions, currentDate)
		}

		return `Conversion Report:\n${conversions.join("\n")}`
	}

	public ConvertAndDisplay(amount: number, fromCurrency: string, toCurrency: string): void {
		try {
			const convertedAmount = this.Convert(amount, fromCurrency, toCurrency)
			const resultDiv = document.getElementById("result")
			if (resultDiv) {
				resultDiv.innerText = `Converted Amount: ${convertedAmount}`
			} else {
				throw new Error("Result div not found.")
			}
		} catch (error) {
			console.error(error)
		}
	}

	private getExchangeRate(fromCurrency: string, toCurrency: string) {
		return this.exchangeRateService.getExchangeRate(fromCurrency, toCurrency)
	}

	private calculateConversion(exchangeRate: number, conversions: number[], currentDate: Date) {
		// Assume a fixed amount for simplicity
		const convertedAmount = this.FIXED_AMOUNT * exchangeRate
		conversions.push(convertedAmount)
		currentDate.setDate(currentDate.getDate() + 1)
	}

	private validateExchangeRate(exchangeRate: number) {
		if (!exchangeRate) {
			throw new Error("Unable to fetch exchange rate.")
		}

		if (isNaN(exchangeRate)) {
			throw new Error("Invalid exchange rate.")
		}
	}

	private validateAmount(amount: number) {
		if (isNaN(amount)) {
			throw new Error("Invalid amount input.")
		}
	}
}
