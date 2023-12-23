import { IExchangeRateService } from "./exchangeRateService.js";
import { CurrencyConverter } from "./currencyConverter.js";
import { displayValueInElement } from "./utils/handleElements.js";
document.getElementById("amount").value = "100.25";
document.getElementById("fromCurrency").value = "EUR";
document.getElementById("toCurrency").value = "HUF";
try {
    ;
    document.getElementById("currentDate").valueAsDate = new Date("2023-12-01");
}
catch (error) {
    ;
    document.getElementById("currentDate").value = new Date("2023-12-01")
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
        const amount = +((_a = document.getElementById("amount")) === null || _a === void 0 ? void 0 : _a.value);
        const fromCurrency = (_b = document.getElementById("fromCurrency")) === null || _b === void 0 ? void 0 : _b.value;
        const toCurrency = (_c = document.getElementById("toCurrency")) === null || _c === void 0 ? void 0 : _c.value;
        const currentDate = (_d = document.getElementById("currentDate")) === null || _d === void 0 ? void 0 : _d.value;
        let currentDateAsDate;
        if (typeof currentDate == "string") {
            currentDateAsDate = new Date(currentDate);
        }
        else {
            currentDateAsDate = currentDate;
        }
        const exchangeRateService = new IExchangeRateService();
        const currencyConverter = new CurrencyConverter(exchangeRateService);
        const convertedAmount = currencyConverter.Convert(amount, fromCurrency, toCurrency, currentDateAsDate);
        displayValueInElement("Converted Amount: " + convertedAmount, "result");
    });
}
