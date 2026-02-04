import { useUIStore } from '../../store/uiStore';
import type { Toast as ToastType } from '../../store/uiStore';

export function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

interface ToastProps {
  toast: ToastType;
  onClose: () => void;
}

function Toast({ toast, onClose }: ToastProps) {
  const styles = {
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 border-green-500',
    error: 'bg-gradient-to-r from-red-600 to-pink-600 border-red-500',
    info: 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-500',
  };

  return (
    <div
      className={`${styles[toast.type]} text-white px-4 py-3 rounded-xl shadow-2xl border-2 flex items-center justify-between min-w-[300px] max-w-md animate-slide-in`}
    >
      <span className="flex-1 font-bold">{toast.message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 font-black text-lg"
      >
        ✕
      </button>
    </div>
  );
}
