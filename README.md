# MaskInput React Component

[![NPM](https://img.shields.io/npm/v/@idui/react-mask-input.svg)](https://www.npmjs.com/package/@idui/react-mask-input/)
[![Size](https://img.shields.io/bundlephobia/min/@idui/react-mask-input)](https://www.npmjs.com/package/@idui/react-mask-input)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Coverage Status](https://coveralls.io/repos/github/id-ui/react-mask-input/badge.svg?branch=main)](https://coveralls.io/github/id-ui/react-mask-input?branch=main)
[![LICENSE](https://img.shields.io/github/license/id-ui/react-mask-input)](https://github.com/id-ui/react-mask-input/blob/main/LICENSE)

- [Docs](https://id-ui.github.io/react-mask-input/?path=/docs/maskinput--playground)
- [Playground](https://id-ui.github.io/react-mask-input/?path=/story/maskinput--playground)

## Install

```bash
npm install --save @idui/react-mask-input
```

```bash
yarn add @idui/react-mask-input
```

### Advantages
- Fully customizable
- Smart
- Adjusts the entered/inserted value to the mask
- Able to define mask by custom tokens
- Accepts custom validation applied before setting value
- Jumps over tokens on RightArrow/LeftArrow keyDown and during input/erase
- Able to show maskPlaceholder and value in different colors

### See props in [Docs](https://id-ui.github.io/react-mask-input/?path=/docs/maskinput--playground)

### Basic Example

```jsx
import React from 'react'
import MaskInput from '@idui/react-mask-input'

function Example() {
    const [value, setValue] = useState('');

    return <MaskInput  
        value={value} 
        onChange={setValue}
        mask="9999 9999 9999 9999"
        maskPlaceholder="0000 0000 0000 0000"
        placeholder="Enter Card Number"
    />;
}
```

### With custom validation (date)

- [Live Example](https://id-ui.github.io/react-mask-input/?path=/story/maskinput--date-validation)

```jsx
import React from 'react'
import MaskInput from '@idui/react-mask-input'

const dateRegex = /^(0[1-9]|[1-2]\d|3[0-1])\/(0[1-9]|1[0-2])\/[1-9]\d{3}$/;
const validDate = '01/01/2020';

const validateMaskedValue = (currentMaskedValue) =>
    dateRegex.test(
        currentMaskedValue + validDate.substring(currentMaskedValue.length)
    );

function DateValidation() {
    const [value, setValue] = useState('');

    return <MaskInput  
        value={value} 
        onChange={setValue}
        mask="99/99/9999"
        maskPlaceholder="DD/MM/YYYY"
        validateMaskedValue={validateMaskedValue}
    />;
}
```

### Custom tokens

- [Live Example](https://id-ui.github.io/react-mask-input/?path=/story/maskinput--custom-tokens)

```jsx
import React from 'react'
import MaskInput from '@idui/react-mask-input'

function Example() {
    const [value, setValue] = useState('');

    return <MaskInput  
        value={value} 
        onChange={setValue}
        tokens={{
            0: '$',
            2: '.',
        }}
        defaultSymbolPlaceholder=" "
    />;
}
```

### Styling

- You should apply styles to custom container
- [Live Example](https://id-ui.github.io/react-mask-input/?path=/story/maskinput--styling)

```jsx
import React from 'react'
import styled from 'styled-components';
import { ifProp } from 'styled-tools';
import MaskInput, {Placeholder} from '@idui/react-mask-input'

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
    color: ${ifProp({disabled: true}, '#EFEFEF', '#B4B4B4')};
  }
`;

function Example() {
    const [value, setValue] = useState('');

    return <Container>
        <MaskInput
            value={value}
            onChange={setValue}
            mask="9999 9999 9999 9999"
            maskPlaceholder="0000 0000 0000 0000"
            placeholder="Enter Card Number"
        />
    </Container>;
}
```

### See more details in [storybook](https://id-ui.github.io/react-mask-input/?path=/docs/maskinput--playground)

## License

MIT © [kaprisa57@gmail.com](https://github.com/id-ui)