export const NotFound = () => {
  return (
    <div className="mx-auto mt-24 max-w-xl text-center">
      <div className="mb-3 font-bold text-6xl text-gray-900">404</div>
      <h2 className="mb-2 font-semibold text-gray-900 text-xl">
        Page not found
      </h2>
      <p className="mb-6 text-gray-600">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <a
        href="/"
        className="font-medium text-gray-700 text-sm underline hover:text-gray-900"
      >
        Go to dashboard
      </a>
    </div>
  );
};
