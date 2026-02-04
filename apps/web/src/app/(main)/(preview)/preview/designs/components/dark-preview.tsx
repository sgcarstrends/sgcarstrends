"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatNumber, MOCK_DATA } from "./shared";

/**
 * Monochrome Bold Design Preview (Based on Bold & Vibrant)
 *
 * Style: Chunky shadows and bold typography with black/white palette
 * Colours: Black and white with electric blue accent
 * Feel: Striking, modern, high-impact
 */
export function MonochromeBoldPreview() {
  return (
    <div className="min-h-[800px] rounded-3xl bg-zinc-100 p-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-blue-600 text-sm uppercase tracking-wider">
              Dashboard
            </p>
            <h2 className="font-black text-4xl text-zinc-900">
              Monochrome Bold
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-full border-2 border-zinc-300 px-5 py-2.5 font-bold text-zinc-600 transition-all hover:border-zinc-900 hover:text-zinc-900"
            >
              Cars
            </button>
            <button
              type="button"
              className="rounded-full border-4 border-zinc-900 bg-zinc-900 px-5 py-2.5 font-bold text-white shadow-[4px_4px_0_0_#3b82f6]"
            >
              COE
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Total Registrations */}
          <div className="rounded-2xl border-4 border-zinc-900 bg-white p-6 shadow-[8px_8px_0_0_#18181b]">
            <p className="font-bold text-sm text-zinc-500 uppercase tracking-wider">
              Total Registrations
            </p>
            <p className="mt-2 font-black text-6xl text-zinc-900 tabular-nums">
              {formatNumber(MOCK_DATA.totalRegistrations)}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full border-2 border-blue-500 bg-blue-50 px-3 py-1 font-bold text-blue-600 text-sm">
                <TrendingUp className="size-4" />+{MOCK_DATA.monthlyChange}%
              </span>
            </div>
          </div>

          {/* Top Make */}
          <div className="rounded-2xl border-4 border-zinc-900 bg-white p-6 shadow-[8px_8px_0_0_#18181b]">
            <p className="font-bold text-sm text-zinc-500 uppercase tracking-wider">
              Top Make
            </p>
            <p className="mt-2 font-black text-5xl text-zinc-900">
              {MOCK_DATA.topMake}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full border-2 border-zinc-300 bg-zinc-100 px-3 py-1 font-bold text-sm text-zinc-600">
                892 units
              </span>
            </div>
          </div>

          {/* Monthly Growth */}
          <div className="rounded-2xl border-4 border-blue-500 bg-blue-500 p-6 shadow-[8px_8px_0_0_#18181b]">
            <p className="font-bold text-blue-100 text-sm uppercase tracking-wider">
              Monthly Growth
            </p>
            <p className="mt-2 font-black text-6xl text-white">
              +{MOCK_DATA.monthlyChange}%
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full border-2 border-white/30 bg-white/20 px-3 py-1 font-bold text-sm text-white">
                Trending up
              </span>
            </div>
          </div>
        </div>

        {/* COE Premium Cards */}
        <div className="rounded-2xl border-4 border-zinc-900 bg-white p-6 shadow-[8px_8px_0_0_#18181b]">
          <h3 className="font-black text-2xl text-zinc-900">
            Latest COE Premiums
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
            {MOCK_DATA.coeCategories.map((coe, index) => {
              const isHighlight = index === 0;
              return (
                <div
                  key={coe.category}
                  className={`rounded-xl border-2 p-4 ${
                    isHighlight
                      ? "border-blue-500 bg-blue-50"
                      : "border-zinc-200 bg-zinc-50"
                  }`}
                >
                  <p
                    className={`font-bold text-xs uppercase ${isHighlight ? "text-blue-600" : "text-zinc-500"}`}
                  >
                    {coe.category}
                  </p>
                  <p
                    className={`mt-1 font-black text-xl tabular-nums ${isHighlight ? "text-blue-600" : "text-zinc-900"}`}
                  >
                    {formatCurrency(coe.premium)}
                  </p>
                  <p
                    className={`mt-1 flex items-center gap-1 font-bold text-sm ${
                      coe.change >= 0 ? "text-rose-500" : "text-emerald-500"
                    }`}
                  >
                    {coe.change >= 0 ? (
                      <TrendingUp className="size-4" />
                    ) : (
                      <TrendingDown className="size-4" />
                    )}
                    {coe.change >= 0 ? "+" : ""}
                    {coe.change}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart */}
        <div className="rounded-2xl border-4 border-zinc-900 bg-white p-6 shadow-[8px_8px_0_0_#3b82f6]">
          <h3 className="font-black text-2xl text-zinc-900">
            Registration Trends
          </h3>
          <div className="mt-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DATA.chartData}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#71717a", fontSize: 12, fontWeight: 700 }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "4px solid #18181b",
                    borderRadius: "12px",
                    fontWeight: 700,
                    boxShadow: "4px 4px 0 0 #18181b",
                  }}
                  formatter={(value: number) => [formatNumber(value), "Units"]}
                />
                <Bar
                  dataKey="value"
                  fill="#18181b"
                  radius={[8, 8, 0, 0]}
                  stroke="#18181b"
                  strokeWidth={2}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table Preview */}
        <div className="rounded-2xl border-4 border-zinc-900 bg-white p-6 shadow-[8px_8px_0_0_#18181b]">
          <h3 className="font-black text-2xl text-zinc-900">Top Makes</h3>
          <div className="mt-4 overflow-hidden rounded-xl border-2 border-zinc-200">
            <table className="w-full">
              <thead>
                <tr className="border-zinc-200 border-b-2 bg-zinc-50">
                  <th className="px-4 py-3 text-left font-black text-xs text-zinc-600 uppercase tracking-wider">
                    Make
                  </th>
                  <th className="px-4 py-3 text-right font-black text-xs text-zinc-600 uppercase tracking-wider">
                    Registrations
                  </th>
                  <th className="px-4 py-3 text-right font-black text-xs text-zinc-600 uppercase tracking-wider">
                    Share
                  </th>
                  <th className="px-4 py-3 text-right font-black text-xs text-zinc-600 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DATA.tableData.map((row) => (
                  <tr
                    key={row.make}
                    className="border-zinc-100 border-b last:border-0"
                  >
                    <td className="px-4 py-3 font-bold text-zinc-900">
                      {row.make}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-zinc-700 tabular-nums">
                      {formatNumber(row.registrations)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-zinc-700">
                      {row.share}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {row.trend === "up" ? (
                        <span className="inline-flex items-center gap-1 rounded-full border-2 border-emerald-500 bg-emerald-50 px-2 py-1 font-bold text-emerald-600 text-xs">
                          <TrendingUp className="size-3" /> Up
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border-2 border-rose-500 bg-rose-50 px-2 py-1 font-bold text-rose-600 text-xs">
                          <TrendingDown className="size-3" /> Down
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
