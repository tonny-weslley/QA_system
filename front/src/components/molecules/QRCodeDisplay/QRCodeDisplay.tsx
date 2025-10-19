import { HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';

export interface QRCodeDisplayProps extends HTMLAttributes<HTMLDivElement> {
  qrCodeUrl: string;
  questionId: string;
  statement?: string;
}

export const QRCodeDisplay = ({
  qrCodeUrl,
  questionId,
  statement,
  className,
  ...props
}: QRCodeDisplayProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qrcode-${questionId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className={cn('max-w-sm', className)} {...props}>
      <CardHeader>
        <CardTitle className="text-lg">QR Code</CardTitle>
        {statement && <p className="text-sm text-gray-400 mt-2 line-clamp-2">{statement}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white p-4 rounded-lg">
          <img
            src={qrCodeUrl}
            alt={`QR Code para pergunta ${questionId}`}
            className="w-full h-auto"
          />
        </div>
        <button
          onClick={handleDownload}
          className="w-full px-4 py-2 bg-halloween-purple text-white rounded-md hover:bg-halloween-purple/90 transition-colors"
        >
          📥 Baixar QR Code
        </button>
      </CardContent>
    </Card>
  );
};
