import { useContext, useState } from 'react';
import { login } from '~/auth/api';
import { AuthContext } from '~/auth/context';
import { useAction } from '~/hooks/useAction';

export const Login = () => {
  const { setUser } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loading, error, execute } = useAction(() => login(email, password));

  const handleSubmit = async () => {
    const user = await execute();
    user && setUser(user);
  };

  return (
    <div className="mx-auto mt-8 max-w-md p-6">
      {error && <div className="text-red-500">{error.message}</div>}
      <h2 className="mb-4 font-bold text-2xl">Sign in</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <button
          type="button"
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
};
