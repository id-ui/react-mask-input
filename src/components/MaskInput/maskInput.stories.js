import React, { useState } from 'react';
import styled from 'styled-components';
import { ifProp } from 'styled-tools';
import MaskInput, { Placeholder } from '.';

export default {
  title: 'MaskInput',
  component: MaskInput,
  argTypes: {
    mask: {
      control: 'text',
      description: 'value mask',
    },
    maskPlaceholder: {
      control: 'text',
      description:
        'value filler shown in input while value filling not complete. Must be the same length as mask.',
    },
    validateMaskedValue: {
      disable: true,
      description:
        'function that accepts current value and should return true if current value is valid, false in other case. This function called every time before changing input value.',
      table: {
        defaultValue: { summary: '() => true' },
      },
    },
    alwaysShowMaskPlaceholder: {
      control: 'boolean',
      description:
        'whether show maskPlaceholder even if input is not activeElement or not',
      defaultValue: true,
      table: {
        defaultValue: {
          summary: 'true, but it would be false if placeholder provided',
        },
      },
    },
    tokens: {
      control: 'object',
      description:
        'custom set of tokens (static symbols which must be in value) { [index]: token }',
    },
    defaultSymbolPlaceholder: {
      control: 'text',
      description:
        'Default mask filler (used for filling one character placeholder if no maskPlaceholder)',
      defaultValue: ' ',
      table: {
        defaultValue: { summary: 'space (" ")' },
      },
    },
    value: {
      control: 'text',
      description: 'input value',
    },
    onChange: {
      action: 'onChange',
      description: 'change input handler',
    },
    onFocus: {
      action: 'onFocus',
      description: 'focus input handler',
    },
    onBlur: {
      action: 'onBlur',
      description: 'blur input handler',
    },
    onKeyDown: {
      action: 'onKeyDown',
      description: 'keyDown input handler',
    },
    placeholder: {
      control: 'text',
      description: 'input placeholder',
    },
    name: {
      control: 'text',
      description: 'input name',
    },
    tabIndex: {
      control: 'text',
      description: 'input tabIndex',
    },
  },
};

export function Playground(props) {
  const [value, setValue] = useState('');

  return <MaskInput {...props} value={value} onChange={setValue} />;
}

Playground.args = {
  mask: '9999 9999 9999 9999',
  maskPlaceholder: '0000 0000 0000 0000',
  placeholder: 'Enter Card Number',
};

const dateRegex = /^(0[1-9]|[1-2]\d|3[0-1])\/(0[1-9]|1[0-2])\/[1-9]\d{3}$/;
const validDate = '01/01/2020';

const validateMaskedValue = (currentMaskedValue) =>
  dateRegex.test(
    currentMaskedValue + validDate.substring(currentMaskedValue.length)
  );

export function DateValidation(props) {
  const [value, setValue] = useState('');

  return (
    <MaskInput
      {...props}
      value={value}
      validateMaskedValue={validateMaskedValue}
      onChange={setValue}
    />
  );
}

DateValidation.args = {
  mask: '99/99/9999',
  maskPlaceholder: 'DD/MM/YYYY',
};

export function Phone(props) {
  const [value, setValue] = useState('');

  return <MaskInput {...props} value={value} onChange={setValue} />;
}

Phone.args = {
  mask: '+7 (999)-999-99-99',
  maskPlaceholder: '+7 (___)-___-__-__',
};

export function CustomTokens(props) {
  const [value, setValue] = useState('');

  return <MaskInput {...props} value={value} onChange={setValue} />;
}

CustomTokens.args = {
  tokens: {
    0: '$',
    2: '.',
  },
  defaultSymbolPlaceholder: ' ',
};

const Container = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 5px;
  border: 1px solid #b4b4b4;
  color: #313131;
  margin-bottom: 10px;
  &:focus-within {
    border: 1px solid #a569ed;
  }
  ${Placeholder} {
    color: ${ifProp({ disabled: true }, '#EFEFEF', '#B4B4B4')};
  }
`;

export function Styling(props) {
  const [value, setValue] = useState('');

  return (
    <div>
      <Container>
        <MaskInput {...props} value={value} onChange={setValue} />
      </Container>
      Note: You should apply styles to your custom wrapper
    </div>
  );
}

Styling.args = {
  mask: '9999 9999 9999 9999',
  maskPlaceholder: '0000 0000 0000 0000',
  placeholder: 'Enter Card Number',
};
