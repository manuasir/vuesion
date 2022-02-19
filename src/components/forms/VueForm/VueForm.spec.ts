import { fireEvent, render } from '@testing-library/vue';
import VueFormTestComponent from './VueFormTestComponent.vue';

describe('VueForm.vue', () => {
  test('should cover all validations', async () => {
    const { getByText, getByLabelText, getByTestId, emitted, unmount } = render(VueFormTestComponent, {
      stubs: ['nuxt-link'],
      props: {
        onBlur: false,
      },
    });

    // check that invalid form doesn't emit submit event
    await fireEvent.click(getByText('Submit'));

    // Required text input
    await fireEvent.update(getByLabelText('required *'), undefined);
    await fireEvent.update(getByLabelText('required *'), '');
    await fireEvent.update(getByLabelText('required *'), 'required');
    // Required checkbox input
    await fireEvent.click(getByLabelText('chk-required'));
    await fireEvent.click(getByLabelText('chk-required'));
    // Required multi-select input
    await fireEvent.click(getByTestId('custom-multi-select'));
    await fireEvent.click(getByTestId('item1-0'));
    await fireEvent.click(getByTestId('item1-0'));
    await fireEvent.click(getByTestId('item2-1'));
    // Required single-select input
    await fireEvent.click(getByTestId('custom-select'));
    await fireEvent.click(getByTestId('-0'));
    await fireEvent.click(getByTestId('custom-select'));
    await fireEvent.click(getByTestId('item1-1'));

    // Min
    await fireEvent.update(getByLabelText('min'), '1');
    await fireEvent.update(getByLabelText('min'), '132');

    // Max
    await fireEvent.update(getByLabelText('max'), '132456789');
    await fireEvent.update(getByLabelText('max'), '1324');

    // Min-Max
    await fireEvent.update(getByLabelText('min-max'), '1');
    await fireEvent.update(getByLabelText('min-max'), '123456789');
    await fireEvent.update(getByLabelText('min-max'), '1234');

    // Email
    await fireEvent.update(getByLabelText('email'), 'foo');
    await fireEvent.update(getByLabelText('email'), 'foo@bar.baz');

    // Integer
    await fireEvent.update(getByLabelText('integer'), 'foo');
    await fireEvent.update(getByLabelText('integer'), '1337');

    // RegEx
    await fireEvent.update(getByLabelText('regex'), 'bar');
    await fireEvent.update(getByLabelText('regex'), 'foo');

    // Custom
    await fireEvent.update(getByLabelText('custom'), 'bar');
    await fireEvent.update(getByLabelText('custom'), 'foo');

    await fireEvent.click(getByText('Submit'));
    expect(emitted().submit[0][0]).toEqual({
      chkRequired: true,
      custom: 'foo',
      email: 'foo@bar.baz',
      integer: 1337,
      max: '1324',
      min: '132',
      minMax: '1234',
      regex: 'foo',
      required: 'required',
      selectRequired: [
        {
          label: 'item 1',
          value: 'item1',
        },
        {
          label: 'item 2',
          value: 'item2',
        },
      ],
      singleSelectRequired: {
        label: 'item 1',
        trailingIcon: null,
        value: 'item1',
      },
    });

    await fireEvent.click(getByText('Reset'));
    expect(emitted().reset).toBeTruthy();

    await unmount();
  });

  test('should cover on-blur ux', async () => {
    const { getByText, getByLabelText, getByTestId, emitted, unmount } = render(VueFormTestComponent, {
      stubs: ['nuxt-link'],
      props: {
        onBlur: true,
      },
    });

    await fireEvent.update(getByLabelText('required *'), 'required');
    await fireEvent.click(getByLabelText('chk-required'));
    await fireEvent.click(getByLabelText('chk-required'));
    await fireEvent.click(getByTestId('custom-multi-select'));
    await fireEvent.click(getByTestId('item2-1'));
    await fireEvent.click(getByTestId('custom-select'));
    await fireEvent.click(getByTestId('item1-1'));
    await fireEvent.update(getByLabelText('min'), '132');
    await fireEvent.update(getByLabelText('max'), '1324');
    await fireEvent.update(getByLabelText('min-max'), '1234');
    await fireEvent.update(getByLabelText('email'), 'foo@bar.baz');
    await fireEvent.update(getByLabelText('integer'), '1337');
    await fireEvent.update(getByLabelText('regex'), 'foo');
    await fireEvent.update(getByLabelText('custom'), 'foo');

    await fireEvent.click(getByText('Submit'));
    expect(emitted().submit[0][0]).toEqual({
      chkRequired: true,
      custom: 'foo',
      email: 'foo@bar.baz',
      integer: 1337,
      max: '1324',
      min: '132',
      minMax: '1234',
      regex: 'foo',
      required: 'required',
      selectRequired: [
        {
          label: 'item 1',
          value: 'item1',
        },
        {
          label: 'item 2',
          value: 'item2',
        },
      ],
      singleSelectRequired: {
        label: 'item 1',
        trailingIcon: 'checkmark',
        value: 'item1',
      },
    });

    await fireEvent.click(getByText('Reset'));
    expect(emitted().reset).toBeTruthy();

    await unmount();
  });
});
