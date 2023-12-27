import { ExchangeRateService } from "./exchangeRateService.js"
import { CurrencyConverter } from "./currencyConverter.js"
import { displayValueInElement } from "./utils/handleElements.js"
;(document.getElementById("amount") as HTMLInputElement).value = "100.25"
;(document.getElementById("fromCurrency") as HTMLInputElement).value = "EUR"
;(document.getElementById("toCurrency") as HTMLInputElement).value = "HUF"

try {
	;(document.getElementById("currentDate") as HTMLInputElement).valueAsDate = new Date(
		"2023-12-01"
	)
} catch (error) {
	;(document.getElementById("currentDate") as HTMLInputElement).value = new Date("2023-12-01")
		.toLocaleDateString("hu-HU")
		.replace(/\s/g, "")
		.replace(/\./g, "-")
		.slice(0, 10)
}

const form = document.getElementById("currencyConverterForm")
if (form) {
	form.addEventListener("submit", (event) => {
		event.preventDefault()

		const amount = +(document.getElementById("amount") as HTMLInputElement)?.value
		const fromCurrency = (document.getElementById("fromCurrency") as HTMLInputElement)?.value
		const toCurrency = (document.getElementById("toCurrency") as HTMLInputElement)?.value
		const currentDate = (document.getElementById("currentDate") as HTMLInputElement)?.value

		let currentDateAsDate: Date

		if (typeof currentDate == "string") {
			currentDateAsDate = new Date(currentDate)
		} else {
			currentDateAsDate = currentDate
		}

		const exchangeRateService = new ExchangeRateService()
		const currencyConverter = new CurrencyConverter(exchangeRateService)
		const convertedAmount = currencyConverter.Convert(
			amount,
			fromCurrency,
			toCurrency,
			currentDateAsDate
		)
		displayValueInElement("Converted Amount: " + convertedAmount, "result")
	})
}
