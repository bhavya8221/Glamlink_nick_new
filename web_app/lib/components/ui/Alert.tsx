interface AlertProps {
  type?: 'error' | 'warning' | 'info' | 'success';
  message: string;
  onDismiss?: () => void;
  className?: string;
}

const alertStyles = {
  error: {
    container: 'bg-red-50 border-red-200',
    icon: 'text-red-400',
    text: 'text-red-800',
    button: 'bg-red-50 text-red-500 hover:bg-red-100',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-400',
    text: 'text-yellow-800',
    button: 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100',
  },
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-400',
    text: 'text-blue-800',
    button: 'bg-blue-50 text-blue-500 hover:bg-blue-100',
  },
  success: {
    container: 'bg-green-50 border-green-200',
    icon: 'text-green-400',
    text: 'text-green-800',
    button: 'bg-green-50 text-green-500 hover:bg-green-100',
  },
};

const alertIcons = {
  error: (
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  ),
  warning: (
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  ),
  info: (
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  ),
  success: (
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  ),
};

/**
 * Alert component for displaying messages with different styles
 * @param type - The type of alert (error, warning, info, success)
 * @param message - The message to display
 * @param onDismiss - Optional callback when dismiss button is clicked
 * @param className - Additional CSS classes
 */
export function Alert({ 
  type = 'info', 
  message, 
  onDismiss, 
  className = '' 
}: AlertProps) {
  const styles = alertStyles[type];
  const icon = alertIcons[type];
  
  return (
    <div className={`rounded-md border p-4 ${styles.container} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className={`h-5 w-5 ${styles.icon}`} viewBox="0 0 20 20" fill="currentColor">
            {icon}
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm ${styles.text}`}>{message}</p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className={`inline-flex rounded-md p-1.5 ${styles.button}`}
              aria-label="Dismiss"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * ErrorAlert component - shorthand for Alert with type="error"
 * @param error - The error message to display
 * @param onDismiss - Callback when dismiss button is clicked
 */
export function ErrorAlert({ error, onDismiss }: { error: string; onDismiss: () => void }) {
  return <Alert type="error" message={error} onDismiss={onDismiss} />;
}