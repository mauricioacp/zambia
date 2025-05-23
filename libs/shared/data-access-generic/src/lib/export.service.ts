import { Injectable } from '@angular/core';

export type ExportFormat = 'csv' | 'excel';

export interface ExportColumn {
  key: string;
  label: string;
  transform?: (value: any) => string;
}

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  /**
   * Export data to CSV format
   */
  exportToCSV<T>(data: T[], columns: ExportColumn[], filename: string): void {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Create CSV header
    const headers = columns.map((col) => col.label).join(',');

    // Create CSV rows
    const rows = data.map((item) => {
      return columns
        .map((col) => {
          const value = this.getNestedValue(item, col.key);
          const transformedValue = col.transform ? col.transform(value) : value;
          return this.escapeCSVValue(transformedValue);
        })
        .join(',');
    });

    // Combine header and rows
    const csvContent = [headers, ...rows].join('\n');

    // Create and download file
    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  /**
   * Export data to Excel format (using CSV with .xlsx extension for simplicity)
   * For a full Excel implementation, you would need a library like xlsx or exceljs
   */
  exportToExcel<T>(data: T[], columns: ExportColumn[], filename: string): void {
    // For now, we'll create a CSV that Excel can open
    // In a production app, you'd want to use a proper Excel library
    this.exportToCSV(data, columns, filename);

    // Alternative: Use a library like xlsx
    // import * as XLSX from 'xlsx';
    // const worksheet = XLSX.utils.json_to_sheet(data);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    // XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  /**
   * Create export columns from table columns
   */
  createExportColumns(tableColumns: any[]): ExportColumn[] {
    return tableColumns
      .filter((col) => col.key !== 'actions') // Exclude action columns
      .map((col) => ({
        key: col.key,
        label: col.label,
        transform: this.getColumnTransform(col.type),
      }));
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private escapeCSVValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    const stringValue = String(value);

    // If the value contains comma, newline, or quotes, wrap it in quotes
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      // Escape existing quotes by doubling them
      const escapedValue = stringValue.replace(/"/g, '""');
      return `"${escapedValue}"`;
    }

    return stringValue;
  }

  private getColumnTransform(type: string): ((value: any) => string) | undefined {
    switch (type) {
      case 'status':
        return (value: any) => value?.toString().toUpperCase() || '';
      case 'date':
        return (value: any) => {
          if (value) {
            const date = new Date(value);
            return date.toLocaleDateString();
          }
          return '';
        };
      case 'datetime':
        return (value: any) => {
          if (value) {
            const date = new Date(value);
            return date.toLocaleString();
          }
          return '';
        };
      default:
        return undefined;
    }
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    window.URL.revokeObjectURL(url);
  }
}
