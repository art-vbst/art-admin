import { useContext } from 'react';
import type { FormRenderProps } from 'react-final-form';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router';
import { verify } from '~/auth/api';
import { AuthContext } from '~/auth/context';
import { errorToast } from '~/components/toast';
import { Button, InputField } from '~/components/ui';
import { useAction } from '~/hooks/useAction';

type LoginForm = {
  totp: string;
};

const initialFormValues: LoginForm = {
  totp: '',
};

export const TwoFactorAuthForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const { error, execute } = useAction((values: LoginForm) =>
    verify(values.totp),
  );

  const handleSubmit = async (values: LoginForm) => {
    return await execute(values)
      .then(setUser)
      .catch((res) => {
        if (res.response?.status === 401) {
          navigate('/login');
        } else {
          errorToast('Failed to verify');
        }
      });
  };

  const formRenderer = ({
    handleSubmit,
    submitting,
  }: FormRenderProps<LoginForm>) => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        type="text"
        label="Authenticator App Code"
        name="totp"
        autoFocus
        placeholder="000000"
        maxLength={6}
        className="text-center font-mono text-lg tracking-widest"
      />
      <Button
        type="submit"
        disabled={submitting}
        className="w-full py-3 font-semibold text-base transition-all duration-200"
      >
        {submitting ? 'Verifying...' : 'Verify Code'}
      </Button>
    </form>
  );

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-gray-200/50 shadow-lg">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-8 w-8 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="mb-2 font-bold text-2xl text-gray-900">
              Two-Factor Authentication
            </h2>
            <p className="text-gray-600 text-sm">
              Enter the code from your authenticator app
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 text-sm">
              <div className="flex items-start gap-2">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error.message}</span>
              </div>
            </div>
          )}

          <Form<LoginForm>
            onSubmit={handleSubmit}
            initialValues={initialFormValues}
            render={formRenderer}
          />
        </div>
      </div>
    </div>
  );
};
