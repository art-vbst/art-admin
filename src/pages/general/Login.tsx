import { useState } from 'react';
import { login, logout, me } from '~/api/endpoints';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    console.log(email, password);
    login(email, password);
  };

  const getMe = async () => {
    const res = await me();
    console.log(res);
  };

  const execLogout = async () => {
    const res = await logout();
    console.log(res);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold mb-4">Sign in</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
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
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Sign in
        </button>
      </form>
      <button
        type="button"
        onClick={getMe}
        className="mt-4 px-4 py-2 border rounded"
      >
        Get Me
      </button>
      <button
        type="button"
        onClick={execLogout}
        className="mt-2 px-4 py-2 border rounded"
      >
        Logout
      </button>
    </div>
  );
};
