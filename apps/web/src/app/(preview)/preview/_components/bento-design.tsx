"use client";

const coeData = [
  { cat: "A", premium: "96,000", change: "+2.5%", up: true },
  { cat: "B", premium: "108,000", change: "+4.2%", up: true },
  { cat: "C", premium: "70,001", change: "-1.8%", up: false },
  { cat: "D", premium: "12,000", change: "0.0%", up: null },
  { cat: "E", premium: "105,000", change: "+3.1%", up: true },
];

const posts = [
  { title: "January 2024 COE Analysis", date: "Today", status: "new" },
  { title: "EV Registrations Surge 45%", date: "Yesterday", status: "read" },
  { title: "Luxury Market Shifts", date: "2 days ago", status: "read" },
];

const topMakes = [
  { make: "Toyota", count: 12500, color: "#191970" },
  { make: "Honda", count: 10625, color: "#2E4A8E" },
  { make: "Mercedes", count: 8750, color: "#4A6AAE" },
  { make: "BMW", count: 8125, color: "#708090" },
  { make: "Hyundai", count: 6875, color: "#94A3B8" },
];

const heatmapOpacities = [
  0.1, 0.4, 0.8, 0.2, 0.6, 1, 0.4, 0.2, 0.6, 0.8, 0.1, 0.4, 0.6, 0.2, 0.8, 0.4,
  1, 0.2, 0.6, 0.1, 0.8, 0.4, 0.2, 0.6, 1, 0.1, 0.4, 0.8, 0.2, 0.6, 0.4, 0.1,
  0.8, 0.6, 0.2,
];

// Theme colors:
// Primary: Navy Blue #191970
// Secondary: Slate Gray #708090
// Accent: Cyan #00FFFF / #008B8B
// Text: Dark Slate Gray #2F4F4F

export const BentoDesign = () => {
  return (
    <div className="min-h-screen bg-[#F0F4F8] font-[system-ui,sans-serif] text-[#2F4F4F]">
      {/* Header */}
      <header className="bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#191970]">
              <svg
                aria-hidden="true"
                className="h-5 w-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
              </svg>
            </div>
            <nav className="flex items-center gap-1 rounded-full bg-[#F0F4F8] p-1">
              <button
                type="button"
                className="rounded-full bg-[#191970] px-5 py-2.5 font-medium text-sm text-white"
              >
                Dashboard
              </button>
              <button
                type="button"
                className="rounded-full px-5 py-2.5 font-medium text-[#708090] text-sm hover:bg-white"
              >
                Cars
              </button>
              <button
                type="button"
                className="rounded-full px-5 py-2.5 font-medium text-[#708090] text-sm hover:bg-white"
              >
                COE
              </button>
              <button
                type="button"
                className="rounded-full px-5 py-2.5 font-medium text-[#708090] text-sm hover:bg-white"
              >
                Reports
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0F4F8] text-[#708090] hover:bg-[#E2E8F0]"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0F4F8] text-[#708090] hover:bg-[#E2E8F0]"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <div className="h-10 w-10 rounded-full bg-[#191970]" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[#708090] text-sm">Welcome back</p>
            <h1 className="font-bold text-3xl text-[#2F4F4F]">Good morning</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-2.5 font-medium text-[#2F4F4F] text-sm hover:bg-[#F0F4F8]"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              December 2024
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-[#191970] px-5 py-2.5 font-medium text-sm text-white hover:bg-[#2E4A8E]"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export Report
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-5">
          {/* Total Registrations - Large Card */}
          <div className="col-span-4 rounded-3xl border-2 border-[#191970] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#191970]/10">
                <svg
                  aria-hidden="true"
                  className="h-6 w-6 text-[#191970]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0F4F8] text-[#708090] hover:bg-[#E2E8F0]"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 17L17 7M17 7H7M17 7v10"
                  />
                </svg>
              </button>
            </div>
            <p className="text-[#708090] text-sm">Total Registrations</p>
            <p className="mt-1 font-bold text-4xl text-[#191970] tabular-nums">
              46,500
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-[#E0FFFF] px-2.5 py-1 font-medium text-[#008B8B] text-xs">
                <svg
                  aria-hidden="true"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                +12.5%
              </span>
              <span className="text-[#708090] text-xs">vs last month</span>
            </div>
          </div>

          {/* COE Results Grid */}
          <div className="col-span-8 rounded-3xl bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-semibold text-[#2F4F4F]">
                Latest COE Results
              </h2>
              <span className="rounded-full bg-[#E0FFFF] px-3 py-1 font-medium text-[#008B8B] text-xs">
                Live
              </span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {coeData.map((row) => (
                <div
                  key={row.cat}
                  className={`rounded-2xl p-4 ${
                    row.up === true
                      ? "bg-[#F0F4F8]"
                      : row.up === false
                        ? "bg-[#FEF2F2]"
                        : "bg-[#F9FAFB]"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-[#708090] text-xs">
                      Cat {row.cat}
                    </span>
                    {row.up === true && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#008B8B] text-[10px] text-white">
                        ↑
                      </span>
                    )}
                    {row.up === false && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#DC2626] text-[10px] text-white">
                        ↓
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-[#2F4F4F] text-lg tabular-nums">
                    S${row.premium}
                  </p>
                  <p
                    className={`mt-1 font-medium text-xs ${
                      row.up === true
                        ? "text-[#008B8B]"
                        : row.up === false
                          ? "text-[#DC2626]"
                          : "text-[#708090]"
                    }`}
                  >
                    {row.change}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="col-span-5 rounded-3xl bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-semibold text-[#2F4F4F]">
                Registration Activity
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[#708090] text-xs">Less</span>
                <div className="flex gap-1">
                  {[10, 30, 50, 70, 100].map((opacity) => (
                    <div
                      key={opacity}
                      className="h-3 w-3 rounded-sm"
                      style={{
                        backgroundColor: `rgba(25, 25, 112, ${opacity / 100})`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-[#708090] text-xs">More</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {heatmapOpacities.map((opacity, i) => (
                <div
                  key={`heatmap-${i}-${opacity}`}
                  className="aspect-square rounded-lg"
                  style={{ backgroundColor: `rgba(25, 25, 112, ${opacity})` }}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-between text-[#708090] text-xs">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>
          </div>

          {/* Top Makes */}
          <div className="col-span-4 rounded-3xl bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-semibold text-[#2F4F4F]">Top Makes</h2>
              <button
                type="button"
                className="font-medium text-[#191970] text-xs hover:underline"
              >
                View all
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {topMakes.map((item, i) => (
                <div key={item.make} className="flex items-center gap-3">
                  <span className="w-5 font-medium text-[#708090] text-sm">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-medium text-sm">{item.make}</span>
                      <span className="text-[#708090] text-xs tabular-nums">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#F0F4F8]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(item.count / 12500) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="col-span-3 rounded-3xl bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-semibold text-[#2F4F4F]">Recent Analysis</h2>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0F4F8] text-[#708090] hover:bg-[#E2E8F0]"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {posts.map((post) => (
                <button
                  type="button"
                  key={post.title}
                  className="group flex items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-[#F0F4F8]"
                >
                  <div
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      post.status === "new" ? "bg-[#008B8B]" : "bg-[#E2E8F0]"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm group-hover:text-[#191970]">
                      {post.title}
                    </p>
                    <p className="text-[#708090] text-xs">{post.date}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Yearly Trend Chart */}
          <div className="col-span-7 rounded-3xl bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-[#2F4F4F]">
                  Yearly Registrations
                </h2>
                <p className="text-[#708090] text-sm">
                  Total registrations over the years
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-[#F0F4F8] p-1">
                <button
                  type="button"
                  className="rounded-full bg-white px-4 py-1.5 font-medium text-[#2F4F4F] text-xs shadow-sm"
                >
                  Monthly
                </button>
                <button
                  type="button"
                  className="rounded-full px-4 py-1.5 font-medium text-[#708090] text-xs"
                >
                  Annually
                </button>
              </div>
            </div>
            <div className="flex h-[160px] items-end gap-4">
              {[
                { year: 2019, h: 45, value: "38.5K" },
                { year: 2020, h: 35, value: "29.8K" },
                { year: 2021, h: 52, value: "44.2K" },
                { year: 2022, h: 68, value: "57.8K" },
                { year: 2023, h: 75, value: "63.8K" },
                { year: 2024, h: 90, value: "76.5K" },
              ].map((item, i, arr) => (
                <div
                  key={item.year}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <span className="font-medium text-[#708090] text-xs tabular-nums">
                    {item.value}
                  </span>
                  <div
                    className={`w-full rounded-t-xl ${
                      i === arr.length - 1 ? "bg-[#191970]" : "bg-[#E2E8F0]"
                    }`}
                    style={{ height: `${item.h * 1.4}px` }}
                  />
                  <span className="text-[#708090] text-xs">{item.year}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="col-span-5 rounded-3xl border border-[#E2E8F0] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-[#2F4F4F]">Market Overview</h2>
              <span className="rounded-full bg-[#E0FFFF] px-3 py-1 font-medium text-[#008B8B] text-xs">
                This Month
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-[#F0F4F8] p-4">
                <p className="text-[#708090] text-sm">New Cars</p>
                <p className="mt-1 font-bold text-2xl text-[#191970] tabular-nums">
                  3,245
                </p>
              </div>
              <div className="rounded-2xl bg-[#F0F4F8] p-4">
                <p className="text-[#708090] text-sm">Used Cars</p>
                <p className="mt-1 font-bold text-2xl text-[#191970] tabular-nums">
                  1,872
                </p>
              </div>
              <div className="rounded-2xl bg-[#F0F4F8] p-4">
                <p className="text-[#708090] text-sm">EVs</p>
                <p className="mt-1 font-bold text-2xl text-[#191970] tabular-nums">
                  892
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
