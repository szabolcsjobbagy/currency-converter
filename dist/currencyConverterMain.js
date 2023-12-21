import { IExchangeRateService } from "./exchangeRateService.js";
import { CurrencyConverter } from "./currencyConverter.js";
const form = document.getElementById("currencyConverterForm");
if (form) {
    form.addEventListener("submit", (event) => {
        var _a, _b, _c;
        event.preventDefault();
        const amount = +((_a = document.getElementById("amount")) === null || _a === void 0 ? void 0 : _a.value);
        const fromCurrency = (_b = document.getElementById("fromCurrency")) === null || _b === void 0 ? void 0 : _b.value;
        const toCurrency = (_c = document.getElementById("toCurrency")) === null || _c === void 0 ? void 0 : _c.value;
        const exchangeRateService = new IExchangeRateService();
        const currencyConverter = new CurrencyConverter(exchangeRateService);
        currencyConverter.ConvertAndDisplay(amount, fromCurrency, toCurrency);
    });
}
