"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TopMakeData {
  make: string;
  value: number;
}

interface Top5CarMakesByYearProps {
  topMakes2023: TopMakeData[];
}

export const Top5CarMakesByYear = ({
  topMakes2023,
}: Top5CarMakesByYearProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Car Makes (Latest Month)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topMakes2023} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="make" type="category" />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
