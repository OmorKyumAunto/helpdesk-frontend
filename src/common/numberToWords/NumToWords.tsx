import { ToWords } from "to-words";

export const NumToWord = ({ value }: { value: number }) => {
  const toWords = new ToWords({
    localeCode: "en-BD",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: true,
      currencyOptions: {
        name: "BDT",
        plural: "BDT",
        // name: currencyName?.toLocaleUpperCase() || "",
        // plural: currencyName?.toLocaleUpperCase() || "",
        symbol: "₹",
        fractionalUnit: {
          name: "Paisa",
          plural: "Paisa",
          symbol: "",
        },
      },
    },
  });

  return <div>{`In word: ${toWords.convert(value)}`}</div>;
};
