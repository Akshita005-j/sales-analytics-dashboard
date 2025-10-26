import React, { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, DollarSign, Users, ShoppingCart, Filter, Download } from 'lucide-react';

// Generate realistic sample data
const generateSalesData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const regions = ['North', 'South', 'East', 'West'];
  const products = ['Electronics', 'Clothing', 'Food', 'Home & Garden', 'Sports'];
  
  const monthlyData = months.map((month, idx) => ({
    month,
    revenue: 45000 + Math.random() * 30000 + idx * 2000,
    orders: 450 + Math.random() * 200 + idx * 10,
    customers: 380 + Math.random() * 150 + idx * 8,
    profit: 12000 + Math.random() * 8000 + idx * 600
  }));

  const productData = products.map(product => ({
    name: product,
    sales: 15000 + Math.random() * 35000,
    units: 200 + Math.random() * 500,
    growth: (Math.random() * 40 - 10).toFixed(1)
  }));

  const regionData = regions.map(region => ({
    region,
    revenue: 80000 + Math.random() * 60000,
    customers: 1200 + Math.random() * 800,
    avgOrderValue: 85 + Math.random() * 50
  }));

  const dailyData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    revenue: 1500 + Math.random() * 2000,
    orders: 15 + Math.random() * 25
  }));

  return { monthlyData, productData, regionData, dailyData };
};

const Dashboard = () => {
  const [data] = useState(generateSalesData());
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalRevenue = data.monthlyData.reduce((sum, m) => sum + m.revenue, 0);
    const totalOrders = data.monthlyData.reduce((sum, m) => sum + m.orders, 0);
    const totalCustomers = data.monthlyData.reduce((sum, m) => sum + m.customers, 0);
    const avgOrderValue = totalRevenue / totalOrders;
    
    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      avgOrderValue
    };
  }, [data]);

  // Filter data by region
  const filteredData = useMemo(() => {
    if (selectedRegion === 'all') return data.regionData;
    return data.regionData.filter(r => r.region === selectedRegion);
  }, [selectedRegion, data]);

  const KPICard = ({ title, value, icon: Icon, prefix = '', suffix = '', trend }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <Icon className="w-5 h-5 text-blue-500" />
      </div>
      <div className="text-2xl font-bold text-gray-900">
        {prefix}{typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 0 }) : value}{suffix}
      </div>
      {trend && (
        <div className="mt-2 flex items-center text-sm text-green-600">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>{trend}% vs last period</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive analysis of sales performance and customer behavior</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard 
            title="Total Revenue" 
            value={kpis.totalRevenue} 
            icon={DollarSign} 
            prefix="$" 
            trend={12.5}
          />
          <KPICard 
            title="Total Orders" 
            value={kpis.totalOrders} 
            icon={ShoppingCart} 
            trend={8.3}
          />
          <KPICard 
            title="Total Customers" 
            value={kpis.totalCustomers} 
            icon={Users} 
            trend={15.7}
          />
          <KPICard 
            title="Avg Order Value" 
            value={kpis.avgOrderValue} 
            icon={TrendingUp} 
            prefix="$" 
            trend={4.2}
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 flex flex-wrap gap-4 items-center">
          <Filter className="w-5 h-5 text-gray-600" />
          <select 
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            <option value="revenue">Revenue</option>
            <option value="orders">Orders</option>
            <option value="customers">Customers</option>
          </select>
          <select 
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="all">All Regions</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </select>
          <button className="ml-auto flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Revenue Trend */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Product Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Category Sales</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="sales" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Regional Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Region</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.regionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ region, percent }) => `${region} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {data.regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Performance (Last 30 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" name="Day" />
                <YAxis dataKey="revenue" name="Revenue" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value) => `$${value.toLocaleString()}`} />
                <Scatter name="Daily Revenue" data={data.dailyData} fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Performance Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Performance Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Product</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Sales</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Units Sold</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Growth</th>
                </tr>
              </thead>
              <tbody>
                {data.productData.map((product, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">${product.sales.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{Math.round(product.units)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`font-semibold ${parseFloat(product.growth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.growth}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Key Insights</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Revenue shows consistent growth trend with 12.5% increase compared to previous period</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Electronics and Home & Garden categories are top performers with highest sales volume</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Customer acquisition rate increased by 15.7%, indicating successful marketing campaigns</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Average order value improved by 4.2%, suggesting effective upselling strategies</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;