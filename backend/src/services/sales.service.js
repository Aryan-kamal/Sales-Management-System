import { Sale } from '../models/sale.model.js';

function buildQuery(params) {
  const query = {};

  if (params.search) {
    const regex = new RegExp(params.search, 'i');
    query.$or = [{ customerName: regex }, { phoneNumber: regex }];
  }

  if (params.region?.length) query.customerRegion = { $in: params.region };
  if (params.gender?.length) query.gender = { $in: params.gender };
  if (params.category?.length) query.productCategory = { $in: params.category };
  if (params.tags?.length) query.tags = { $in: params.tags };
  if (params.paymentMethod?.length) query.paymentMethod = { $in: params.paymentMethod };

  if (params.ageMin || params.ageMax) {
    query.age = {};
    if (params.ageMin) query.age.$gte = Number(params.ageMin);
    if (params.ageMax) query.age.$lte = Number(params.ageMax);
  }

  if (params.dateFrom || params.dateTo) {
    query.date = {};
    if (params.dateFrom) query.date.$gte = new Date(params.dateFrom);
    if (params.dateTo) {
      const to = new Date(params.dateTo);
      to.setHours(23, 59, 59, 999);
      query.date.$lte = to;
    }
  }

  return query;
}

function buildSort(sortBy, sortOrder) {
  const order = sortOrder === 'asc' ? 1 : -1;
  switch (sortBy) {
    case 'quantity':
      return { quantity: order };
    case 'customerName':
      return { customerName: order };
    case 'date':
    default:
      return { date: order };
  }
}

function normalizeItem(doc) {
  return {
    'Transaction ID': doc.transactionId,
    'Date': doc.date ? doc.date.toISOString().slice(0, 10) : '',
    'Customer ID': doc.customerId,
    'Customer Name': doc.customerName,
    'Phone Number': doc.phoneNumber,
    'Gender': doc.gender,
    'Age': doc.age,
    'Customer Region': doc.customerRegion,
    'Customer Type': doc.customerType,
    'Product ID': doc.productId,
    'Product Name': doc.productName,
    'Brand': doc.brand,
    'Product Category': doc.productCategory,
    'Tags': (doc.tags || []).join(','),
    'Quantity': doc.quantity,
    'Price per Unit': doc.pricePerUnit,
    'Discount Percentage': doc.discountPercentage,
    'Total Amount': doc.totalAmount,
    'Final Amount': doc.finalAmount,
    'Payment Method': doc.paymentMethod,
    'Order Status': doc.orderStatus,
    'Delivery Type': doc.deliveryType,
    'Store ID': doc.storeId,
    'Store Location': doc.storeLocation,
    'Salesperson ID': doc.salespersonId,
    'Employee Name': doc.employeeName,
  };
}

function emptyResult(params) {
  return {
    items: [],
    page: params.page || 1,
    pageSize: params.pageSize || 10,
    totalItems: 0,
    totalPages: 0,
    summary: {
      totalUnitsSold: 0,
      totalAmount: 0,
      totalDiscount: 0
    }
  };
}

export async function getSales(params = {}) {
  const page = Math.max(1, parseInt(params.page) || 1);
  const pageSize = Math.max(1, parseInt(params.pageSize) || 10);
  const query = buildQuery(params);
  const sort = buildSort(params.sortBy || 'date', params.sortOrder || 'desc');
  const skip = (page - 1) * pageSize;

  const [items, totalItems, summaryAgg] = await Promise.all([
    Sale.find(query).sort(sort).skip(skip).limit(pageSize).lean(),
    Sale.countDocuments(query),
    Sale.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalUnitsSold: { $sum: { $ifNull: ['$quantity', 0] } },
          totalAmount: { $sum: { $ifNull: ['$totalAmount', 0] } },
          totalDiscount: {
            $sum: {
              $subtract: [
                { $ifNull: ['$totalAmount', 0] },
                { $ifNull: ['$finalAmount', 0] }
              ]
            }
          }
        }
      }
    ])
  ]);

  const totalPages = Math.ceil(totalItems / pageSize) || 0;
  const summaryDoc = summaryAgg[0] || { totalUnitsSold: 0, totalAmount: 0, totalDiscount: 0 };

  return {
    items: items.map(normalizeItem),
    page,
    pageSize,
    totalItems,
    totalPages,
    summary: {
      totalUnitsSold: summaryDoc.totalUnitsSold,
      totalAmount: summaryDoc.totalAmount,
      totalDiscount: summaryDoc.totalDiscount
    }
  };
}

export async function getFilterOptions() {
  const [regions, genders, categories, tags, paymentMethods] = await Promise.all([
    Sale.distinct('customerRegion'),
    Sale.distinct('gender'),
    Sale.distinct('productCategory'),
    Sale.distinct('tags'),
    Sale.distinct('paymentMethod')
  ]);

  return {
    regions: (regions || []).filter(Boolean).sort(),
    genders: (genders || []).filter(Boolean).sort(),
    categories: (categories || []).filter(Boolean).sort(),
    tags: (tags || []).filter(Boolean).sort(),
    paymentMethods: (paymentMethods || []).filter(Boolean).sort()
  };
}

