import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { axe } from 'jest-axe';
import MaskInput from 'components/MaskInput';

describe('MaskInput', () => {
  it('accessible', async () => {
    const { container } = render(
      <div>
        <label htmlFor="phone">Your Phone</label>
        <MaskInput
          id="phone"
          mask="+7 (999)-999-99-99"
          maskPlaceholder="+7 (___)-___-__-__"
          placeholder="Enter your phone number"
        />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('properly separates maskPlaceholder', () => {
    const { getByTestId } = render(
      <MaskInput
        data-testid="input"
        mask="+7 (999)-999-99-99"
        maskPlaceholder="+7 (___)-___-__-__"
        placeholder="Enter your phone number"
      />
    );

    const input = getByTestId('input');

    user.type(input, '90');

    const placeholderContainer = input.previousElementSibling;
    const hiddenPlaceholderPart = placeholderContainer.firstElementChild;
    const visiblePlaceholderPart = placeholderContainer.lastElementChild;

    expect(hiddenPlaceholderPart.textContent).toBe('+7 (90');
    expect(visiblePlaceholderPart.textContent).toBe('_)-___-__-__');
  });

  it('triggers onChange if value completely erased or completed', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <MaskInput
        data-testid="input"
        mask="+7 (999)-999-99-99"
        maskPlaceholder="+7 (___)-___-__-__"
        placeholder="Enter your phone number"
        onChange={onChange}
      />
    );

    const input = getByTestId('input');

    user.type(input, '9041487623');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('+7 (904)-148-76-23');

    onChange.mockClear();

    user.clear(input);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('sets input value on focus if there are tokens at 0 position', async () => {
    const { getByTestId } = render(
      <MaskInput
        data-testid="input"
        mask="+7 (999)-999-99-99"
        maskPlaceholder="+7 (___)-___-__-__"
        placeholder="Enter your phone number"
      />
    );

    const input = getByTestId('input');

    input.focus();

    await waitFor(() => {
      expect(input.value).toBe('+7 (');
    });
  });

  it('hides maskPlaceholder on blur if !alwaysShowMaskPlaceholder', () => {
    const { getByTestId } = render(
      <MaskInput
        data-testid="input"
        mask="999-999"
        maskPlaceholder="DDD-DDD"
        placeholder="Enter code"
        alwaysShowMaskPlaceholder={false}
      />
    );

    const input = getByTestId('input');
    const placeholderContainer = input.previousElementSibling;

    expect(placeholderContainer.childElementCount).toBe(1);

    user.click(placeholderContainer);
    expect(placeholderContainer.childElementCount).toBe(2);

    input.blur();
    expect(placeholderContainer.childElementCount).toBe(1);
  });

  // TODO ???
  // it('shifts mask on input inside value', async () => {
  //     const onChange = jest.fn()
  //     const {getByTestId} = render(
  //         <MaskInput data-testid="input" mask="+7 (999)-999-99-99" maskPlaceholder="+7 (___)-___-__-__" value="+7 (904)-148-76-23" placeholder="Enter your phone number" onChange={onChange} />
  //     )
  //
  //     const input  = getByTestId("input");
  //
  //     input.setSelectionRange(6, 6);
  //    await user.type(input, "5");
  //
  //     expect(onChange).toHaveBeenCalledTimes(1)
  //     expect(onChange).toHaveBeenCalledWith("+7 (905)-414-87-62")
  //
  //     onChange.mockClear()
  //
  //     user.type(input, "6");
  //
  //     expect(onChange).toHaveBeenCalledTimes(1)
  //     expect(onChange).toHaveBeenCalledWith("+7 (905)-641-48-76")
  // })

  it('formats value on paste', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <MaskInput
        data-testid="input"
        mask="+7 (999)-999-99-99"
        maskPlaceholder="+7 (___)-___-__-__"
        placeholder="Enter your phone number"
        onChange={onChange}
      />
    );

    const input = getByTestId('input');

    fireEvent.paste(input, {
      clipboardData: {
        getData: () => '9041487623',
      },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('+7 (904)-148-76-23');

    user.clear(input);

    onChange.mockClear();

    fireEvent.paste(input, {
      clipboardData: {
        getData: () => '904',
      },
    });

    expect(input.value).toBe('+7 (904)-');
  });

  it('jumps over mask on ArrowRight/ArrowLeft keyDown', async () => {
    const { getByTestId } = render(
      <MaskInput
        data-testid="input"
        mask="+7 (999)-999-99-99"
        maskPlaceholder="+7 (___)-___-__-__"
        value="+7 (904)-148-76-23"
        placeholder="Enter your phone number"
      />
    );

    const input = getByTestId('input');
    input.setSelectionRange(9, 9);
    user.type(input, '{arrowleft}');

    await waitFor(() => {
      expect(input.selectionStart).toEqual(6);
    });

    user.type(input, '{arrowright}{arrowright}');

    await waitFor(() => {
      expect(input.selectionStart).toEqual(10);
    });
  });

  it('validateMaskedValue: does not change value if validation not passed', () => {
    const validateMaskedValue = (currentMaskedValue) =>
      currentMaskedValue[4] === '9';

    const { getByTestId } = render(
      <MaskInput
        data-testid="input"
        mask="+7 (999)-999-99-99"
        maskPlaceholder="+7 (___)-___-__-__"
        placeholder="Enter your phone number"
        validateMaskedValue={validateMaskedValue}
      />
    );

    const input = getByTestId('input');

    user.type(input, '56783419');
    expect(input.value).toBe('+7 (9');
  });

  it('builds mask by custom tokens', () => {
    const { getByTestId } = render(
      <MaskInput
        data-testid="input"
        tokens={{
          0: '$',
          2: '.',
        }}
      />
    );

    const input = getByTestId('input');

    user.type(input, '123456789');
    expect(input.value).toBe('$1.23456789');
  });

  it('builds default mask if no placeholder', () => {
    const { getByTestId } = render(
      <MaskInput data-testid="input" mask="999)" defaultSymbolPlaceholder="_" />
    );

    const input = getByTestId('input');

    user.type(input, '12');

    const placeholderContainer = input.previousElementSibling;
    const hiddenPlaceholderPart = placeholderContainer.firstElementChild;
    const visiblePlaceholderPart = placeholderContainer.lastElementChild;
    expect(hiddenPlaceholderPart.textContent).toBe('12');
    expect(visiblePlaceholderPart.textContent).toBe('_)');
  });

  it('does not throw error if no mask provided', () => {
    const { getByTestId } = render(<MaskInput data-testid="input" />);

    const input = getByTestId('input');

    user.type(input, '12');

    expect(true).toEqual(true);
  });
});
