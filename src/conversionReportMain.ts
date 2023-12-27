import { ExchangeRateService } from "./exchangeRateService.js"
import { CurrencyConverter } from "./currencyConverter.js"
import { displayValueInElement } from "./utils/handleElements.js"
;(document.getElementById("fromCurrency") as HTMLInputElement).value = "EUR"
;(document.getElementById("toCurrency") as HTMLInputElement).value = "HUF"

try {
	;(document.getElementById("startDate") as HTMLInputElement).valueAsDate = new Date("2023-12-01")
} catch (error) {
	;(document.getElementById("startDate") as HTMLInputElement).value = new Date("2023-12-01")
		.toLocaleDateString("hu-HU")
		.replace(/\s/g, "")
		.replace(/\./g, "-")
		.slice(0, 10)
}

try {
	;(document.getElementById("endDate") as HTMLInputElement).valueAsDate = new Date("2023-12-03")
} catch (error) {
	;(document.getElementById("endDate") as HTMLInputElement).value = new Date("2023-12-03")
		.toLocaleDateString("hu-HU")
		.replace(/\s/g, "")
		.replace(/\./g, "-")
		.slice(0, 10)
}

const form = document.getElementById("currencyConverterForm")
if (form) {
	form.addEventListener("submit", (event) => {
		event.preventDefault()

		const fromCurrency = (document.getElementById("fromCurrency") as HTMLInputElement)?.value
		const toCurrency = (document.getElementById("toCurrency") as HTMLInputElement)?.value
		const startDate = (document.getElementById("startDate") as HTMLInputElement)?.value
		const endDate = (document.getElementById("endDate") as HTMLInputElement)?.value

		let startDateAsDate: Date
		let endDateAsDate: Date

		if (typeof startDate == "string") {
			startDateAsDate = new Date(startDate)
		} else {
			startDateAsDate = startDate
		}

		if (typeof endDate == "string") {
			endDateAsDate = new Date(endDate)
		} else {
			endDateAsDate = endDate
		}

		const exchangeRateService = new ExchangeRateService()
		const currencyConverter = new CurrencyConverter(exchangeRateService)
		const conversionReport = currencyConverter.GenerateConversionReport(
			fromCurrency,
			toCurrency,
			startDateAsDate,
			endDateAsDate
		)

		displayValueInElement(conversionReport, "result")
	})
}
