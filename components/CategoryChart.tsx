import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction, ExpenseCategory } from '../types.ts';

interface CategoryChartProps {
  expenses: Transaction[];
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF',
  '#FF19A3', '#19D4FF', '#FFD419', '#8C19FF', '#FF1919'
];

const CategoryChart: React.FC<CategoryChartProps> = ({ expenses }) => {
  const chartData = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      const category = expense.category || 'Other';
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  if (expenses.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="mt-2">No expense data to display chart.</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-700 p-2 border border-gray-600 rounded-md shadow-lg">
          <p className="label text-gray-200">{`${payload[0].name} : ${payload[0].value.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full">
      <h2 className="text-xl font-semibold mb-4 text-rose-400">Expense Breakdown</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconSize={10}
              wrapperStyle={{ color: '#E5E7EB', fontSize: '14px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;
