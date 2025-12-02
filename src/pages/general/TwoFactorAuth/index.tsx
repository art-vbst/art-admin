import { useSearchParams } from 'react-router';
import { TwoFactorAuthForm } from './Form';
import { TwoFactorAuthSetup } from './Setup';

export const QR_CODE_PARAM = 'qrCode';

export const TwoFactorAuth = () => {
  const [urlParams] = useSearchParams();

  const qrCode = urlParams.get(QR_CODE_PARAM);

  return qrCode ? (
    <TwoFactorAuthSetup qrCode={qrCode} />
  ) : (
    <TwoFactorAuthForm />
  );
};
