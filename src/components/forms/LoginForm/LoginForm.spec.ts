import { i18n } from '@/test/i18n';
import { fireEvent, render, RenderResult } from '@testing-library/vue';
import LoginForm from './LoginForm.vue';

describe('LoginForm.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(LoginForm, {
      i18n,
    });
  });

  test('fill out form and emit submit event', async () => {
    const { getByText, getByLabelText, emitted } = harness;

    await fireEvent.update(getByLabelText('common.username *'), 'User_1337');
    await fireEvent.blur(getByLabelText('common.username *'));
    await fireEvent.update(getByLabelText('common.password *'), 'easy-password');
    await fireEvent.blur(getByLabelText('common.password *'));
    await fireEvent.click(getByText('auth.LoginForm.cta'));
    expect(emitted().submit).toBeFalsy();

    await fireEvent.update(getByLabelText('common.password *'), '!123AjlbsdjkSsjdfb');
    await fireEvent.blur(getByLabelText('common.password *'));
    await fireEvent.click(getByText('auth.LoginForm.cta'));

    expect(emitted().submit[0][0]).toEqual({
      password: '!123AjlbsdjkSsjdfb',
      username: 'User_1337',
    });
  });
});
