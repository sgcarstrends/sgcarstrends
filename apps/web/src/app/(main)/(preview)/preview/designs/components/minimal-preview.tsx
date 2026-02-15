"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatNumber, MOCK_DATA } from "./shared";

/**
 * Clean Minimal Design Preview
 *
 * Style: Maximum whitespace, subtle borders, muted colours, refined typography
 * Colours: Neutral grays with single accent colour
 * Feel: Professional, calm, focused on data
 */
export function MinimalPreview() {
  return (
    <div className="min-h-[800px] rounded-3xl bg-gray-50 p-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest">
              Dashboard
            </p>
            <h2 className="mt-1 font-medium text-2xl text-gray-900">
              Clean Minimal
            </h2>
          </div>
          <div className="flex gap-1 rounded-full border border-gray-200 bg-white p-1">
            <button
              type="button"
              className="rounded-full px-4 py-1.5 text-gray-500 text-sm transition-colors hover:bg-gray-50"
            >
              Cars
            </button>
            <button
              type="button"
              className="rounded-full bg-gray-900 px-4 py-1.5 text-sm text-white"
            >
              COE
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Total Registrations */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-gray-500 text-sm">Total Registrations</p>
            <p className="mt-3 font-medium text-4xl text-gray-900 tabular-nums">
              {formatNumber(MOCK_DATA.totalRegistrations)}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-600 text-sm">
                <TrendingUp className="size-4" />+{MOCK_DATA.monthlyChange}%
              </span>
              <span className="text-gray-400 text-sm">vs last month</span>
            </div>
          </div>

          {/* Top Make */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-gray-500 text-sm">Top Make</p>
            <p className="mt-3 font-medium text-4xl text-gray-900">
              {MOCK_DATA.topMake}
            </p>
            <div className="mt-4">
              <span className="text-gray-500 text-sm">
                892 units registered
              </span>
            </div>
          </div>

          {/* Monthly Growth */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-gray-500 text-sm">Monthly Growth</p>
            <p className="mt-3 font-medium text-4xl text-emerald-600">
              +{MOCK_DATA.monthlyChange}%
            </p>
            <div className="mt-4">
              <span className="text-gray-500 text-sm">
                Steady upward momentum
              </span>
            </div>
          </div>
        </div>

        {/* COE Premium Cards */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-medium text-gray-900">Latest COE Premiums</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
            {MOCK_DATA.coeCategories.map((coe) => (
              <div key={coe.category} className="rounded-lg bg-gray-50 p-4">
                <p className="text-gray-500 text-xs">{coe.category}</p>
                <p className="mt-2 font-medium text-gray-900 text-lg tabular-nums">
                  {formatCurrency(coe.premium)}
                </p>
                <p
                  className={`mt-1 flex items-center gap-1 text-xs ${
                    coe.change >= 0 ? "text-rose-500" : "text-emerald-600"
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
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-medium text-gray-900">Registration Trends</h3>
          <div className="mt-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_DATA.chartData}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => [formatNumber(Number(value)), "Units"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#111827"
                  strokeWidth={2}
                  dot={{ fill: "#111827", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: "#111827" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table Preview */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-medium text-gray-900">Top Makes</h3>
          <div className="mt-4">
            <table className="w-full">
              <thead>
                <tr className="border-gray-100 border-b">
                  <th className="pb-3 text-left font-normal text-gray-500 text-xs uppercase tracking-wider">
                    Make
                  </th>
                  <th className="pb-3 text-right font-normal text-gray-500 text-xs uppercase tracking-wider">
                    Registrations
                  </th>
                  <th className="pb-3 text-right font-normal text-gray-500 text-xs uppercase tracking-wider">
                    Share
                  </th>
                  <th className="pb-3 text-right font-normal text-gray-500 text-xs uppercase tracking-wider">
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
                        ? "border-gray-50 border-b"
                        : ""
                    }
                  >
                    <td className="py-4 text-gray-900 text-sm">{row.make}</td>
                    <td className="py-4 text-right text-gray-600 text-sm tabular-nums">
                      {formatNumber(row.registrations)}
                    </td>
                    <td className="py-4 text-right text-gray-600 text-sm">
                      {row.share}
                    </td>
                    <td className="py-4 text-right">
                      {row.trend === "up" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 text-sm">
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
