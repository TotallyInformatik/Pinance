'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Tesseract from 'tesseract.js';

export default function PdfOcrComponent() {
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const { data } = await Tesseract.recognize(reader.result as string, 'eng', {
          logger: (m) => console.log(m),
        });
        setText(data.text);
      } catch (error) {
        console.error('OCR error:', error);
      }
      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <Input type="file" accept="application/pdf" onChange={handleFileUpload} />
      <Button disabled={loading}>{loading ? 'Processing...' : 'Upload & Extract'}</Button>
      <Card className="w-full max-w-2xl">
        <CardContent className="p-4">
          <pre className="whitespace-pre-wrap text-sm">{text || 'Extracted text will appear here...'}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
