import { toast } from 'react-toastify';

const useNotification = () => {
  const notify = {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    info: (message) => toast.info(message),
    warning: (message) => toast.warning(message),
  };

  return notify;
};

export default useNotification;