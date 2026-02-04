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
 * Bold & Vibrant Design Preview
 *
 * Style: Strong accent colours, large typography, high contrast, chunky elements
 * Colours: Bright teal/coral accents on clean white
 * Feel: Energetic, attention-grabbing, confident
 */
export function BoldPreview() {
  return (
    <div className="min-h-[800px] rounded-3xl bg-white p-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-sm text-teal-500 uppercase tracking-wider">
              Dashboard
            </p>
            <h2 className="font-black text-4xl text-gray-900">
              Bold & Vibrant
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-full border-2 border-gray-200 px-5 py-2.5 font-bold text-gray-600 transition-all hover:border-teal-500 hover:text-teal-500"
            >
              Cars
            </button>
            <button
              type="button"
              className="rounded-full border-4 border-teal-500 bg-teal-500 px-5 py-2.5 font-bold text-white shadow-[4px_4px_0_0_#0d9488]"
            >
              COE
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Total Registrations */}
          <div className="rounded-2xl border-4 border-teal-500 bg-white p-6 shadow-[8px_8px_0_0_#14b8a6]">
            <p className="font-bold text-gray-500 text-sm uppercase tracking-wider">
              Total Registrations
            </p>
            <p className="mt-2 font-black text-6xl text-teal-600 tabular-nums">
              {formatNumber(MOCK_DATA.totalRegistrations)}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full border-2 border-emerald-500 bg-emerald-50 px-3 py-1 font-bold text-emerald-600 text-sm">
                <TrendingUp className="size-4" />+{MOCK_DATA.monthlyChange}%
              </span>
            </div>
          </div>

          {/* Top Make */}
          <div className="rounded-2xl border-4 border-orange-400 bg-white p-6 shadow-[8px_8px_0_0_#fb923c]">
            <p className="font-bold text-gray-500 text-sm uppercase tracking-wider">
              Top Make
            </p>
            <p className="mt-2 font-black text-5xl text-orange-500">
              {MOCK_DATA.topMake}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full border-2 border-orange-400 bg-orange-50 px-3 py-1 font-bold text-orange-600 text-sm">
                892 units
              </span>
            </div>
          </div>

          {/* Monthly Growth */}
          <div className="rounded-2xl border-4 border-purple-500 bg-white p-6 shadow-[8px_8px_0_0_#a855f7]">
            <p className="font-bold text-gray-500 text-sm uppercase tracking-wider">
              Monthly Growth
            </p>
            <p className="mt-2 font-black text-6xl text-purple-600">
              +{MOCK_DATA.monthlyChange}%
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full border-2 border-purple-500 bg-purple-50 px-3 py-1 font-bold text-purple-600 text-sm">
                Trending up
              </span>
            </div>
          </div>
        </div>

        {/* COE Premium Cards */}
        <div className="rounded-2xl border-4 border-gray-900 bg-white p-6 shadow-[8px_8px_0_0_#111827]">
          <h3 className="mb-4 font-black text-2xl text-gray-900">
            Latest COE Premiums
          </h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {MOCK_DATA.coeCategories.map((coe, index) => {
              const colors = [
                "border-teal-500 bg-teal-50",
                "border-orange-400 bg-orange-50",
                "border-purple-500 bg-purple-50",
                "border-pink-500 bg-pink-50",
                "border-blue-500 bg-blue-50",
              ];
              const textColors = [
                "text-teal-600",
                "text-orange-500",
                "text-purple-600",
                "text-pink-600",
                "text-blue-600",
              ];
              return (
                <div
                  key={coe.category}
                  className={`rounded-xl border-3 p-4 ${colors[index]}`}
                >
                  <p className="font-bold text-gray-600 text-xs uppercase">
                    {coe.category}
                  </p>
                  <p
                    className={`mt-1 font-black text-xl tabular-nums ${textColors[index]}`}
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
        <div className="rounded-2xl border-4 border-teal-500 bg-white p-6 shadow-[8px_8px_0_0_#14b8a6]">
          <h3 className="mb-4 font-black text-2xl text-gray-900">
            Registration Trends
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DATA.chartData}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 700 }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "4px solid #14b8a6",
                    borderRadius: "12px",
                    fontWeight: 700,
                    boxShadow: "4px 4px 0 0 #14b8a6",
                  }}
                  formatter={(value: number) => [formatNumber(value), "Units"]}
                />
                <Bar
                  dataKey="value"
                  fill="#14b8a6"
                  radius={[8, 8, 0, 0]}
                  stroke="#0d9488"
                  strokeWidth={2}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table Preview */}
        <div className="rounded-2xl border-4 border-gray-900 bg-white p-6 shadow-[8px_8px_0_0_#111827]">
          <h3 className="mb-4 font-black text-2xl text-gray-900">Top Makes</h3>
          <div className="overflow-hidden rounded-xl border-2 border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="border-gray-200 border-b-2 bg-gray-50">
                  <th className="px-4 py-3 text-left font-black text-gray-600 text-xs uppercase tracking-wider">
                    Make
                  </th>
                  <th className="px-4 py-3 text-right font-black text-gray-600 text-xs uppercase tracking-wider">
                    Registrations
                  </th>
                  <th className="px-4 py-3 text-right font-black text-gray-600 text-xs uppercase tracking-wider">
                    Share
                  </th>
                  <th className="px-4 py-3 text-right font-black text-gray-600 text-xs uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DATA.tableData.map((row) => (
                  <tr
                    key={row.make}
                    className="border-gray-100 border-b last:border-0"
                  >
                    <td className="px-4 py-3 font-bold text-gray-900">
                      {row.make}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-700 tabular-nums">
                      {formatNumber(row.registrations)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-700">
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
