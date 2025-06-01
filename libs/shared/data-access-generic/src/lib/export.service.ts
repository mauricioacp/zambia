import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

export type ExportFormat = 'csv' | 'excel';

export interface ExportColumn {
  key: string;
  label: string;
  transform?: (value: unknown) => string;
}

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  exportToCSV<T>(data: T[], columns: ExportColumn[], filename: string): void {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    const headers = columns.map((col) => col.label).join(',');

    const rows = data.map((item) => {
      return columns
        .map((col) => {
          const value = this.getNestedValue(item, col.key);
          const transformedValue = col.transform ? col.transform(value) : value;
          return this.escapeCSVValue(transformedValue);
        })
        .join(',');
    });

    const csvContent = [headers, ...rows].join('\n');

    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  exportToExcel<T>(data: T[], columns: ExportColumn[], filename: string): void {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    const transformedData = data.map((item) => {
      const row: Record<string, unknown> = {};
      columns.forEach((col) => {
        const value = this.getNestedValue(item, col.key);
        const transformedValue = col.transform ? col.transform(value) : value;
        row[col.label] = transformedValue !== null && transformedValue !== undefined ? transformedValue : '';
      });
      return row;
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(transformedData);

    // Apply styles to the worksheet
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:A1');

    // Style header row with gradient effect
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[address]) continue;

      // Apply header styling with gradient
      ws[address].s = {
        font: {
          bold: true,
          color: { rgb: 'FFFFFF' },
          sz: 14,
          name: 'Segoe UI',
        },
        fill: {
          fgColor: { rgb: '1E40AF' }, // Blue-800 for richer look
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
        },
        border: {
          top: { style: 'medium', color: { rgb: '1E3A8A' } },
          bottom: { style: 'medium', color: { rgb: '1E3A8A' } },
          left: { style: 'thin', color: { rgb: '1E3A8A' } },
          right: { style: 'thin', color: { rgb: '1E3A8A' } },
        },
      };
    }

    // Style data rows with improved alternating colors
    for (let R = 1; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[address]) continue;

        // Apply alternating row colors with subtle gradients
        const isEvenRow = R % 2 === 0;
        ws[address].s = {
          font: {
            sz: 11,
            name: 'Segoe UI',
            color: { rgb: '374151' }, // Gray-700 for better readability
          },
          fill: {
            fgColor: { rgb: isEvenRow ? 'F8FAFC' : 'FFFFFF' }, // Slate-50 / White alternating
          },
          alignment: {
            vertical: 'center',
            wrapText: true,
            indent: 1,
          },
          border: {
            top: { style: 'thin', color: { rgb: 'E2E8F0' } },
            bottom: { style: 'thin', color: { rgb: 'E2E8F0' } },
            left: { style: 'thin', color: { rgb: 'E2E8F0' } },
            right: { style: 'thin', color: { rgb: 'E2E8F0' } },
          },
        };

        // Special styling for status columns
        const cellValue = String(ws[address].v || '').toLowerCase();
        if (cellValue === 'active' || cellValue === 'activo') {
          ws[address].s.fill = { fgColor: { rgb: 'D1FAE5' } }; // Green-100
          ws[address].s.font.color = { rgb: '065F46' }; // Green-800
          ws[address].s.font.bold = true;
        } else if (cellValue === 'inactive' || cellValue === 'inactivo') {
          ws[address].s.fill = { fgColor: { rgb: 'FEE2E2' } }; // Red-100
          ws[address].s.font.color = { rgb: '991B1B' }; // Red-800
          ws[address].s.font.bold = true;
        }
      }
    }

    // Enhanced auto-sizing with better column width calculation
    const maxWidth = 60;
    const minWidth = 12;
    const wscols = columns.map((col) => {
      let maxLength = col.label.length;
      transformedData.forEach((row) => {
        const value = String(row[col.label] || '');
        if (value.length > maxLength) {
          maxLength = value.length;
        }
      });
      // Calculate optimal width with padding
      const calculatedWidth = Math.max(minWidth, Math.min(maxLength + 6, maxWidth));
      return { wch: calculatedWidth };
    });
    ws['!cols'] = wscols;

    // Set enhanced row heights
    const rows = [{ hpt: 35 }]; // Taller header row
    for (let i = 1; i <= range.e.r; i++) {
      rows.push({ hpt: 25 }); // Standard row height
    }
    ws['!rows'] = rows;

    // Add freeze panes for header row
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };

    // Add the worksheet to workbook with a more descriptive name
    const sheetName = 'Datos Exportados';
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Enhanced metadata
    wb.Props = {
      Title: filename,
      Subject: 'Datos exportados desde Sistema Zambia',
      Author: 'Sistema Zambia - Akademia',
      CreatedDate: new Date(),
      ModifiedDate: new Date(),
      Application: 'Sistema Zambia',
      Company: 'Akademia',
    };

    // Write the file with enhanced options
    XLSX.writeFile(wb, `${filename}.xlsx`, {
      bookType: 'xlsx',
      type: 'binary',
      cellDates: true,
      compression: true,
      Props: wb.Props,
    });
  }

  createExportColumns(tableColumns: Array<{ key: string; label: string; type?: string }>): ExportColumn[] {
    return tableColumns
      .filter((col) => col.key !== 'actions')
      .map((col) => ({
        key: col.key,
        label: col.label,
        transform: this.getColumnTransform(col.type),
      }));
  }

  private getNestedValue(obj: unknown, path: string): unknown {
    return path.split('.').reduce((current, key) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  }

  private escapeCSVValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    const stringValue = String(value);

    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      const escapedValue = stringValue.replace(/"/g, '""');
      return `"${escapedValue}"`;
    }

    return stringValue;
  }

  private getColumnTransform(type?: string): ((value: unknown) => string) | undefined {
    switch (type) {
      case 'status':
        return (value: unknown) => {
          if (!value) return '';
          const status = value.toString().toLowerCase();
          // Return capitalized status for better readability
          return status.charAt(0).toUpperCase() + status.slice(1);
        };
      case 'date':
        return (value: unknown) => {
          if (value) {
            const date = new Date(value as string | number | Date);
            return date.toLocaleDateString('es-ES', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            });
          }
          return '';
        };
      case 'datetime':
        return (value: unknown) => {
          if (value) {
            const date = new Date(value as string | number | Date);
            return date.toLocaleString('es-ES', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            });
          }
          return '';
        };
      case 'avatar':
      case 'text':
        return (value: unknown) => {
          if (!value) return '';
          return String(value).trim();
        };
      case 'badge':
        return (value: unknown) => {
          if (!value) return '';
          return String(value).toUpperCase();
        };
      default:
        return undefined;
    }
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const BOM = '\uFEFF';
    const contentWithBOM = BOM + content;

    const blob = new Blob([contentWithBOM], { type: `${mimeType};charset=utf-8;` });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
