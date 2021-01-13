import styled from 'styled-components';
import { ifProp, prop, withProp } from 'styled-tools';

export const Container = styled.div`
  position: relative;
  color: ${prop('color', '#313131')};
`;

export const Placeholder = styled.span`
  color: ${ifProp({ disabled: true }, '#EFEFEF', '#B4B4B4')};
  position: absolute;
  bottom: 0;
  left: 0;
`;

Placeholder.Hidden = styled.span`
  opacity: 0;
  z-index: -1;
`;

Placeholder.Measurer = styled(Placeholder.Hidden)`
  position: absolute;
  white-space: nowrap;
`;

Placeholder.Visible = styled.span`
  position: relative;
  z-index: 1;
`;

export const Input = styled.input`
  width: ${withProp('maskWidth', (maskWidth) =>
    maskWidth ? `${maskWidth}px` : '100%'
  )};
  border: none;
  outline: none;
  position: relative;
  z-index: ${ifProp('isFocused', 2, 0)};
  background-color: inherit;
  font-size: inherit;
`;
