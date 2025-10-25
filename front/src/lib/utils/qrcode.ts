import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import QRCode from 'qrcode';

/**
 * Gera QR Code como PNG e retorna como Blob
 */
export const generateQRCodePNG = (url: string, size: number = 256): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Criar canvas temporário
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    // Gerar QR Code no canvas
    QRCode.toCanvas(canvas, url, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }, (error) => {
      if (error) {
        reject(error);
        return;
      }

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to generate blob'));
        }
      }, 'image/png');
    });
  });
};

/**
 * Baixa QR Code individual como PNG
 */
export const downloadQRCode = async (url: string, filename: string) => {
  try {
    const blob = await generateQRCodePNG(url, 512);
    saveAs(blob, `${filename}.png`);
  } catch (error) {
    console.error('Error downloading QR Code:', error);
    throw error;
  }
};

/**
 * Baixa múltiplos QR Codes como ZIP
 */
export const downloadQRCodesZip = async (
  items: Array<{ url: string; filename: string }>
) => {
  try {
    const zip = new JSZip();
    const folder = zip.folder('qrcodes');

    if (!folder) {
      throw new Error('Failed to create zip folder');
    }

    // Gerar todos os QR Codes
    const promises = items.map(async (item) => {
      const blob = await generateQRCodePNG(item.url, 512);
      folder.file(`${item.filename}.png`, blob);
    });

    await Promise.all(promises);

    // Gerar e baixar ZIP
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'qrcodes.zip');
  } catch (error) {
    console.error('Error downloading QR Codes ZIP:', error);
    throw error;
  }
};
