import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface Transaction {
  date: string;
  description: string;
  category: string;
  amount: number;
  type: string;
  currency: string;
}

export function exportToCSV(transactions: Transaction[], filename = 'transactions.csv') {
  const csvContent = [
    // Header
    ['Date', 'Description', 'Category', 'Type', 'Amount', 'Currency'].join(','),
    // Data rows
    ...transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      `"${t.description}"`, // Wrap in quotes to handle commas in description
      t.category,
      t.type,
      t.amount.toString(),
      t.currency,
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
}

export function exportToExcel(transactions: Transaction[], filename = 'transactions.xlsx') {
  const worksheet = XLSX.utils.json_to_sheet(
    transactions.map(t => ({
      Date: new Date(t.date).toLocaleDateString(),
      Description: t.description,
      Category: t.category,
      Type: t.type,
      Amount: t.amount,
      Currency: t.currency,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  
  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, filename);
}

export function exportToPDF(transactions: Transaction[], filename = 'transactions.pdf') {
  // This is a placeholder for PDF export functionality
  // You would typically use a library like jsPDF or pdfmake
  // For now, we'll just use CSV as a fallback
  exportToCSV(transactions, filename.replace('.pdf', '.csv'));
} 