import { ExchangeRateService } from "./exchangeRateService.js";
import { CurrencyConverter } from "./currencyConverter.js";
import { displayValueInElement } from "./utils/handleElements.js";
document.getElementById("fromCurrency").value = "EUR";
document.getElementById("toCurrency").value = "HUF";
try {
    ;
    document.getElementById("startDate").valueAsDate = new Date("2023-12-01");
}
catch (error) {
    ;
    document.getElementById("startDate").value = new Date("2023-12-01")
        .toLocaleDateString("hu-HU")
        .replace(/\s/g, "")
        .replace(/\./g, "-")
        .slice(0, 10);
}
try {
    ;
    document.getElementById("endDate").valueAsDate = new Date("2023-12-03");
}
catch (error) {
    ;
    document.getElementById("endDate").value = new Date("2023-12-03")
        .toLocaleDateString("hu-HU")
        .replace(/\s/g, "")
        .replace(/\./g, "-")
        .slice(0, 10);
}
const form = document.getElementById("currencyConverterForm");
if (form) {
    form.addEventListener("submit", (event) => {
        var _a, _b, _c, _d;
        event.preventDefault();
        const fromCurrency = (_a = document.getElementById("fromCurrency")) === null || _a === void 0 ? void 0 : _a.value;
        const toCurrency = (_b = document.getElementById("toCurrency")) === null || _b === void 0 ? void 0 : _b.value;
        const startDate = (_c = document.getElementById("startDate")) === null || _c === void 0 ? void 0 : _c.value;
        const endDate = (_d = document.getElementById("endDate")) === null || _d === void 0 ? void 0 : _d.value;
        let startDateAsDate;
        let endDateAsDate;
        if (typeof startDate == "string") {
            startDateAsDate = new Date(startDate);
        }
        else {
            startDateAsDate = startDate;
        }
        if (typeof endDate == "string") {
            endDateAsDate = new Date(endDate);
        }
        else {
            endDateAsDate = endDate;
        }
        const exchangeRateService = new ExchangeRateService();
        const currencyConverter = new CurrencyConverter(exchangeRateService);
        const conversionReport = currencyConverter.GenerateConversionReport(fromCurrency, toCurrency, startDateAsDate, endDateAsDate);
        displayValueInElement(conversionReport, "result");
    });
}
