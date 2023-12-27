import { ValidationError } from "./errors/validationError.js";
import { NotFoundError } from "./errors/notFoundError.js";
import { inputNames, validCurrencies } from "./configData.js";
export class CurrencyConverter {
    constructor(exchangeRateService) {
        this.exchangeRateService = exchangeRateService;
        this.FIXED_AMOUNT = 100;
    }
    Convert(amount, fromCurrency, toCurrency, currentDate) {
        this.validateAmount(amount);
        this.validateCurrencies(fromCurrency, toCurrency);
        this.validateDates(currentDate);
        const exchangeRate = this.getExchangeRate(fromCurrency, toCurrency, currentDate);
        const exchangeRateNumeric = this.validateExchangeRate(exchangeRate);
        return this.calculateConvertedAmount(amount, exchangeRateNumeric);
    }
    GenerateConversionReport(fromCurrency, toCurrency, startDate, endDate) {
        const conversions = [];
        const currentDate = new Date(startDate);
        this.validateCurrencies(fromCurrency, toCurrency);
        this.validateDates(startDate, endDate);
        while (currentDate <= endDate) {
            const exchangeRate = this.getExchangeRate(fromCurrency, toCurrency, currentDate);
            const exchangeRateNumeric = this.validateExchangeRate(exchangeRate);
            this.calculateConversion(exchangeRateNumeric, conversions, currentDate);
        }
        return `Conversion Report:\n${conversions.join("\n")}`;
    }
    validateCurrencies(fromCurrency, toCurrency) {
        this.validateCurrency(fromCurrency, inputNames.fromCurrency);
        this.validateCurrency(toCurrency, inputNames.toCurrency);
        this.validateCurrencySame(fromCurrency, toCurrency);
        fromCurrency = fromCurrency.toUpperCase();
        toCurrency = toCurrency.toUpperCase();
    }
    validateDates(startDate, endDate) {
        if (!endDate) {
            this.validateDate(startDate, inputNames.currentDate);
            return;
        }
        this.validateDate(startDate, inputNames.startDate);
        this.validateDate(endDate, inputNames.endDate);
        this.validateDateRange(startDate, endDate);
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
        if (isNaN(exchangeRate)) {
            const error = new ValidationError("Invalid EXCHANGE RATE returned.");
            throw error;
        }
        return Number(exchangeRate);
    }
    calculateConvertedAmount(amount, exchangeRate) {
        const convertedAmount = amount * exchangeRate;
        return Number(convertedAmount.toFixed(2));
    }
    validateAmount(amount) {
        if (isNaN(amount)) {
            throw new ValidationError(`Invalid ${inputNames.amount} input.`);
        }
    }
    validateCurrency(currency, name) {
        const notValidCurrency = !validCurrencies.includes(currency.toUpperCase());
        if (notValidCurrency) {
            throw new ValidationError(`Invalid ${name} input.`);
        }
    }
    validateCurrencySame(fromCurrency, toCurrency) {
        const currenciesAreSame = fromCurrency.toUpperCase() === toCurrency.toUpperCase();
        if (currenciesAreSame) {
            throw new ValidationError(`${inputNames.fromCurrency} and ${inputNames.toCurrency} must be different.`);
        }
    }
    validateDate(date, name) {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw new ValidationError(`Invalid ${name} input.`);
        }
    }
    validateDateRange(startDate, endDate) {
        if (endDate < startDate) {
            throw new ValidationError(`${inputNames.endDate} must be greater than or equal to ${inputNames.startDate}.`);
        }
    }
}
