import { fireEvent, render, RenderResult } from '@testing-library/vue';
import { i18n } from '@/test/i18n';
import FormExample from './FormExample.vue';

describe('FormExample.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(FormExample, {
      i18n,
    });
  });

  test('fill out form and emit submit event', async () => {
    const { getByText, getByLabelText, emitted } = harness;

    await fireEvent.update(getByLabelText('First name *'), 'First name');
    await fireEvent.update(getByLabelText('Last name *'), 'Last name');
    await fireEvent.update(getByLabelText('E-mail *'), 'foo@bar.com');
    await fireEvent.click(getByLabelText('I accept the terms'));
    await fireEvent.click(getByLabelText('I want to subscribe to the newsletter'));
    await fireEvent.click(getByLabelText('Yearly subscription'));
    await fireEvent.update(getByLabelText('Street *'), 'Street');
    await fireEvent.update(getByLabelText('Zip code *'), '1234');
    await fireEvent.update(getByLabelText('City *'), 'City');
    await fireEvent.update(getByLabelText('Notes *'), 'Notes');

    await fireEvent.click(getByText('Save'));

    expect(emitted().submit[0][0]).toEqual({
      firstname: 'First name',
      lastname: 'Last name',
      email: 'foo@bar.com',
      street: 'Street',
      zipCode: '1234',
      city: 'City',
      country: 'gl',
      acceptTerms: true,
      newsletter: true,
      subscription: 'yearly-subscription',
      notes: 'Notes',
    });
  });
});
