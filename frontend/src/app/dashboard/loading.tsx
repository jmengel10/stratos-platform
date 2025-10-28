export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Skeleton */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-9 bg-slate-200 rounded animate-pulse w-48 mb-2"></div>
              <div className="h-5 bg-slate-200 rounded animate-pulse w-64"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 bg-slate-200 rounded animate-pulse w-24"></div>
              <div className="h-10 bg-slate-200 rounded animate-pulse w-24"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* KPI Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg animate-pulse"></div>
                  <div className="w-16 h-6 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-32"></div>
                  <div className="h-8 bg-slate-200 rounded animate-pulse w-24"></div>
                  <div className="h-2 bg-slate-200 rounded-full animate-pulse w-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Two Column Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activity Skeleton */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="h-6 bg-slate-200 rounded animate-pulse w-40 mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
                      <div className="h-3 bg-slate-200 rounded animate-pulse w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Outputs Skeleton */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="h-6 bg-slate-200 rounded animate-pulse w-40 mb-6"></div>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 bg-slate-200 rounded-md animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-48"></div>
                        <div className="h-3 bg-slate-200 rounded animate-pulse w-32"></div>
                      </div>
                    </div>
                    <div className="w-16 h-8 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Skeleton */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="h-6 bg-slate-200 rounded animate-pulse w-32 mb-6"></div>
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-slate-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

