export type Profile = { id: string; email: string; firstName: string; lastName: string; phone: string | null; emailVerified: boolean; role: 'CUSTOMER' | 'ADMIN' };
export type Address = { id: string; label: string; line1: string; line2: string | null; city: string; postalCode: string; country: string; defaultAddress: boolean };
export type OrderItem = { productId: string; productName: string; variant: string | null; quantity: number; unitPrice: number; lineTotal: number };
export type OrderSummary = { id: string; orderNumber: string; createdAt: string; total: number; currency: string; paymentStatus: string; deliveryStatus: string; items: OrderItem[] };
export type ShippingMethod = 'STANDARD_HOME_DELIVERY';
export type ShippingQuote = { subtotal: number; shippingCost: number; total: number; currency: string; shippingMethod: ShippingMethod; shippingMethodLabel: string };
export type OrderDetail = OrderSummary & { subtotal: number; shippingCost: number; shippingMethod: ShippingMethod; shippingMethodLabel: string; shippingAddressSnapshot: string; carrier: string | null; trackingNumber: string | null; trackingUrl: string | null; shippedAt: string | null; shippingName: string; shippingLine1: string; shippingLine2: string | null; shippingCity: string; shippingPostalCode: string; shippingCountry: string };
export type AdminOrder = OrderDetail & { customerEmail: string };
export type CheckoutResponse = { checkoutUrl: string };
export type CheckoutStatus = { orderId: string; paymentStatus: string; deliveryStatus: string };

export type ApiErrorBody = { error?: string; message?: string; status?: number };
