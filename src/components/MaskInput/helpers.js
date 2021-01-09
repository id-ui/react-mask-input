const patterns = ['\\d', '\\w', '\\W'];

export const getRegexForSymbol = (symbol) =>
  patterns.find((pattern) => RegExp(pattern).test(symbol));

export const applyMask = (value, mask, tokens) => {
  let maskedValue = value;

  Object.entries(tokens).forEach(([key, token]) => {
    const index = parseInt(key, 10);
    if (
      index <= maskedValue.length &&
      maskedValue.substr(index, token.length) !== token
    ) {
      maskedValue = `${maskedValue.substring(
        0,
        index
      )}${token}${maskedValue.substring(index)}`;
    }
  });

  if (mask) {
    maskedValue = [...maskedValue].filter(
      (symbol, index) =>
        getRegexForSymbol(symbol) === getRegexForSymbol(mask[index])
    ).join``;

    return maskedValue.substring(0, mask.length);
  }

  return maskedValue;
};

export const getIntersections = (...words) => {
  const result = {};
  let index = 0;
  let currentIndex = 0;
  const values = words.map((word) => [...(word || '')]);
  while (values[0].length) {
    const currentChar = values[0].shift();
    if (currentChar === values[1][index]) {
      result[currentIndex] = (result[currentIndex] || '') + currentChar;
    } else {
      currentIndex = index + 1;
    }
    index++;
  }

  return result;
};

export const removeTokens = (value, tokens, valueOffset = 0) => {
  let result = value;
  let offset = 0;

  for (const key in tokens) {
    const index = parseInt(key, 10) - valueOffset;

    if (index < 0) {
      continue;
    }

    if (!value[index] || !tokens[index]) {
      break;
    }

    const tokenLength = tokens[index].length;
    result = `${result.substring(0, index - offset)}${result.substring(
      index - offset + tokenLength
    )}`;
    offset += tokenLength;
  }

  return result;
};

export const getTokensOffsetBefore = (position, tokens) =>
  Object.entries(tokens).reduce((result, [key, token]) => {
    return parseInt(key, 10) < position ? result + token.length : result;
  }, 0);

export const buildDefaultMaskPlaceholder = (
  tokens,
  mask,
  defaultSymbolPlaceholder
) => {
  if (tokens) {
    return Object.entries(tokens).reduce(
      (result, [key, token]) =>
        result +
        defaultSymbolPlaceholder.repeat(parseInt(key) - result.length) +
        token,
      ''
    );
  }

  return (mask || '').replace(/\w/g, defaultSymbolPlaceholder);
};
