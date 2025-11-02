import { Button, ErrorText } from '~/components/ui';

type ErrorDisplayProps = {
  error?: unknown;
};

const isDebugEnabled = () => {
  return import.meta.env.VITE_DEBUG === 'true';
};

const getErrorDetails = (error?: unknown) => {
  if (!error) return undefined;
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      name: error.name,
    };
  }
  if (typeof error === 'string') {
    return { message: error };
  }
  try {
    return { message: JSON.stringify(error, null, 2) };
  } catch {
    return { message: String(error) };
  }
};

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  const debug = isDebugEnabled();
  const details = getErrorDetails(error);

  return (
    <div className="flex min-h-dvh flex-1 items-center justify-center">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="mb-2 font-semibold text-3xl text-gray-900">
          Something went wrong
        </h1>
        <p className="mb-6 text-gray-600">
          An unexpected error occurred. Please try again. If the problem
          persists, contact support.
        </p>

        {debug && (
          <div className="mb-6 text-left">
            {details?.message && (
              <ErrorText
                className="mb-3 whitespace-pre-wrap"
                message={details.message}
              />
            )}
            {details?.stack && (
              <pre className="overflow-auto rounded border border-gray-200 bg-gray-50 p-3 text-gray-800 text-xs">
                {details.stack}
              </pre>
            )}
          </div>
        )}

        <div className="flex items-center justify-center gap-3">
          <Button onClick={() => window.location.reload()}>Reload</Button>
          <a
            href="/"
            className="font-medium text-gray-700 text-sm underline hover:text-gray-900"
          >
            Go to dashboard
          </a>
        </div>
      </div>
    </div>
  );
};
