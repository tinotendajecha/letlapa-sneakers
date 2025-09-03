'use client';

import { useState } from 'react';
import { Package, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderCard } from '@/components/orders/order-card';
import { mockOrders } from '@/lib/mock-data';

export default function MyOrdersPage() {
  // TODO: Replace with actual user authentication and user-specific orders
  const userOrders = mockOrders; // In real app, filter by current user

  const activeOrders = userOrders.filter(order => 
    ['paid', 'processing', 'shipped'].includes(order.status)
  );

  const orderHistory = userOrders.filter(order => 
    ['delivered', 'cancelled'].includes(order.status)
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">My Orders</h1>
          <p className="text-muted-foreground mt-2">
            Track your sneaker orders and view your purchase history
          </p>
        </div>

        {/* Order Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="active" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Active Orders ({activeOrders.length})</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Order History ({orderHistory.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Active Orders */}
          <TabsContent value="active" className="space-y-6">
            {activeOrders.length > 0 ? (
              activeOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No active orders</h3>
                <p className="text-muted-foreground mb-6">
                  You don't have any orders in progress right now.
                </p>
                <a
                  href="/shop"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  Start Shopping
                </a>
              </div>
            )}
          </TabsContent>

          {/* Order History */}
          <TabsContent value="history" className="space-y-6">
            {orderHistory.length > 0 ? (
              orderHistory.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No order history</h3>
                <p className="text-muted-foreground mb-6">
                  Your completed and cancelled orders will appear here.
                </p>
                <a
                  href="/shop"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  Browse Sneakers
                </a>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* TODO Notice */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            ⚠️ Order Tracking - UI Only
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            This order tracking interface is for demonstration purposes. To make it functional, you'll need to implement user authentication and connect to a real order management system.
          </p>
        </div>
      </div>
    </div>
  );
}