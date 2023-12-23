import { mock, mockReset } from "jest-mock-extended"
import { IExchangeRateService } from "../src/exchangeRateService"
import { CurrencyConverter } from "../src/currencyConverter"
import { ValidationError } from "../src/errors/validationError"
import { NotFoundError } from "../src/errors/notFoundError"
import { NetworkError } from "../src/errors/networkError"

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
		const mockedFn = mockedExchangeRateService.getExchangeRate

		describe("Happy paths", () => {
			const validInputDataPositiveAmount = {
				fromCurrency: "USD",
				toCurrency: "HUF",
				amount: 100.25,
				currentDate: new Date("2023-12-01"),
			}

			const validInputDataPNegativeAmount = {
				fromCurrency: "USD",
				toCurrency: "HUF",
				amount: -100.25,
				currentDate: new Date("2023-12-01"),
			}

			const validInputDataZeroAmount = {
				fromCurrency: "USD",
				toCurrency: "HUF",
				amount: 0,
				currentDate: new Date("2023-12-01"),
			}

			it.each([
				[
					"valid inputs and POSITIVE AMOUNT were added",
					validInputDataPositiveAmount,
					{ mockOutput: 351.27, sutOutput: 35214.82 },
				],
				[
					"valid inputs and NEGATIVE AMOUNT were added",
					validInputDataPNegativeAmount,
					{ mockOutput: 351.27, sutOutput: -35214.82 },
				],
				[
					"valid inputs and ZERO AMOUNT were added",
					validInputDataZeroAmount,
					{ mockOutput: 351.27, sutOutput: 0 },
				],
			])("should return the converted amount if %s", (caseTitle, input, output) => {
				// Arrange --------------------------------------------------

				// If the MOCKED dependency method is called with the dummy INPUT values,
				// set the return value to the dummy OUTPUT value
				mockedFn
					.calledWith(input.fromCurrency, input.toCurrency, input.currentDate)
					.mockReturnValue(output.mockOutput)

				// Act ------------------------------------------------------

				// Call the TESTED method with the dummy INPUT values
				const result = currencyConverter.Convert(
					input.amount,
					input.fromCurrency,
					input.toCurrency,
					input.currentDate
				)

				// Assert ----------------------------------------------------

				// Check the MOCKED dependency method -------------

				// if it was called the needed number of times, with the dummy INPUT values
				expect(mockedFn).toHaveBeenCalledTimes(1)
				expect(mockedFn).toHaveBeenCalledWith(
					input.fromCurrency,
					input.toCurrency,
					input.currentDate
				)

				// if it returned the dummy OUTPUT value
				expect(mockedFn).toHaveReturnedWith(output.mockOutput)

				// Check the TESTED method ------------------------

				// if it returned the dummy OUTPUT value
				expect(result).toBe(output.sutOutput)
			})
		})

		describe("Error paths", () => {
			// Error paths where Mocked dependency method is NOT called -------
			const invalidInputAmount = {
				fromCurrency: "USD",
				toCurrency: "HUF",
				amount: NaN,
				currentDate: new Date("2023-12-01"),
			}

			const invalidInputFromCurrency = {
				fromCurrency: "AAA",
				toCurrency: "HUF",
				amount: 100.25,
				currentDate: new Date("2023-12-01"),
			}

			const invalidInputToCurrency = {
				fromCurrency: "USD",
				toCurrency: "AAA",
				amount: 100.25,
				currentDate: new Date("2023-12-01"),
			}

			const invalidInputSameFromAndToCurrency = {
				fromCurrency: "USD",
				toCurrency: "USD",
				amount: 100.25,
				currentDate: new Date("2023-12-01"),
			}

			const invalidInputDate = {
				fromCurrency: "EUR",
				toCurrency: "HUF",
				amount: 100.25,
				currentDate: new Date("Invalid date"),
			}

			// Error paths where Mocked dependency method is CALLED -------
			const invalidReturnedExchangeRate = {
				fromCurrency: "EUR",
				toCurrency: "HUF",
				amount: 100.25,
				currentDate: new Date("2023-12-04"),
			}
			const exchangeRateNotFound = {
				fromCurrency: "USD",
				toCurrency: "HUF",
				amount: 100.25,
				currentDate: new Date("2023-12-04"),
			}

			// Error paths where Mocked dependency method is NOT ACCESSIBLE -------
			const exchangeRateServiceNotAccessible = {
				fromCurrency: "EUR",
				toCurrency: "HUF",
				amount: 100.25,
				currentDate: new Date("2023-12-03"),
			}

			// Error paths where Mocked dependency method is NOT called -------
			it.each([
				["invalid AMOUNT input was added", invalidInputAmount, "Invalid AMOUNT input."],
				[
					"invalid FROM CURRENCY input was added",
					invalidInputFromCurrency,
					"Invalid FROM CURRENCY input.",
				],
				[
					"invalid TO CURRENCY input was added",
					invalidInputToCurrency,
					"Invalid TO CURRENCY input.",
				],
				[
					"FROM CURRENCY and TO CURRENCY inputs are the same",
					invalidInputSameFromAndToCurrency,
					"FROM and TO CURRENCIES must be different.",
				],
				["invalid DATE input was added", invalidInputDate, "Invalid DATE input."],
			])("should throw ValidationError if %s", (caseTitle, input, errorMsg) => {
				// Arrange --------------------------------------------------
				const error = new ValidationError(errorMsg)

				// Act & Assert ----------------------------------------------------

				expect(() =>
					currencyConverter.Convert(
						input.amount,
						input.fromCurrency,
						input.toCurrency,
						input.currentDate
					)
				).toThrow(error)

				// Check if the mocked dependency method was NOT called
				expect(mockedFn).toHaveBeenCalledTimes(0)
			})

			// Error paths where Mocked dependency method is CALLED -------
			it.each([
				[
					"invalid EXCHANGE RATE is returned",
					invalidReturnedExchangeRate,
					"Invalid EXCHANGE RATE returned.",
				],
			])("should throw ValidationError if %s", (caseTitle, input, errorMsg) => {
				// Arrange --------------------------------------------------
				const error = new ValidationError(errorMsg)

				// Whenever the dependency method is called during this test,
				// it will throw an exception
				mockedFn.mockImplementation(() => {
					throw error
				})

				// Act & Assert ----------------------------------------------------

				expect(() =>
					mockedExchangeRateService.getExchangeRate(
						input.fromCurrency,
						input.toCurrency,
						input.currentDate
					)
				).toThrow(error)
				expect(() =>
					currencyConverter.Convert(
						input.amount,
						input.fromCurrency,
						input.toCurrency,
						input.currentDate
					)
				).toThrow(error)

				// Check if the mocked method was called needed number of times, with the dummy Input values
				expect(mockedFn).toHaveBeenCalledTimes(2)
				expect(mockedFn).toHaveBeenCalledWith(
					input.fromCurrency,
					input.toCurrency,
					input.currentDate
				)
			})

			it.each([
				["EXCHANGE RATE is not found", exchangeRateNotFound, "EXCHANGE RATE not found."],
			])("should throw NotFoundError if %s", (caseTitle, input, errorMsg) => {
				// Arrange --------------------------------------------------
				const error = new NotFoundError(errorMsg)

				// Whenever the dependency method is called during this test,
				// it will throw an exception
				mockedFn.mockImplementation(() => {
					throw error
				})

				// Act & Assert ----------------------------------------------------

				expect(() =>
					mockedExchangeRateService.getExchangeRate(
						input.fromCurrency,
						input.toCurrency,
						input.currentDate
					)
				).toThrow(error)
				expect(() =>
					currencyConverter.Convert(
						input.amount,
						input.fromCurrency,
						input.toCurrency,
						input.currentDate
					)
				).toThrow(error)

				// Check if the mocked method was called needed number of times, with the dummy Input values
				expect(mockedFn).toHaveBeenCalledTimes(2)
				expect(mockedFn).toHaveBeenCalledWith(
					input.fromCurrency,
					input.toCurrency,
					input.currentDate
				)
			})

			// Error paths where Mocked dependency method is NOT ACCESSIBLE -------
			it.each([
				[
					"EXCHANGE RATE SERVICE is not accessible",
					exchangeRateServiceNotAccessible,
					"Unable to fetch EXCHANGE RATE.",
				],
			])("should throw NetworkError if %s", (caseTitle, input, errorMsg) => {
				// Arrange --------------------------------------------------
				const error = new NetworkError(errorMsg)

				// Whenever the dependency method is called during this test,
				// it will throw an exception
				mockedFn.mockImplementation(() => {
					throw error
				})

				// Act & Assert ----------------------------------------------------

				expect(() =>
					mockedExchangeRateService.getExchangeRate(
						input.fromCurrency,
						input.toCurrency,
						input.currentDate
					)
				).toThrow(error)
				expect(() =>
					currencyConverter.Convert(
						input.amount,
						input.fromCurrency,
						input.toCurrency,
						input.currentDate
					)
				).toThrow(error)

				// Check if the mocked method was called needed number of times, with the dummy Input values
				expect(mockedFn).toHaveBeenCalledTimes(2)
				expect(mockedFn).toHaveBeenCalledWith(
					input.fromCurrency,
					input.toCurrency,
					input.currentDate
				)
			})
		})
	})

	describe("GenerateConversionReport method", () => {
		const mockedFn = mockedExchangeRateService.getExchangeRate

		describe("Happy paths", () => {
			const validInputData = {
				fromCurrency: "USD",
				toCurrency: "HUF",
				currentDates: [
					new Date("2023-12-01"),
					new Date("2023-12-02"),
					new Date("2023-12-03"),
				],
			}

			it.each([
				[
					"valid inputs were added",
					validInputData,
					{
						mockOutput: [351.27, 350.03, 352.12],
						sutOutput: "Conversion Report:\n35127\n35003\n35212",
					},
				],
			])("should return the conversion report if %s", (caseTitle, input, output) => {
				// Arrange --------------------------------------------------

				// Set the return values to the dummy OUTPUT values for the 3 calls
				mockedFn
					.mockReturnValueOnce(output.mockOutput[0])
					.mockReturnValueOnce(output.mockOutput[1])
					.mockReturnValueOnce(output.mockOutput[2])

				// Act ------------------------------------------------------

				// Call the TESTED method with the dummy INPUT values
				const result = currencyConverter.GenerateConversionReport(
					input.fromCurrency,
					input.toCurrency,
					input.currentDates[0],
					input.currentDates[2]
				)

				// Assert ----------------------------------------------------

				// Check the MOCKED dependency method -------------

				// if it was called the needed number of times, with the dummy INPUT values
				expect(mockedFn).toHaveBeenCalledTimes(3)

				// if it returned the dummy OUTPUT value
				expect(mockedFn).toHaveNthReturnedWith(1, output.mockOutput[0])
				expect(mockedFn).toHaveNthReturnedWith(2, output.mockOutput[1])
				expect(mockedFn).toHaveNthReturnedWith(3, output.mockOutput[2])

				// Check the TESTED method ------------------------

				// if it returned the dummy OUTPUT value
				expect(result).toBe(output.sutOutput)
			})
		})

		describe("Error paths", () => {
			// Error paths where Mocked dependency method is NOT called -------
			const invalidInputFromCurrency = {
				fromCurrency: "AAA",
				toCurrency: "HUF",
				startDate: new Date("2023-12-01"),
				endDate: new Date("2023-12-03"),
			}

			const invalidInputToCurrency = {
				fromCurrency: "USD",
				toCurrency: "AAA",
				startDate: new Date("2023-12-01"),
				endDate: new Date("2023-12-03"),
			}

			const invalidInputSameFromAndToCurrency = {
				fromCurrency: "USD",
				toCurrency: "USD",
				startDate: new Date("2023-12-01"),
				endDate: new Date("2023-12-03"),
			}

			const invalidInputStartDate = {
				fromCurrency: "USD",
				toCurrency: "HUF",
				startDate: new Date("invalid date"),
				endDate: new Date("2023-12-03"),
			}

			const invalidInputEndDate = {
				fromCurrency: "USD",
				toCurrency: "HUF",
				startDate: new Date("2023-12-01"),
				endDate: new Date("invalid date"),
			}

			const invalidDateRange = {
				fromCurrency: "USD",
				toCurrency: "HUF",
				startDate: new Date("2023-12-03"),
				endDate: new Date("2023-12-01"),
			}

			// Error paths where Mocked dependency method is CALLED -------
			const invalidReturnedExchangeRate = {
				fromCurrency: "EUR",
				toCurrency: "HUF",
				startDate: new Date("2023-12-02"),
				endDate: new Date("2023-12-04"),
			}

			const exchangeRateNotFound = {
				fromCurrency: "USD",
				toCurrency: "HUF",
				startDate: new Date("2023-12-02"),
				endDate: new Date("2023-12-04"),
			}

			// Error paths where Mocked dependency method is NOT ACCESSIBLE -------
			const exchangeRateServiceNotAccessible = {
				fromCurrency: "EUR",
				toCurrency: "HUF",
				startDate: new Date("2023-12-01"),
				endDate: new Date("2023-12-03"),
			}

			// Error paths where Mocked dependency method is NOT called -------
			it.each([
				[
					"invalid FROM CURRENCY input was added",
					invalidInputFromCurrency,
					"Invalid FROM CURRENCY input.",
				],
				[
					"invalid TO CURRENCY input was added",
					invalidInputToCurrency,
					"Invalid TO CURRENCY input.",
				],
				[
					"FROM CURRENCY and TO CURRENCY inputs are the same",
					invalidInputSameFromAndToCurrency,
					"FROM and TO CURRENCIES must be different.",
				],
				[
					"invalid START DATE input was added",
					invalidInputStartDate,
					"Invalid START DATE input.",
				],
				[
					"invalid END DATE input was added",
					invalidInputEndDate,
					"Invalid END DATE input.",
				],
				[
					"END DATE is earlier than START DATE",
					invalidDateRange,
					"END DATE must be greater than or equal to START DATE.",
				],
			])("should throw ValidationError if %s", (caseTitle, input, errorMsg) => {
				// Arrange --------------------------------------------------
				const error = new ValidationError(errorMsg)

				// Act & Assert ----------------------------------------------------

				expect(() =>
					currencyConverter.GenerateConversionReport(
						input.fromCurrency,
						input.toCurrency,
						input.startDate,
						input.endDate
					)
				).toThrow(error)

				// Check if the mocked dependency method was NOT called
				expect(mockedFn).toHaveBeenCalledTimes(0)
			})

			// Error paths where Mocked dependency method is CALLED -------
			it.each([
				[
					"invalid EXCHANGE RATE is returned",
					invalidReturnedExchangeRate,
					"Invalid EXCHANGE RATE returned.",
				],
			])("should throw ValidationError if %s", (caseTitle, input, errorMsg) => {
				// Arrange --------------------------------------------------
				const error = new ValidationError(errorMsg)

				// Set the return values to the dummy OUTPUT values for the 3 calls
				mockedFn
					.mockReturnValueOnce(381.32)
					.mockReturnValueOnce(383.07)
					.mockImplementation(() => {
						throw error
					})

				// Act & Assert ----------------------------------------------------

				expect(() =>
					currencyConverter.GenerateConversionReport(
						input.fromCurrency,
						input.toCurrency,
						input.startDate,
						input.endDate
					)
				).toThrow(error)

				// Check if the mocked method was called needed number of times, with the dummy Input values
				expect(mockedFn).toHaveBeenCalledTimes(3)
			})

			it.each([
				["EXCHANGE RATE is not found", exchangeRateNotFound, "EXCHANGE RATE not found."],
			])("should throw NotFoundError if %s", (caseTitle, input, errorMsg) => {
				// Arrange --------------------------------------------------
				const error = new NotFoundError(errorMsg)

				// Set the return values to the dummy OUTPUT values for the 3 calls
				mockedFn
					.mockReturnValueOnce(350.03)
					.mockReturnValueOnce(352.12)
					.mockImplementation(() => {
						throw error
					})

				// Act & Assert ----------------------------------------------------

				expect(() =>
					currencyConverter.GenerateConversionReport(
						input.fromCurrency,
						input.toCurrency,
						input.startDate,
						input.endDate
					)
				).toThrow(error)

				// Check if the mocked method was called needed number of times, with the dummy Input values
				expect(mockedFn).toHaveBeenCalledTimes(3)
			})

			// Error paths where Mocked dependency method is NOT ACCESSIBLE -------
			it.each([
				[
					"EXCHANGE RATE SERVICE is not accessible",
					exchangeRateServiceNotAccessible,
					"Unable to fetch EXCHANGE RATE.",
				],
			])("should throw NetworkError if %s", (caseTitle, input, errorMsg) => {
				// Arrange --------------------------------------------------
				const error = new NetworkError(errorMsg)

				// Whenever the dependency method is called during this test,
				// it will throw an exception
				mockedFn.mockImplementation(() => {
					throw error
				})

				// Act & Assert ----------------------------------------------------

				expect(() =>
					currencyConverter.GenerateConversionReport(
						input.fromCurrency,
						input.toCurrency,
						input.startDate,
						input.endDate
					)
				).toThrow(error)

				// Check if the mocked method was called needed number of times, with the dummy Input values
				expect(mockedFn).toHaveBeenCalledTimes(1)
			})
		})
	})
})
