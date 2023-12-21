import { mock, mockReset } from "jest-mock-extended"
import { IExchangeRateService } from "../src/exchangeRateService"
import { CurrencyConverter } from "../src/currencyConverter"
import { ValidationError } from "../src/errors/validationError"

// MOCKING the dependency class and create a new instance of the class
const mockedExchangeRateService = mock<IExchangeRateService>()

describe("CurrencyConverter class", () => {
	// SETUP phase --------------------------------------------------------

	// Define a variable to hold the instance of TESTED class
	let currencyConverter: CurrencyConverter

	beforeEach(() => {
		// RESET the mock to make sure that the mock has
		// no memory of any previous calls to its methods
		mockReset(mockedExchangeRateService)

		// Create a new instance of the TESTED class
		currencyConverter = new CurrencyConverter(mockedExchangeRateService)
	})

	// TESTING phase --------------------------------------------------------

	describe("Convert method", () => {
		const mock = mockedExchangeRateService.getExchangeRate

		describe("Happy path", () => {
			it("should return the converted amount when VALID inputs were added", () => {
				// Arrange --------------------------------------------------

				// Create dummy INPUT and OUTPUT values for the MOCKED dependency method
				const mockInput = {
					fromCurrency: "USD",
					toCurrency: "HUF",
				}

				const mockOutput = 351.12

				// If the MOCKED dependency method is called with the dummy INPUT values,
				// set the return value to the dummy OUTPUT value
				mock.calledWith(mockInput.fromCurrency, mockInput.toCurrency).mockReturnValue(
					mockOutput
				)

				// Create dummy INPUT and OUTPUT values for the TESTED method
				const sutInput = 100
				const sutOutput = 35112

				// Act ------------------------------------------------------

				// Call the TESTED method with the dummy INPUT values
				const result = currencyConverter.Convert(
					sutInput,
					mockInput.fromCurrency,
					mockInput.toCurrency
				)

				// Assert ----------------------------------------------------

				// Check the MOCKED dependency method -------------

				// if it was called the need number of times, with the dummy INPUT values
				expect(mock).toHaveBeenCalledTimes(1)
				expect(mock).toHaveBeenCalledWith(mockInput.fromCurrency, mockInput.toCurrency)

				// if it returned the dummy OUTPUT value
				expect(mock).toHaveReturnedWith(mockOutput)

				// Check the TESTED method ------------------------

				// if it returned the dummy OUTPUT value
				expect(result).toBe(sutOutput)
			})
		})

		describe("Error paths", () => {
			const inputFromCurrencyInvalid = {
				fromCurrency: "AAA",
				toCurrency: "HUF",
				sutAmount: 100,
			}

			const inputToCurrencyInvalid = {
				fromCurrency: "USD",
				toCurrency: "AAA",
				sutAmount: 100,
			}

			const inputAmountInvalid = {
				fromCurrency: "USD",
				toCurrency: "HUF",
				sutAmount: NaN,
			}

			it.each([
				[
					"invalid FROM CURRENCY input was added.",
					inputFromCurrencyInvalid,
					"Invalid FROM CURRENCY input.",
				],
				[
					"invalid TO CURRENCY input was added.",
					inputToCurrencyInvalid,
					"Invalid TO CURRENCY input.",
				],
			])("should throw Error if %s", (caseTitle, input, errorMsg) => {
				// Arrange --------------------------------------------------
				const error = new ValidationError(errorMsg)

				// Whenever the dependency method is called during this test,
				// it will throw an exception
				mock.mockImplementation(() => {
					throw error
				})

				// Act & Assert ----------------------------------------------------

				expect(() =>
					mockedExchangeRateService.getExchangeRate(input.fromCurrency, input.toCurrency)
				).toThrow(error)
				expect(() =>
					currencyConverter.Convert(input.sutAmount, input.fromCurrency, input.toCurrency)
				).toThrow(error)

				// Check if the mocked dependency method was called twice, with the dummy Input values
				expect(mock).toHaveBeenCalledTimes(2)
				expect(mock).toHaveBeenCalledWith(input.fromCurrency, input.toCurrency)
			})

			it.each([
				["invalid AMOUNT input was added.", inputAmountInvalid, "Invalid amount input."],
			])("should throw Error if %s", (caseTitle, input, errorMsg) => {
				// Arrange --------------------------------------------------
				const error = new ValidationError(errorMsg)

				// Act & Assert ----------------------------------------------------

				expect(() =>
					currencyConverter.Convert(input.sutAmount, input.fromCurrency, input.toCurrency)
				).toThrow(error)

				// Check if the mocked dependency method was NOT called
				expect(mock).toHaveBeenCalledTimes(0)
			})
		})
	})
})
