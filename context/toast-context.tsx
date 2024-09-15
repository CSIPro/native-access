import { Toast } from "@/components/ui/toast/toast";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ToastProps {
  title: string | null;
  description?: string;
  duration?: number;
  variant?: "success" | "error" | "warning" | "info";
}

const defaultToastProps: ToastProps = {
  title: null,
  duration: 5000,
  variant: "info",
};

interface ContextProps {
  data: ToastProps;
  showToast: (data: ToastProps) => void;
  reset: () => void;
}

export const ToastContext = createContext<ContextProps>({
  data: defaultToastProps,
  showToast: () => {},
  reset: () => {},
});

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<ToastProps>(defaultToastProps);
  const [toastTimeout, setToastTimeout] = useState<NodeJS.Timeout | null>(null);

  const showToast = (data: ToastProps) => {
    setData((prev) => ({ ...prev, ...data }));
  };

  const clearToastTimeout = () => {
    clearTimeout(toastTimeout);
    setToastTimeout(null);
  };

  const resetToast = () => {
    clearToastTimeout();

    setTimeout(() => setData(defaultToastProps), 500);
  };

  useEffect(() => {
    if (data.title) {
      const timeoutId = setTimeout(resetToast, data.duration);
      setToastTimeout(timeoutId);
    } else {
      clearToastTimeout();
    }
  }, [data]);

  return (
    <ToastContext.Provider value={{ data, showToast, reset: resetToast }}>
      {children}
      {toastTimeout && (
        <Toast
          variant={data.variant}
          title={data.title}
          description={data.description}
          duration={data.duration}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};
