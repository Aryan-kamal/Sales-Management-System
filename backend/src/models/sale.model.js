import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema(
  {
    transactionId: { type: String, index: true },
    date: { type: Date },
    customerId: String,
    customerName: { type: String },
    phoneNumber: { type: String },
    gender: { type: String },
    age: Number,
    customerRegion: { type: String },
    customerType: String,
    productId: String,
    productName: String,
    brand: String,
    productCategory: { type: String },
    tags: [{ type: String }],
    quantity: Number,
    pricePerUnit: Number,
    discountPercentage: Number,
    totalAmount: Number,
    finalAmount: Number,
    paymentMethod: { type: String },
    orderStatus: String,
    deliveryType: String,
    storeId: String,
    storeLocation: String,
    salespersonId: String,
    employeeName: String,
  },
  { timestamps: false }
);

SaleSchema.index({ customerName: 1 });
SaleSchema.index({ phoneNumber: 1 });
SaleSchema.index({ customerRegion: 1 });
SaleSchema.index({ productCategory: 1 });
SaleSchema.index({ paymentMethod: 1 });
SaleSchema.index({ date: -1 });
SaleSchema.index({ tags: 1 });

export const Sale = mongoose.model('Sale', SaleSchema);

