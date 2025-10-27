import { useContext, useId, useState } from 'react';
import { login } from '~/auth/api';
import { AuthContext } from '~/auth/context';
import { useAction } from '~/hooks/useAction';

export const Login = () => {
  const { setUser } = useContext(AuthContext);
  const emailId = useId();
  const passwordId = useId();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loading, error, execute } = useAction(() => login(email, password));

  const handleSubmit = async () => {
    const user = await execute();
    user && setUser(user);
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md">
        <h2 className="mb-6 font-bold text-3xl text-gray-900">Sign in</h2>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-800 text-sm">
            {error.message}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label
              htmlFor={emailId}
              className="mb-1 block font-medium text-gray-900 text-sm"
            >
              Email
            </label>
            <input
              id={emailId}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor={passwordId}
              className="mb-1 block font-medium text-gray-900 text-sm"
            >
              Password
            </label>
            <input
              id={passwordId}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="button"
            className="w-full rounded bg-gray-900 px-4 py-2 font-medium text-sm text-white hover:bg-gray-700 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};
