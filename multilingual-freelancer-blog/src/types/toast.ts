export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export interface ToastContextType {
  showToast: (props: Omit<ToastProps, "id" | "onClose">) => string;
  hideToast: (id: string) => void;
}
