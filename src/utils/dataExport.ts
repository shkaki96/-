/**
 * Data Export Utility for Taq Lab Physics Simulations
 * Supports CSV generation, JSON state backup, and formatted Printable Lab Reports (PDF printable format).
 */

export interface ExportDataPoint {
  time: number;
  [key: string]: number | string;
}

export interface ExperimentExportPayload {
  experimentId: string;
  experimentTitle: string;
  timestamp: string;
  parameters: Record<string, number>;
  metrics: Array<{ id: string; name: string; value: number | string; unit: string }>;
  history?: ExportDataPoint[];
  language?: string;
}

/**
 * Generates and downloads a UTF-8 compliant CSV file with BOM for Excel/Sheets support in Arabic/Kurdish.
 */
export function exportToCSV(payload: ExperimentExportPayload): void {
  const lines: string[] = [];

  // Header information
  lines.push(`Experiment,${payload.experimentTitle} (${payload.experimentId})`);
  lines.push(`Export Date,${payload.timestamp}`);
  lines.push('');

  // Initial Parameters section
  lines.push('--- PARAMETERS ---');
  lines.push('Parameter,Value');
  for (const [key, val] of Object.entries(payload.parameters)) {
    lines.push(`"${key}",${val}`);
  }
  lines.push('');

  // Live Metrics section
  lines.push('--- FINAL METRICS ---');
  lines.push('Metric,Value,Unit');
  for (const metric of payload.metrics) {
    lines.push(`"${metric.name}",${metric.value},"${metric.unit}"`);
  }
  lines.push('');

  // Historical time-series points if available
  if (payload.history && payload.history.length > 0) {
    lines.push('--- RECORDED TIME SERIES ---');
    const headers = Object.keys(payload.history[0]);
    lines.push(headers.join(','));
    for (const row of payload.history) {
      lines.push(headers.map((h) => row[h] ?? '').join(','));
    }
  }

  // Prepend UTF-8 BOM so Arabic/Kurdish text displays correctly in Excel/Calc
  const csvContent = '\uFEFF' + lines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `TaqLab_${payload.experimentId}_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Opens a clean, formatted Printable Lab Report in a new window suitable for saving to PDF via browser print.
 */
export function exportToPrintableReport(payload: ExperimentExportPayload): void {
  const isRTL = payload.language === 'ar' || payload.language === 'ku' || payload.language === 'bad';
  const dir = isRTL ? 'rtl' : 'ltr';

  const html = `
<!DOCTYPE html>
<html lang="${payload.language || 'en'}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <title>Taq Lab Report - ${payload.experimentTitle}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 30px;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.6;
    }
    .header {
      border-bottom: 2px solid #0284c7;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0;
      color: #0369a1;
      font-size: 24px;
    }
    .meta {
      font-size: 13px;
      color: #64748b;
      margin-top: 5px;
    }
    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #0f172a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 5px;
      margin-top: 25px;
      margin-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
      font-size: 14px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 12px;
      text-align: ${isRTL ? 'right' : 'left'};
    }
    th {
      background-color: #f1f5f9;
      font-weight: 600;
      color: #334155;
    }
    .footer {
      margin-top: 40px;
      padding-top: 15px;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #94a3b8;
      text-align: center;
    }
    @media print {
      body { margin: 15mm; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Taq Lab — Physics Simulation Lab Report</h1>
    <div class="meta">
      <strong>Experiment:</strong> ${payload.experimentTitle} | 
      <strong>Date:</strong> ${payload.timestamp} | 
      <strong>ID:</strong> ${payload.experimentId}
    </div>
  </div>

  <div class="section-title">1. Initial Parameters</div>
  <table>
    <thead>
      <tr>
        <th>Parameter</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      ${Object.entries(payload.parameters)
        .map(([k, v]) => `<tr><td>${k}</td><td><strong>${v}</strong></td></tr>`)
        .join('')}
    </tbody>
  </table>

  <div class="section-title">2. Live Measurement Metrics</div>
  <table>
    <thead>
      <tr>
        <th>Metric Name</th>
        <th>Final Measured Value</th>
        <th>Unit</th>
      </tr>
    </thead>
    <tbody>
      ${payload.metrics
        .map(
          (m) =>
            `<tr><td>${m.name}</td><td><strong>${m.value}</strong></td><td>${m.unit}</td></tr>`
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer">
    Generated automatically by Taq Lab Physics Interactive Simulations.
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `;

  const reportWindow = window.open('', '_blank');
  if (reportWindow) {
    reportWindow.document.write(html);
    reportWindow.document.close();
  }
}
