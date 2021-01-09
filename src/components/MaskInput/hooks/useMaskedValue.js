import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  applyMask,
  buildDefaultMaskPlaceholder,
  getIntersections,
  getTokensOffsetBefore,
  removeTokens,
} from '../helpers';

export default ({
  mask: providedMask,
  maskPlaceholder: providedMaskPlaceholder,
  defaultSymbolPlaceholder,
  validateMaskedValue,
  customTokens,
  value: providedValue,
  onChange,
}) => {
  const mask = useMemo(() => (customTokens ? '' : providedMask), [
    customTokens,
    providedMask,
  ]);
  const maskPlaceholder = useMemo(
    () =>
      providedMaskPlaceholder ||
      buildDefaultMaskPlaceholder(customTokens, mask, defaultSymbolPlaceholder),
    [customTokens, defaultSymbolPlaceholder, mask, providedMaskPlaceholder]
  );

  const tokens = useMemo(
    () => customTokens || getIntersections(mask, maskPlaceholder),
    [customTokens, mask, maskPlaceholder]
  );

  const [value, _setValue] = useState(() =>
    applyMask(providedValue || '', mask, tokens)
  );

  useEffect(() => {
    const maskedValue = applyMask(providedValue || '', mask, tokens);

    if (validateMaskedValue(maskedValue)) {
      _setValue(maskedValue);
    }
  }, [mask, providedValue, tokens, validateMaskedValue]);

  const updateValue = useCallback(
    (newValue) => {
      const formattedValue = applyMask(newValue, mask, tokens);
      if (!mask || formattedValue.length <= mask.length) {
        if (!validateMaskedValue(formattedValue)) {
          return false;
        }

        _setValue(formattedValue);
        if (
          (!mask ||
            [(tokens[0] || '').length, mask.length].includes(
              formattedValue.length
            )) &&
          value !== formattedValue
        ) {
          onChange(
            formattedValue.length === (tokens[0] || '').length
              ? ''
              : formattedValue
          );
        }

        return formattedValue;
      }
    },
    [mask, tokens, validateMaskedValue, value, onChange]
  );

  const insertSymbols = useCallback(
    (symbols, position, shift = 0) => {
      const valueWithoutTokens = removeTokens(value, tokens);
      const symbolsWithoutTokens = removeTokens(symbols, tokens, position);

      const offset = getTokensOffsetBefore(position, tokens);

      const insertPosition = position - offset;

      const newValue = `${valueWithoutTokens.substring(
        0,
        insertPosition
      )}${symbolsWithoutTokens}${valueWithoutTokens.substring(
        position - offset + shift
      )}`;

      const isSuccess = updateValue(newValue) !== false;

      const tokenAtPosition = tokens[position] || '';
      const tokenAfterCurrentValue = tokens[newValue.length + offset] || '';
      return (
        isSuccess &&
        position +
          symbols.length +
          (symbols.length - symbolsWithoutTokens.length) +
          tokenAfterCurrentValue.length +
          tokenAtPosition.length
      );
    },
    [tokens, updateValue, value]
  );

  const removeSymbols = useCallback(
    (position, length, isForward) => {
      const tokenLength = tokens[position] ? tokens[position].length : 0;

      const insertPosition =
        position + (isForward ? tokenLength : -tokenLength);

      const isSuccess = insertSymbols(
        '',
        position + (isForward ? tokenLength : -tokenLength),
        length || 1
      );

      return isSuccess !== false && insertPosition;
    },
    [insertSymbols, tokens]
  );

  return {
    tokens,
    maskPlaceholder,
    value,
    insertSymbols,
    removeSymbols,
  };
};
