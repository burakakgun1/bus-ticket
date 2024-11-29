import { toast } from 'react-toastify';

const useNotification = () => {
  const notify = {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    info: (message) => toast.info(message),
    warn: (message) => toast.warn(message),
  };

  return notify;
};

export default useNotification;