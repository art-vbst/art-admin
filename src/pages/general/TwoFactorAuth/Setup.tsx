import { Navigate, useNavigate } from 'react-router';
import { Button } from '~/components/ui';

export const TwoFactorAuthSetup = ({ qrCode }: { qrCode: string }) => {
  const navigate = useNavigate();

  if (!qrCode) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-gray-200/50 shadow-lg">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
            <h2 className="mb-2 font-bold text-2xl text-gray-900">
              Setup Two-Factor Authentication
            </h2>
            <p className="text-gray-600 text-sm">
              Scan the QR code with your authenticator app
            </p>
          </div>

          <div className="mb-6 flex flex-col items-center gap-4">
            <div className="rounded-lg border-2 border-gray-200 bg-white p-4 shadow-sm">
              <img
                src={`data:image/png;base64,${qrCode}`}
                alt="QR Code"
                className="h-64 w-64"
              />
            </div>
            <div className="flex max-w-sm items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-blue-800 text-sm">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                Open your authenticator app and scan this QR code to add your
                account
              </span>
            </div>
          </div>

          <Button
            onClick={() => navigate('/2fa')}
            className="w-full py-3 font-semibold text-base transition-all duration-200"
          >
            Ready to Verify
          </Button>
        </div>
      </div>
    </div>
  );
};
