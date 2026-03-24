import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, ShieldAlert } from 'lucide-react';

const TOAST_VARIANTS = {
  success: {
    icon: <CheckCircle2 size={28} />,
    colorClass: "text-teal-600",
    bgClass: "bg-teal-50",
    borderClass: "border-teal-100",
    title: "Success"
  },
  error: {
    icon: <ShieldAlert size={28} />,
    colorClass: "text-red-600",
    bgClass: "bg-red-50",
    borderClass: "border-red-100",
    title: "Error"
  },
  info: {
    icon: <Info size={28} />,
    colorClass: "text-blue-600",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-100",
    title: "Notice"
  }
};

const Toast = ({ message, isVisible, onClose, type = 'success' }) => {
  const variant = TOAST_VARIANTS[type] || TOAST_VARIANTS.success;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, x: '-50%' }}
          animate={{ opacity: 1, y: 20, x: '-50%' }}
          exit={{ opacity: 0, y: -100, x: '-50%' }}
          className="fixed top-0 left-1/2 z-[100] w-full max-w-md px-4"
        >
          <div className={`bg-white border ${variant.borderClass} rounded-2xl shadow-2xl p-4 flex items-center gap-4`}>
            <div className={`flex-shrink-0 w-12 h-12 ${variant.bgClass} rounded-xl flex items-center justify-center ${variant.colorClass}`}>
              {variant.icon}
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-slate-900">{variant.title}</h3>
              <p className="text-sm text-slate-500">{message}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;