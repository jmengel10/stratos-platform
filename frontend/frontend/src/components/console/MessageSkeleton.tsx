export function MessageSkeleton() {
  return (
    <div className="flex gap-4 p-6 animate-pulse">
      {/* Avatar Skeleton */}
      <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0"></div>

      {/* Content Skeleton */}
      <div className="flex-1 space-y-3">
        {/* Name/Role Skeleton */}
        <div className="h-4 bg-slate-200 rounded w-32"></div>

        {/* Message Lines Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-11/12"></div>
          <div className="h-4 bg-slate-200 rounded w-10/12"></div>
          <div className="h-4 bg-slate-200 rounded w-9/12"></div>
        </div>

        {/* Actions Skeleton */}
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-slate-200 rounded w-20"></div>
          <div className="h-8 bg-slate-200 rounded w-20"></div>
          <div className="h-8 bg-slate-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}

export function MessageListSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <MessageSkeleton key={i} />
      ))}
    </div>
  );
}

