import toast from 'react-hot-toast';
import { Link } from 'react-router';

export const successToast = (message: string, link?: string) => {
  const content = link ? (
    <div className="flex items-center gap-2">
      <span>{message}</span>
      {link && (
        <Link to={link} className="text-blue-500">
          View
        </Link>
      )}
    </div>
  ) : (
    message
  );

  return toast.success(content);
};

export const errorToast = (message: string) => {
  return toast.error(message);
};
