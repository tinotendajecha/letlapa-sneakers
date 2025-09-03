'use client';

import Image from 'next/image';
import { Calendar, MapPin, Package } from 'lucide-react';
import { Order } from '@/lib/mock-data';
import { OrderProgress } from './order-progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  className?: string;
}

const statusColors = {
  paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  processing: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
};

export function OrderCard({ order, className }: OrderCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-semibold text-lg">Order {order.id}</h3>
              <Badge className={statusColors[order.status]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(order.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Package className="h-4 w-4" />
                <span>R{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {order.trackingNumber && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Tracking Number</p>
              <p className="font-mono text-sm font-medium">{order.trackingNumber}</p>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Tracker */}
        <OrderProgress status={order.status} />

        {/* Order Items */}
        <div>
          <h4 className="font-medium mb-4">Items Ordered</h4>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
                <div className="w-16 h-16 bg-background rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm truncate">{item.productName}</h5>
                  <p className="text-xs text-muted-foreground">
                    {item.brand} • Size {item.size} • {item.color}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                    <span className="font-medium text-sm">R{item.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Shipping Address
          </h4>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-medium">{order.customerName}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.province}<br />
              {order.shippingAddress.postalCode}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}