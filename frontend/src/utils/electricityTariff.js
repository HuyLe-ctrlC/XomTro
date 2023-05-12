const electricityTariff = (
  newValue,
  oldValue,
  priceTier1,
  priceTier2,
  priceTier3
) => {
  let finalPrice = 0;
  const totalElectricity = newValue - oldValue;

  if (totalElectricity >= 50 && totalElectricity <= 100) {
    finalPrice = totalElectricity * priceTier2;
  } else if (totalElectricity > 100) {
    finalPrice = totalElectricity * priceTier3;
  } else {
    finalPrice = totalElectricity * priceTier1;
  }

  return finalPrice;
};
export const electricityTariffTier = (
  newValue,
  oldValue,
  priceTier1,
  priceTier2,
  priceTier3
) => {
  let finalPrice = 0;
  const totalElectricity = newValue - oldValue;

  if (totalElectricity >= 50 && totalElectricity <= 100) {
    finalPrice = priceTier2;
  } else if (totalElectricity > 100) {
    finalPrice = priceTier3;
  } else {
    finalPrice = priceTier1;
  }

  return finalPrice;
};
export default electricityTariff;
