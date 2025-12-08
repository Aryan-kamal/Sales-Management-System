import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '../data/truestate_assignment_dataset.csv');
const jsonPath = path.join(__dirname, '../data/sales.json');

console.log('Converting CSV to JSON...');
console.log('Reading from:', csvPath);

// Create write stream for JSON output
const writeStream = fs.createWriteStream(jsonPath, { encoding: 'utf8' });

// Read CSV file in chunks to handle large files
const readStream = fs.createReadStream(csvPath, { encoding: 'utf8', highWaterMark: 64 * 1024 }); // 64KB chunks
let buffer = '';
let headers = [];
let recordCount = 0;
let isFirstRecord = true;

// Start JSON array
writeStream.write('[');

readStream.on('data', (chunk) => {
  buffer += chunk;
  const lines = buffer.split('\n');
  buffer = lines.pop() || ''; // Keep incomplete line in buffer

  for (const line of lines) {
    if (line.trim() === '') continue;
    
    if (headers.length === 0) {
      // Parse headers
      headers = parseCSVLine(line);
      console.log('Headers:', headers);
    } else {
      // Parse data row
      const values = parseCSVLine(line);
      if (values.length === headers.length) {
        const record = {};
        headers.forEach((header, index) => {
          const key = header.trim();
          let value = values[index]?.trim() || '';
          
          // Convert numeric fields
          if (['Quantity', 'Price per Unit', 'Discount Percentage', 'Total Amount', 'Final Amount', 'Age'].includes(key)) {
            value = value === '' ? null : parseFloat(value);
          }
          
          record[key] = value;
        });
        
        // Write record to JSON file incrementally
        if (!isFirstRecord) {
          writeStream.write(',');
        }
        writeStream.write('\n  ' + JSON.stringify(record));
        isFirstRecord = false;
        recordCount++;
        
        if (recordCount % 10000 === 0) {
          console.log(`Processed ${recordCount} records...`);
        }
      }
    }
  }
});

readStream.on('end', () => {
  // Process last line if buffer has content
  if (buffer.trim() && headers.length > 0) {
    const values = parseCSVLine(buffer);
    if (values.length === headers.length) {
      const record = {};
      headers.forEach((header, index) => {
        const key = header.trim();
        let value = values[index]?.trim() || '';
        
        if (['Quantity', 'Price per Unit', 'Discount Percentage', 'Total Amount', 'Final Amount', 'Age'].includes(key)) {
          value = value === '' ? null : parseFloat(value);
        }
        
        record[key] = value;
      });
      
      // Write last record
      if (!isFirstRecord) {
        writeStream.write(',');
      }
      writeStream.write('\n  ' + JSON.stringify(record));
      recordCount++;
    }
  }
  
  // Close JSON array
  writeStream.write('\n]');
  writeStream.end();
  
  console.log(`Total records: ${recordCount}`);
  console.log('Conversion complete! JSON file saved to:', jsonPath);
});

writeStream.on('finish', () => {
  const stats = fs.statSync(jsonPath);
  console.log(`File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  process.exit(0);
});

readStream.on('error', (err) => {
  console.error('Error reading CSV:', err);
  writeStream.destroy();
  process.exit(1);
});

writeStream.on('error', (err) => {
  console.error('Error writing JSON:', err);
  readStream.destroy();
  process.exit(1);
});

// Simple CSV line parser that handles quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current); // Add last field
  return result;
}
