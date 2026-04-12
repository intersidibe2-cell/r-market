import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useNotification, NotificationType } from '../context/NotificationContext'

const icons: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle className="w-6 h-6" />,
  error: <XCircle className="w-6 h-6" />,
  warning: <AlertTriangle className="w-6 h-6" />,
  info: <Info className="w-6 h-6" />
}

const styles: Record<NotificationType, { bg: string; border: string; icon: string }> = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-500'
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-500'
  },
  warning: {
    bg: 'yellow-50',
    border: 'border-yellow-200',
    icon: 'text-yellow-500'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-500'
  }
}

export default function ToastContainer() {
  const { notifications, removeNotification } = useNotification()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-3 max-w-sm w-full">
      {notifications.map(notification => {
        const style = styles[notification.type]
        return (
          <div
            key={notification.id}
            className={`${style.bg} ${style.border} border rounded-xl shadow-lg p-4 flex items-start gap-3 animate-slide-in`}
          >
            <div className={style.icon}>
              {icons[notification.type]}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm">{notification.title}</h4>
              {notification.message && (
                <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
              )}
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
