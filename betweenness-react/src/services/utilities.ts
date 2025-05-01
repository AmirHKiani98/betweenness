
function randomString(length: number): string {
    return Array.from({ length }, () => Math.random().toString(36)[2]).join('');
}


function convertToCSV(data: object[]): string {
    if (!data.length) return '';
  
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(field => JSON.stringify((row as any)[field] ?? '')).join(','));
    return [headers.join(','), ...rows].join('\n');
  }
function downloadCSV(csv: string, filename: string): void {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
  
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
export {randomString, convertToCSV, downloadCSV};
