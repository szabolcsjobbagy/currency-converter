export class CurrencyConverter {
    constructor(exchangeRateService) {
        this.exchangeRateService = exchangeRateService;
        this.FIXED_AMOUNT = 100;
    }
    Convert(amount, fromCurrency, toCurrency) {
        this.validateAmount(amount);
        const exchangeRate = this.getExchangeRate(fromCurrency, toCurrency);
        this.validateExchangeRate(exchangeRate);
        return amount * exchangeRate;
    }
    GenerateConversionReport(fromCurrency, toCurrency, startDate, endDate) {
        const conversions = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const exchangeRate = this.exchangeRateService.getExchangeRate(fromCurrency, toCurrency);
            this.validateExchangeRate(exchangeRate);
            this.calculateConversion(exchangeRate, conversions, currentDate);
        }
        return `Conversion Report:\n${conversions.join("\n")}`;
    }
    ConvertAndDisplay(amount, fromCurrency, toCurrency) {
        try {
            const convertedAmount = this.Convert(amount, fromCurrency, toCurrency);
            const resultDiv = document.getElementById("result");
            if (resultDiv) {
                resultDiv.innerText = `Converted Amount: ${convertedAmount}`;
            }
            else {
                throw new Error("Result div not found.");
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    getExchangeRate(fromCurrency, toCurrency) {
        return this.exchangeRateService.getExchangeRate(fromCurrency, toCurrency);
    }
    calculateConversion(exchangeRate, conversions, currentDate) {
        // Assume a fixed amount for simplicity
        const convertedAmount = this.FIXED_AMOUNT * exchangeRate;
        conversions.push(convertedAmount);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    validateExchangeRate(exchangeRate) {
        if (!exchangeRate) {
            throw new Error("Unable to fetch exchange rate.");
        }
        if (isNaN(exchangeRate)) {
            throw new Error("Invalid exchange rate.");
        }
    }
    validateAmount(amount) {
        if (isNaN(amount)) {
            throw new Error("Invalid amount input.");
        }
    }
}
