import { useContext } from 'react';
import type { FormRenderProps } from 'react-final-form';
import { Form } from 'react-final-form';
import { login } from '~/auth/api';
import { AuthContext } from '~/auth/context';
import { errorToast } from '~/components/toast';
import { Button, InputField } from '~/components/ui';
import { useAction } from '~/hooks/useAction';

type LoginForm = {
  email: string;
  password: string;
};

const initialFormValues: LoginForm = {
  email: '',
  password: '',
};

export const Login = () => {
  const { setUser } = useContext(AuthContext);

  const { error, execute } = useAction((values: LoginForm) =>
    login(values.email, values.password),
  );

  const handleSubmit = async (values: LoginForm) => {
    return await execute(values)
      .then(setUser)
      .catch(() => errorToast('Failed to login'));
  };

  const formRenderer = ({
    handleSubmit,
    submitting,
  }: FormRenderProps<LoginForm>) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField type="email" label="Email" name="email" autoFocus />
      <InputField type="password" label="Password" name="password" />
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );

  return (
    <div className="flex min-h-dvh items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md">
        <h2 className="mb-6 font-bold text-3xl text-gray-900">Sign in</h2>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-800 text-sm">
            {error.message}
          </div>
        )}

        <Form<LoginForm>
          onSubmit={handleSubmit}
          initialValues={initialFormValues}
          render={formRenderer}
        />
      </div>
    </div>
  );
};
