interface ToastProps {
  message: string;
  isVisible: boolean;
}

export default function Toast({ message, isVisible }: ToastProps) {
  return (
    <div
      className={`fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg 
        flex items-center gap-2 transition-all duration-300 ease-in-out transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
      {message}
    </div>
  );
} 