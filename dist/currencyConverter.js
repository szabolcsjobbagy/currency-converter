import { ValidationError } from "./errors/validationError.js";
import { NetworkError } from "./errors/networkError.js";
import { NotFoundError } from "./errors/notFoundError.js";
import { validCurrencies } from "./configData.js";
export class CurrencyConverter {
    constructor(exchangeRateService) {
        this.exchangeRateService = exchangeRateService;
        this.FIXED_AMOUNT = 100;
    }
    Convert(amount, fromCurrency, toCurrency, currentDate) {
        this.validateAmount(amount);
        this.validateCurrency(fromCurrency, "FROM CURRENCY");
        this.validateCurrency(toCurrency, "TO CURRENCY");
        this.validateCurrencySame(fromCurrency, toCurrency);
        this.validateDate(currentDate, "DATE");
        fromCurrency = fromCurrency.toUpperCase();
        toCurrency = toCurrency.toUpperCase();
        const exchangeRate = this.getExchangeRate(fromCurrency, toCurrency, currentDate);
        this.validateExchangeRate(exchangeRate);
        if (typeof exchangeRate == "number") {
            const convertedAmount = amount * exchangeRate;
            return Number(convertedAmount.toFixed(2));
        }
        else {
            throw new ValidationError("Invalid EXCHANGE RATE returned.");
        }
    }
    GenerateConversionReport(fromCurrency, toCurrency, startDate, endDate) {
        const conversions = [];
        const currentDate = new Date(startDate);
        this.validateCurrency(fromCurrency, "FROM CURRENCY");
        this.validateCurrency(toCurrency, "TO CURRENCY");
        this.validateCurrencySame(fromCurrency, toCurrency);
        this.validateDate(startDate, "START DATE");
        this.validateDate(endDate, "END DATE");
        this.validateDateRange(startDate, endDate);
        fromCurrency = fromCurrency.toUpperCase();
        toCurrency = toCurrency.toUpperCase();
        while (currentDate <= endDate) {
            const exchangeRate = this.getExchangeRate(fromCurrency, toCurrency, currentDate);
            this.validateExchangeRate(exchangeRate);
            if (typeof exchangeRate == "number") {
                this.calculateConversion(exchangeRate, conversions, currentDate);
            }
        }
        return `Conversion Report:\n${conversions.join("\n")}`;
    }
    getExchangeRate(fromCurrency, toCurrency, currentDate) {
        return this.exchangeRateService.getExchangeRate(fromCurrency, toCurrency, currentDate);
    }
    calculateConversion(exchangeRate, conversions, currentDate) {
        // Assume a fixed amount for simplicity
        const convertedAmount = this.FIXED_AMOUNT * exchangeRate;
        conversions.push(convertedAmount);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    validateExchangeRate(exchangeRate) {
        if (exchangeRate == "") {
            const error = new NotFoundError("EXCHANGE RATE not found.");
            throw error;
        }
        if (!exchangeRate) {
            const error = new NetworkError("Unable to fetch EXCHANGE RATE.");
            throw error;
        }
        if (isNaN(exchangeRate)) {
            const error = new ValidationError("Invalid EXCHANGE RATE returned.");
            throw error;
        }
    }
    validateAmount(amount) {
        if (isNaN(amount)) {
            throw new ValidationError("Invalid AMOUNT input.");
        }
    }
    validateCurrency(currency, currencyName) {
        if (!validCurrencies.includes(currency.toUpperCase())) {
            throw new ValidationError(`Invalid ${currencyName} input.`);
        }
    }
    validateCurrencySame(fromCurrency, toCurrency) {
        if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) {
            throw new ValidationError("FROM and TO CURRENCIES must be different.");
        }
    }
    validateDate(date, dateName) {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw new ValidationError(`Invalid ${dateName} input.`);
        }
    }
    validateDateRange(startDate, endDate) {
        if (endDate < startDate) {
            throw new ValidationError("END DATE must be greater than or equal to START DATE.");
        }
    }
}
