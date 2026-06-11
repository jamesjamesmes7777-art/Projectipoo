import QRCode from 'qrcode';
import { toPng } from 'html-to-image';

export async function generateQRDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 200,
    margin: 1,
    color: { dark: '#000000', light: '#ffffff' },
  });
}

export async function exportCertificatePDF(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const { jsPDF } = await import('jspdf');

  const imgData = await toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
    width: 793,
    height: 1122,
    style: {
      transform: 'none',
      transformOrigin: 'top left',
    },
  });

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = pdf.internal.pageSize.getHeight();
  pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
  pdf.save(filename);
}
