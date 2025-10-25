import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import QRCode from 'qrcode';

/**
 * Gera QR Code como PNG e retorna como Blob
 */
export const generateQRCodePNG = (url: string, code?: string, size: number = 256): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Criar canvas temporário para o QR code
    const qrCanvas = document.createElement('canvas');
    qrCanvas.width = size;
    qrCanvas.height = size;

    // Gerar QR Code no canvas
    QRCode.toCanvas(qrCanvas, url, {
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

      // Criar canvas final com espaço para o código
      const finalCanvas = document.createElement('canvas');
      const textHeight = code ? 60 : 0; // Espaço para o texto do código
      finalCanvas.width = size;
      finalCanvas.height = size + textHeight;

      const ctx = finalCanvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Fundo branco
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

      // Desenhar QR code
      ctx.drawImage(qrCanvas, 0, 0);

      // Adicionar código abaixo do QR code
      if (code) {
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Texto "Código:"
        ctx.font = '16px sans-serif';
        ctx.fillText('Código:', size / 2, size + 20);
        
        // Código da pergunta
        ctx.font = 'bold 24px monospace';
        ctx.fillText(code, size / 2, size + 45);
      }

      finalCanvas.toBlob((blob) => {
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
export const downloadQRCode = async (url: string, filename: string, code?: string) => {
  try {
    const blob = await generateQRCodePNG(url, code, 512);
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
  items: Array<{ url: string; filename: string; code?: string }>
) => {
  try {
    const zip = new JSZip();
    const folder = zip.folder('qrcodes');

    if (!folder) {
      throw new Error('Failed to create zip folder');
    }

    // Gerar todos os QR Codes
    const promises = items.map(async (item) => {
      const blob = await generateQRCodePNG(item.url, item.code, 512);
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
