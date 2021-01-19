import React, { useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Container, Placeholder, Input } from './styled';
import { useMaskedValue } from './hooks';

function MaskInput(
  {
    value: providedValue,
    onChange,
    mask: providedMask,
    maskPlaceholder: providedMaskPlaceholder,
    fitWidthToMask,
    validateMaskedValue,
    tokens: customTokens,
    defaultSymbolPlaceholder,
    alwaysShowMaskPlaceholder,
    placeholder,
    disabled,
    onKeyDown,
    onFocus,
    onBlur,
    onPaste,
    processPastedValue,
    ...inputProps
  },
  ref
) {
  let inputRef = useRef(null);

  if (ref) {
    inputRef = ref;
  }

  const [maskWidth, setMaskWidth] = useState(0);

  const handlePlaceholderRef = useCallback(
    (placeholderNode) => {
      if (placeholderNode && fitWidthToMask) {
        setMaskWidth(placeholderNode.clientWidth);
      }
    },
    [fitWidthToMask]
  );

  const {
    tokens,
    maskPlaceholder,
    value,
    insertSymbols,
    removeSymbols,
  } = useMaskedValue({
    mask: providedMask,
    maskPlaceholder: providedMaskPlaceholder,
    defaultSymbolPlaceholder,
    value: providedValue,
    onChange,
    validateMaskedValue,
    customTokens,
  });

  const moveCursor = useCallback((position) => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(position, position);
      }
    }, 0);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      onKeyDown(e);

      switch (e.keyCode) {
        // Backspace, Delete
        case 8:
        case 46: {
          e.preventDefault();
          const { selectionStart, selectionEnd } = e.target;
          const isForward = e.keyCode === 46;

          const position = removeSymbols(
            isForward ? selectionStart : selectionStart - 1,
            selectionEnd - selectionStart,
            isForward
          );

          moveCursor(typeof position === 'number' ? position : selectionStart);

          break;
        }
        // ArrowLeft, ArrowRight
        case 37:
        case 39: {
          const { selectionStart } = e.target;
          const isForward = e.keyCode === 39;

          const token = tokens[isForward ? selectionStart : selectionStart - 2];
          if (!token) {
            return;
          }

          e.preventDefault();
          moveCursor(
            selectionStart +
              (isForward ? token.length + 1 : -(token.length + 1))
          );
          break;
        }
      }
    },
    [moveCursor, onKeyDown, removeSymbols, tokens]
  );

  const [isFocused, setFocused] = useState(false);

  const handleFocus = useCallback(
    (e) => {
      setFocused(true);
      onFocus(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e) => {
      setFocused(false);
      onBlur(e);
    },
    [onBlur]
  );

  const setFocus = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { selectionStart } = e.target;

      const symbol = e.nativeEvent.data;
      const insertPosition = insertSymbols(symbol, selectionStart - 1);

      moveCursor(
        typeof insertPosition === 'number' ? insertPosition : selectionStart - 1
      );
    },
    [insertSymbols, moveCursor]
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();

      if (onPaste) {
        return onPaste(e);
      }

      const { selectionStart, selectionEnd } = e.target;
      const pastedValue = (e.clipboardData || window.clipboardData).getData(
        'text'
      );

      const processedPastedValue = processPastedValue(pastedValue, e);

      const insertPosition = insertSymbols(
        processedPastedValue,
        selectionStart,
        selectionEnd - selectionStart
      );
      moveCursor(
        typeof insertPosition === 'number' ? insertPosition : selectionStart - 1
      );
    },
    [insertSymbols, moveCursor, processPastedValue, onPaste]
  );

  const currentValue = isFocused || value !== tokens[0] ? value : '';

  const shouldShowMaskPlaceholder =
    isFocused ||
    (alwaysShowMaskPlaceholder && (!placeholder || currentValue.length > 0));

  return (
    <Container>
      <Placeholder onClick={setFocus} disabled={disabled}>
        <Placeholder.Measurer ref={handlePlaceholderRef}>
          {maskPlaceholder}
        </Placeholder.Measurer>
        {shouldShowMaskPlaceholder && (
          <Placeholder.Hidden>{currentValue}</Placeholder.Hidden>
        )}
        {!disabled && (
          <Placeholder.Visible>
            {shouldShowMaskPlaceholder
              ? maskPlaceholder.substring(currentValue.length)
              : !currentValue.length
              ? placeholder
              : ''}
          </Placeholder.Visible>
        )}
      </Placeholder>
      <Input
        ref={inputRef}
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPaste={handlePaste}
        disabled={disabled}
        isFocused={isFocused}
        maskWidth={maskWidth}
        {...inputProps}
        type="text"
      />
    </Container>
  );
}

const MaskInputWithRef = React.forwardRef(MaskInput);

MaskInputWithRef.propTypes = {
  mask: PropTypes.string,
  maskPlaceholder: PropTypes.string,
  fitWidthToMask: PropTypes.bool,
  validateMaskedValue: PropTypes.func,
  tokens: PropTypes.objectOf(PropTypes.string),
  defaultSymbolPlaceholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onPaste: PropTypes.func,
  onKeyDown: PropTypes.func,
  alwaysShowMaskPlaceholder: PropTypes.bool,
  processPastedValue: PropTypes.bool,

  placeholder: PropTypes.string,
  name: PropTypes.string,
  tabIndex: PropTypes.number,
};

MaskInputWithRef.defaultProps = {
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
  onKeyDown: () => {},
  alwaysShowMaskPlaceholder: true,
  defaultSymbolPlaceholder: ' ',
  validateMaskedValue: () => true,
  fitWidthToMask: false,
  processPastedValue: (value) => value,
};

export default MaskInputWithRef;
