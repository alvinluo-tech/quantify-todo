export default function Loading() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 bg-blue-600 rounded-full opacity-20 animate-pulse"></div>
          </div>
        </div>
        <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium">
          Loading your tasks...
        </p>
      </div>
    </div>
  );
}
