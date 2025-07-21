type ErrorMessageProps = {
  message: string;
  onRetry?: () => void;
};

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="error">
      <div>
        <svg
          className="error-icon"
          width="64"
          height="64"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2>Something went wrong</h2>
        <p>{message}</p>
        {onRetry && (
          <button className="btn" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
