import * as React from 'react';

export interface MaskInputProps {
    /**
     * input value
     */
    value?: string;
    /**
     * onChange input handler
     */
    onChange?: (value: string) => void;
    /**
     * value mask
     */
    mask?: string;
    /**
     * value filler shown in input while value filling not complete. Must be the same length as mask.
     */
    maskPlaceholder?: string;
    /**
     * whether fit input width to mask width or not
     * @default false
     */
    fitWidthToMask?: boolean;
    /**
     * function that should return true if current value is valid, false in other case. This function called every time before changing input value.
     * @default () => true
     */
    validateMaskedValue?: (inputValue: string) => boolean;
    /**
     * custom set of tokens (static symbols which must be in value) { [index of first token symbol in value]: token }
     */
    tokens?: { [index: number]: string };
    /**
     * Default mask filler (used for filling one character placeholder if no maskPlaceholder)
     * @default ' '
     */
    defaultSymbolPlaceholder?: string;
    /**
     * focus event handler
     */
    onFocus?: React.EventHandler<void>;
    /**
     * blur event handler
     */
    onBlur?: React.EventHandler<void>;
    /**
     * keyDown event handler
     */
    onKeyDown?: React.EventHandler<void>;
    /**
     * paste event handler (not recommended, if specified mask input won't call default paste handler)
     */
    onPaste?: React.EventHandler<void>;
    /**
     * whether show maskPlaceholder even if input is not activeElement or not
     * @default true, but it would be false if placeholder provided
     */
    alwaysShowMaskPlaceholder?: boolean;
    /**
     * pasted text processor
     * @param pastedValue
     * @param event
     */
    processPastedValue?: (pastedValue: string, event: React.SyntheticEvent) => string;
     /**
     * can value be empty or not
     */
     required?: boolean;
     /**
     * is input readOnly
     */
     readOnly?: boolean;
     /**
     * is input disabled
     */
     disabled?: boolean;
     /**
     * input name
     */
     name?: string;
     /**
     * input placeholder
     */
     placeholder?: string;
     /**
     * input tabIndex
     */
     tabIndex?: number;
     /**
     * whether enable autocompletion or not
     */
     autoComplete?: boolean;
     /**
     * whether set focus on init or not
     */
     autoFocus?: boolean;
}

export default class MaskInput extends React.Component<MaskInputProps> {}