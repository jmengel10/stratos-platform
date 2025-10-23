export default function ConsoleLoading() {
  return (
    <div className="h-screen flex bg-slate-50">
      {/* Sidebar Skeleton */}
      <div className="w-80 border-r border-slate-200 bg-white p-6">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="h-8 bg-slate-200 rounded animate-pulse mb-3"></div>
          <div className="h-10 bg-slate-200 rounded animate-pulse"></div>
        </div>

        {/* Conversation List Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-6 bg-slate-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Header Skeleton */}
        <div className="border-b border-slate-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-6 bg-slate-200 rounded animate-pulse w-48 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded animate-pulse w-64"></div>
            </div>
          </div>
        </div>

        {/* Messages Area Skeleton */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-4/6"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area Skeleton */}
        <div className="border-t border-slate-200 bg-white p-6">
          <div className="h-24 bg-slate-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

