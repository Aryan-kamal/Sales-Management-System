import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js';
import { Sale } from '../models/sale.model.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvPath = path.join(__dirname, '../data/truestate_assignment_dataset.csv');

const PERCENTAGE = 0.8;
const BATCH_SIZE = 5000;

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function mapRow(headers, values) {
  const record = {};
  headers.forEach((header, index) => {
    record[header.trim()] = values[index]?.trim() ?? '';
  });

  const num = (key) => {
    const val = record[key];
    return val === '' ? null : Number(val);
  };

  const dateVal = record['Date'] ? new Date(record['Date']) : null;

  return {
    transactionId: record['Transaction ID'] || '',
    date: dateVal,
    customerId: record['Customer ID'] || '',
    customerName: record['Customer Name'] || '',
    phoneNumber: record['Phone Number'] || '',
    gender: record['Gender'] || '',
    age: num('Age'),
    customerRegion: record['Customer Region'] || '',
    customerType: record['Customer Type'] || '',
    productId: record['Product ID'] || '',
    productName: record['Product Name'] || '',
    brand: record['Brand'] || '',
    productCategory: record['Product Category'] || '',
    tags: (record['Tags'] || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    quantity: num('Quantity'),
    pricePerUnit: num('Price per Unit'),
    discountPercentage: num('Discount Percentage'),
    totalAmount: num('Total Amount'),
    finalAmount: num('Final Amount'),
    paymentMethod: record['Payment Method'] || '',
    orderStatus: record['Order Status'] || '',
    deliveryType: record['Delivery Type'] || '',
    storeId: record['Store ID'] || '',
    storeLocation: record['Store Location'] || '',
    salespersonId: record['Salesperson ID'] || '',
    employeeName: record['Employee Name'] || '',
  };
}

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    console.log('Streaming CSV data and seeding...');
    await Sale.deleteMany({});

    let headers = [];
    let buffer = '';
    let lineCount = 0;
    let inserted = 0;
    let target = null; // set once total lines known
    let batch = [];

    const stream = fs.createReadStream(csvPath, { encoding: 'utf8' });

    const flushBatch = async () => {
      if (!batch.length) return;
      await Sale.insertMany(batch, { ordered: false });
      inserted += batch.length;
      batch = [];
      if (inserted % 20000 === 0) {
        console.log(`Inserted ${inserted} records...`);
      }
    };

    await new Promise((resolve, reject) => {
      stream.on('data', async (chunk) => {
        stream.pause();
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          if (lineCount === 0) {
            headers = parseCSVLine(line);
          } else {
            if (target !== null && inserted + batch.length >= target) {
              // already reached target, skip remaining
              stream.destroy();
              break;
            }
            const values = parseCSVLine(line);
            if (values.length === headers.length) {
              batch.push(mapRow(headers, values));
              if (batch.length >= BATCH_SIZE) {
                try {
                  await flushBatch();
                } catch (err) {
                  reject(err);
                  return;
                }
              }
            }
          }
          lineCount++;
        }
        stream.resume();
      });

      stream.on('end', async () => {
        if (buffer.trim()) {
          const values = parseCSVLine(buffer);
          if (values.length === headers.length && (target === null || inserted + batch.length < target)) {
            batch.push(mapRow(headers, values));
          }
        }
        // If we never computed target, approximate using lineCount (including header)
        if (target === null) {
          const totalRows = lineCount; // header included? lineCount started at 0; header increments; data lines count
          const totalDataRows = totalRows > 0 ? totalRows - 1 : 0;
          target = Math.floor(totalDataRows * PERCENTAGE);
          console.log(`Computed target rows: ${target} (${PERCENTAGE * 100}% of ${totalDataRows})`);
        }
        // Trim batch if it exceeds target
        if (target !== null && inserted + batch.length > target) {
          batch = batch.slice(0, target - inserted);
        }
        try {
          await flushBatch();
          resolve();
        } catch (err) {
          reject(err);
        }
      });

      stream.on('error', (err) => reject(err));
    });

    console.log(`Seeding completed. Inserted ${inserted} records.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();

