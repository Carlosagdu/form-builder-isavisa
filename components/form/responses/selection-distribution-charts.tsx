"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { SelectionFieldDistribution } from "@/lib/forms/response-analytics"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const CHART_COLORS = [
  "#16a34a",
  "#f97316",
  "#0ea5e9",
  "#eab308",
  "#ef4444",
  "#6366f1",
  "#14b8a6",
  "#ec4899",
]

export function SelectionDistributionCharts({
  distributions,
}: {
  distributions: SelectionFieldDistribution[]
}) {
  if (distributions.length === 0) {
    return null
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {distributions.map((distribution) => {
        const chartData = distribution.distribution.map((item, index) => ({
          name: item.option,
          value: item.count,
          fill: CHART_COLORS[index % CHART_COLORS.length],
        }))

        const nonZeroChartData = chartData.filter((item) => item.value > 0)
        const showPie = nonZeroChartData.length > 0 && nonZeroChartData.length <= 5

        return (
          <Card key={distribution.fieldId}>
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">{distribution.fieldLabel}</CardTitle>
                <Badge variant="outline">{distribution.fieldType}</Badge>
              </div>
              <p className="text-xs text-zinc-500">
                {distribution.totalResponses} respuestas en este campo
              </p>
            </CardHeader>
            <CardContent>
              {nonZeroChartData.length === 0 ? (
                <p className="text-sm text-zinc-500">Aun no hay respuestas para mostrar en esta grafica.</p>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    {showPie ? (
                      <PieChart>
                        <Pie
                          data={nonZeroChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          label
                        >
                          {nonZeroChartData.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    ) : (
                      <BarChart data={nonZeroChartData} margin={{ top: 8, right: 8, left: 0, bottom: 12 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-18} textAnchor="end" height={56} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {nonZeroChartData.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

