import Link from 'next/link';
import { Package, ShoppingBag, Users, TrendingUp, DollarSign, Eye } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your Letlapa Sneakers store
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">R124,350</p>
                <p className="text-sm text-green-600">+12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Orders</p>
                <p className="text-2xl font-bold">342</p>
                <p className="text-sm text-blue-600">+8% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Products</p>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-purple-600">+5 this week</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customers</p>
                <p className="text-2xl font-bold">1,429</p>
                <p className="text-sm text-orange-600">+23 this week</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link 
            href="/admin/products" 
            className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Manage Products</h3>
                <p className="text-sm text-muted-foreground">Add, edit, or remove sneakers</p>
              </div>
            </div>
          </Link>

          <Link 
            href="/admin/orders" 
            className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">View Orders</h3>
                <p className="text-sm text-muted-foreground">Track and manage orders</p>
              </div>
            </div>
          </Link>

          <Link 
            href="/admin/leads" 
            className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Customer Leads</h3>
                <p className="text-sm text-muted-foreground">View contact inquiries</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Recent Orders</h3>
              <Link href="/admin/orders" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { id: '#1001', customer: 'Thabo M.', amount: 'R2,899', status: 'Completed' },
                { id: '#1002', customer: 'Sarah L.', amount: 'R1,299', status: 'Processing' },
                { id: '#1003', customer: 'Michael K.', amount: 'R2,199', status: 'Shipped' },
                { id: '#1004', customer: 'Nomsa P.', amount: 'R4,299', status: 'Completed' },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Top Products</h3>
              <Link href="/admin/products" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Air Jordan 1 Retro High OG', sold: 45, revenue: 'R130,455' },
                { name: 'Adidas Yeezy Boost 350 V2', sold: 23, revenue: 'R98,877' },
                { name: 'Nike Air Max 90', sold: 38, revenue: 'R83,562' },
                { name: 'Converse Chuck Taylor All Star', sold: 52, revenue: 'R67,548' },
              ].map((product, index) => (
                <div key={product.name} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sold} sold</p>
                    </div>
                  </div>
                  <p className="font-medium text-sm">{product.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TODO Notice */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            ⚠️ Admin Dashboard - UI Only
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
            This admin interface is for demonstration purposes. To make it functional, you'll need to:
          </p>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• Implement backend APIs for product management</li>
            <li>• Add order processing and tracking system</li>
            <li>• Integrate with payment providers (Stripe, PayFast)</li>
            <li>• Set up user authentication and admin roles</li>
            <li>• Connect to a database for persistent data</li>
          </ul>
        </div>
      </div>
    </div>
  );
}