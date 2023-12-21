import { IExchangeRateService } from "./exchangeRateService.js"
import { CurrencyConverter } from "./currencyConverter.js"

const form = document.getElementById("currencyConverterForm")
if (form) {
	form.addEventListener("submit", (event) => {
		event.preventDefault()

		const amount = +(document.getElementById("amount") as HTMLInputElement)?.value
		const fromCurrency = (document.getElementById("fromCurrency") as HTMLInputElement)?.value
		const toCurrency = (document.getElementById("toCurrency") as HTMLInputElement)?.value

		const exchangeRateService = new IExchangeRateService()
		const currencyConverter = new CurrencyConverter(exchangeRateService)
		currencyConverter.ConvertAndDisplay(amount, fromCurrency, toCurrency)
	})
}
