export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="space-y-4 animate-fade-in">
        <p className="text-xl text-red-600 animate-pulse-slow">
          <span className="inline-block mr-2">📍</span> Finding your location...
        </p>
        <p className="text-xl text-red-600 animate-pulse-slow" style={{ animationDelay: "0.5s" }}>
          <span className="inline-block mr-2">🔍</span> Searching restaurants nearby...
        </p>
        <p className="text-xl text-red-600 animate-pulse-slow" style={{ animationDelay: "1s" }}>
          <span className="inline-block mr-2">🎰</span> Rolling the options...
        </p>
      </div>
      
      <div className="mt-10">
        <div className="w-16 h-16 border-t-4 border-red-600 border-solid rounded-full animate-spin" />
      </div>
    </div>
  );
} 