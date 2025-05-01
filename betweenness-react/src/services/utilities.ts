
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
async function sendFilesToBackend(files: Record<string, string>) {
    const formData = new FormData();
    Object.entries(files).forEach(([name, content]) => {
      formData.append(name, new Blob([content], { type: "text/plain" }), `${name}.txt`);
    });
  
    const response = await fetch("http://localhost:8080/upload-and-run", {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) throw new Error("Failed to upload or run backend simulation");
    return await response.text();
  }
export {randomString, convertToCSV, downloadCSV, sendFilesToBackend};
