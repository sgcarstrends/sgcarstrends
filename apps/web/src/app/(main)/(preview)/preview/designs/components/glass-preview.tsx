"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatNumber, MOCK_DATA } from "./shared";

/**
 * Warm Minimal Design Preview (Based on Clean Minimal)
 *
 * Style: Clean minimal structure with warm earthy tones
 * Colours: Sand, terracotta, warm grays with amber accent
 * Feel: Professional, approachable, calm warmth
 */
export function WarmMinimalPreview() {
  return (
    <div className="min-h-[800px] rounded-3xl bg-stone-100 p-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-widest">
              Dashboard
            </p>
            <h2 className="mt-1 font-medium text-2xl text-stone-800">
              Warm Minimal
            </h2>
          </div>
          <div className="flex gap-1 rounded-full border border-stone-200 bg-white p-1">
            <button
              type="button"
              className="rounded-full px-4 py-1.5 text-sm text-stone-500 transition-colors hover:bg-stone-50"
            >
              Cars
            </button>
            <button
              type="button"
              className="rounded-full bg-amber-600 px-4 py-1.5 text-sm text-white"
            >
              COE
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Total Registrations */}
          <div className="rounded-xl border border-stone-200 bg-white p-6">
            <p className="text-sm text-stone-500">Total Registrations</p>
            <p className="mt-3 font-medium text-4xl text-stone-800 tabular-nums">
              {formatNumber(MOCK_DATA.totalRegistrations)}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="flex items-center gap-1 text-sm text-teal-600">
                <TrendingUp className="size-4" />+{MOCK_DATA.monthlyChange}%
              </span>
              <span className="text-sm text-stone-400">vs last month</span>
            </div>
          </div>

          {/* Top Make */}
          <div className="rounded-xl border border-stone-200 bg-white p-6">
            <p className="text-sm text-stone-500">Top Make</p>
            <p className="mt-3 font-medium text-4xl text-stone-800">
              {MOCK_DATA.topMake}
            </p>
            <div className="mt-4">
              <span className="text-sm text-stone-500">
                892 units registered
              </span>
            </div>
          </div>

          {/* Monthly Growth */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
            <p className="text-amber-700 text-sm">Monthly Growth</p>
            <p className="mt-3 font-medium text-4xl text-amber-600">
              +{MOCK_DATA.monthlyChange}%
            </p>
            <div className="mt-4">
              <span className="text-amber-600 text-sm">
                Steady upward momentum
              </span>
            </div>
          </div>
        </div>

        {/* COE Premium Cards */}
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <h3 className="font-medium text-stone-800">Latest COE Premiums</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
            {MOCK_DATA.coeCategories.map((coe) => (
              <div key={coe.category} className="rounded-lg bg-stone-50 p-4">
                <p className="text-stone-500 text-xs">{coe.category}</p>
                <p className="mt-2 font-medium text-lg text-stone-800 tabular-nums">
                  {formatCurrency(coe.premium)}
                </p>
                <p
                  className={`mt-1 flex items-center gap-1 text-xs ${
                    coe.change >= 0 ? "text-rose-500" : "text-teal-600"
                  }`}
                >
                  {coe.change >= 0 ? (
                    <TrendingUp className="size-3" />
                  ) : (
                    <TrendingDown className="size-3" />
                  )}
                  {coe.change >= 0 ? "+" : ""}
                  {coe.change}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <h3 className="font-medium text-stone-800">Registration Trends</h3>
          <div className="mt-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DATA.chartData}>
                <defs>
                  <linearGradient id="warmGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#a8a29e", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#a8a29e", fontSize: 12 }}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e7e5e4",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: number) => [formatNumber(value), "Units"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#d97706"
                  strokeWidth={2}
                  fill="url(#warmGradient)"
                  dot={{ fill: "#d97706", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: "#d97706" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table Preview */}
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <h3 className="font-medium text-stone-800">Top Makes</h3>
          <div className="mt-4">
            <table className="w-full">
              <thead>
                <tr className="border-stone-100 border-b">
                  <th className="pb-3 text-left font-normal text-stone-500 text-xs uppercase tracking-wider">
                    Make
                  </th>
                  <th className="pb-3 text-right font-normal text-stone-500 text-xs uppercase tracking-wider">
                    Registrations
                  </th>
                  <th className="pb-3 text-right font-normal text-stone-500 text-xs uppercase tracking-wider">
                    Share
                  </th>
                  <th className="pb-3 text-right font-normal text-stone-500 text-xs uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DATA.tableData.map((row, index) => (
                  <tr
                    key={row.make}
                    className={
                      index !== MOCK_DATA.tableData.length - 1
                        ? "border-stone-50 border-b"
                        : ""
                    }
                  >
                    <td className="py-4 text-sm text-stone-800">{row.make}</td>
                    <td className="py-4 text-right text-sm text-stone-600 tabular-nums">
                      {formatNumber(row.registrations)}
                    </td>
                    <td className="py-4 text-right text-sm text-stone-600">
                      {row.share}
                    </td>
                    <td className="py-4 text-right">
                      {row.trend === "up" ? (
                        <span className="inline-flex items-center gap-1 text-sm text-teal-600">
                          <TrendingUp className="size-3" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-500 text-sm">
                          <TrendingDown className="size-3" />
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
