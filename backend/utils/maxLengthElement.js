const maxLengthElement = (services) => {
  const maxElement = services.reduce((prev, current) =>
    prev.services.length > current.services.length ? prev : current
  ).services;
  return maxElement;
};

module.exports = maxLengthElement;
