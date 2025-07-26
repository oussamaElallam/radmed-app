import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export interface Report {
  id: number;
  patientId: string;
  modality: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  confidence: number;
  filename?: string;
}

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isSignedIn } = useUser();

  const generateReport = async (
    images: File | File[],
    patientInfo: {
      name?: string;
      age?: string;
      sex?: string;
      modality: string;
      clinicalHistory: string;
    },
    language: 'en' | 'fr' = 'en'
  ): Promise<Report> => {
    setLoading(true);
    setError(null);

    try {
      // Convert files to base64
      const files = Array.isArray(images) ? images : [images];
      const imageDataArray = [];
      
      for (const file of files) {
        const { base64, mime } = await fileToBase64(file);
        imageDataArray.push({ base64, mime, name: file.name });
      }

      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: imageDataArray,
          patientInfo,
          language
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate report');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Report generation failed');
      }

      // Refresh reports list
      await fetchReports();

      return result.report;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Generate report error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async (limit: number = 20, offset: number = 0) => {
    if (!isSignedIn) return;

    try {
      setError(null);
      const response = await fetch(`/api/reports/history?limit=${limit}&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const data = await response.json();
      
      if (data.success) {
        setReports(data.reports || []);
      } else {
        throw new Error(data.error || 'Failed to fetch reports');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch reports';
      setError(errorMessage);
      console.error('Fetch reports error:', error);
    }
  };

  const downloadReport = async (report: Report, format: 'txt' | 'docx' = 'docx') => {
    const filename = `radiology-report-${report.patientId}-${report.id}`;
    
    if (format === 'txt') {
      // Download as plain text
      const element = document.createElement('a');
      const file = new Blob([report.content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${filename}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      // Download as Word document
      try {
        const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');
        
        // Parse the report content to create structured Word document
        const lines = report.content.split('\n');
        const paragraphs: any[] = [];
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          
          if (!line) {
            // Add spacing for empty lines
            paragraphs.push(new Paragraph({ text: '' }));
            continue;
          }
          
          // Check if line is a header (all caps or contains specific keywords)
          const isHeader = line === line.toUpperCase() && line.length > 3 && 
                          (line.includes('RADIOLOGY REPORT') || 
                           line.includes('RAPPORT DE RADIOLOGIE') ||
                           line.includes('TECHNIQUE') ||
                           line.includes('FINDINGS') || 
                           line.includes('RÉSULTATS') ||
                           line.includes('IMPRESSION') ||
                           line.includes('RECOMMENDATIONS') ||
                           line.includes('RECOMMANDATIONS'));
          
          if (isHeader) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    bold: true,
                    size: 24,
                  }),
                ],
                spacing: { before: 200, after: 100 },
                alignment: line.includes('RADIOLOGY REPORT') || line.includes('RAPPORT DE RADIOLOGIE') 
                  ? AlignmentType.CENTER : AlignmentType.LEFT,
              })
            );
          } else if (line.startsWith('---')) {
            // Separator line
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: '________________________',
                    italics: true,
                  }),
                ],
                spacing: { before: 100, after: 100 },
                alignment: AlignmentType.CENTER,
              })
            );
          } else if (line.includes(':')) {
            // Field with value (like Patient Name: John Doe)
            const [label, ...valueParts] = line.split(':');
            const value = valueParts.join(':').trim();
            
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${label.trim()}: `,
                    bold: true,
                  }),
                  new TextRun({
                    text: value,
                  }),
                ],
                spacing: { after: 50 },
              })
            );
          } else {
            // Regular paragraph
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                  }),
                ],
                spacing: { after: 100 },
              })
            );
          }
        }
        
        const doc = new Document({
          sections: [
            {
              properties: {},
              children: paragraphs,
            },
          ],
        });
        
        const buffer = await Packer.toBuffer(doc);
        const blob = new Blob([buffer], { 
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        });
        
        const element = document.createElement('a');
        element.href = URL.createObjectURL(blob);
        element.download = `${filename}.docx`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
      } catch (error) {
        console.error('Error creating Word document:', error);
        // Fallback to text download
        downloadReport(report, 'txt');
      }
    }
  };

  const updateReport = async (reportId: string, updatedContent: string): Promise<void> => {
    try {
      const response = await fetch('/api/reports/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId: parseInt(reportId),
          content: updatedContent
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update report');
      }

      const data = await response.json();
      
      if (data.success) {
        // Update the local reports state
        setReports(prevReports => 
          prevReports.map(report => 
            report.id.toString() === reportId 
              ? { ...report, content: updatedContent, status: 'reviewed' as const }
              : report
          )
        );
      } else {
        throw new Error(data.error || 'Failed to update report');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update report';
      setError(errorMessage);
      console.error('Update report error:', error);
      throw error;
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    if (isSignedIn) {
      fetchReports();
    } else {
      setReports([]);
    }
  }, [isSignedIn]);

  return {
    reports,
    loading,
    error,
    generateReport,
    fetchReports,
    downloadReport,
    updateReport,
    clearError
  };
}

// Utility function to convert file to base64
// Convert file to base64 (handles DICOM by converting to PNG first)
export async function fileToBase64(file: File): Promise<{ base64: string; mime: string }> {
  // Handle DICOM files (.dcm)
  if (file.name.toLowerCase().endsWith('.dcm')) {
    try {
      console.log('Processing DICOM file:', file.name, 'Size:', file.size);
      
      // Dynamically import dcmjs. Depending on the bundler it may be a CJS default export or a full ESM module
      const dcmjsModule = await import('dcmjs');
      // Handle both `export default` and named-export bundles safely
      const dcmjs: any = (dcmjsModule as any).default ?? dcmjsModule;
      console.log('dcmjs loaded:', !!dcmjs.data);
      
      const { DicomMessage, DicomMetaDictionary } = dcmjs.data;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      
      // Check DICOM file signature
      if (buffer.length < 132 || 
          String.fromCharCode(...Array.from(buffer.slice(128, 132))) !== 'DICM') {
        throw new Error('Invalid DICOM file: Missing DICM signature at byte 128');
      }
      
      console.log('DICOM signature verified, parsing...');
      // Pass ArrayBuffer to DicomMessage.readFile, not Uint8Array
      const dicomData = DicomMessage.readFile(arrayBuffer);
      console.log('DICOM parsed, naturalizing dataset...');
      const dataset = DicomMetaDictionary.naturalizeDataset(dicomData.dict);
      console.log('Dataset naturalized:', Object.keys(dataset).slice(0, 10));
      console.log('Important DICOM tags:', {
        SOPClassUID: dataset.SOPClassUID,
        Modality: dataset.Modality,
        Rows: dataset.Rows,
        Columns: dataset.Columns,
        BitsAllocated: dataset.BitsAllocated,
        PhotometricInterpretation: dataset.PhotometricInterpretation
      });
      
      const rows = Number(dataset.Rows);
      const cols = Number(dataset.Columns);
      
      // Debug: Check what's in the raw DICOM dict
      console.log('Raw DICOM dict keys:', Object.keys(dicomData.dict).slice(0, 20));
      console.log('All DICOM dict keys:', Object.keys(dicomData.dict));
      console.log('Pixel Data element (x7fe00010):', dicomData.dict['x7fe00010']);
      
      // Search for pixel data in various possible locations
      let pixelDataElement = null;
      const pixelDataTags = ['x7fe00010', '7fe00010', 'x7FE00010', '7FE00010'];
      
      for (const tag of pixelDataTags) {
        if (dicomData.dict[tag]?.Value?.[0]) {
          pixelDataElement = dicomData.dict[tag].Value[0];
          console.log(`Found pixel data in tag: ${tag}`);
          break;
        }
      }
      
      // If still not found, check if pixel data is directly in the dict without Value wrapper
      if (!pixelDataElement) {
        for (const tag of pixelDataTags) {
          if (dicomData.dict[tag] && dicomData.dict[tag] instanceof ArrayBuffer) {
            pixelDataElement = dicomData.dict[tag];
            console.log(`Found direct pixel data in tag: ${tag}`);
            break;
          }
        }
      }
      
      if (!pixelDataElement) {
        const availableElements = Object.keys(dicomData.dict).filter(key => key.toLowerCase().includes('7fe'));
        console.log('Available 7fe elements:', availableElements);
        
        // Check if there are any large ArrayBuffer elements that might be pixel data
        const largeElements = Object.keys(dicomData.dict).filter(key => {
          const element = dicomData.dict[key];
          return element && (
            (element.Value?.[0] instanceof ArrayBuffer && element.Value[0].byteLength > 1000) ||
            (element instanceof ArrayBuffer && element.byteLength > 1000)
          );
        });
        console.log('Large elements that might be pixel data:', largeElements);
        
        throw new Error('No pixel data found in DICOM.');
      }

      // Normalise to Uint8Array
      let pixelBytes: Uint8Array;
      if (pixelDataElement instanceof Uint8Array) {
        pixelBytes = pixelDataElement;
      } else if (pixelDataElement instanceof ArrayBuffer) {
        pixelBytes = new Uint8Array(pixelDataElement);
      } else if (Array.isArray(pixelDataElement)) {
        pixelBytes = new Uint8Array(pixelDataElement);
      } else {
        throw new Error('Unsupported pixel data format in DICOM.');
      }

      // Handle 16-bit unsigned (common in CT/MR) and 8-bit
      const bitsAllocated = Number(dataset.BitsAllocated) || 8;
      const samplesPerPixel = Number(dataset.SamplesPerPixel) || 1;
      const photometric = dataset.PhotometricInterpretation || 'MONOCHROME2';
      let pixelArray: Uint8Array | Uint16Array;
      if (bitsAllocated === 16) {
        pixelArray = new Uint16Array(pixelBytes.buffer);
      } else {
        pixelArray = pixelBytes;
      }

      // Prepare canvas
      const canvas = document.createElement('canvas');
      canvas.width = cols;
      canvas.height = rows;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      const imageData = ctx.createImageData(cols, rows);

      // Normalize 16-bit to 8-bit for display
      let min = 65535, max = 0;
      if (bitsAllocated === 16) {
        for (let i = 0; i < pixelArray.length; i++) {
          if (pixelArray[i] < min) min = pixelArray[i];
          if (pixelArray[i] > max) max = pixelArray[i];
        }
      }

      for (let i = 0; i < rows * cols; i++) {
        let r = 0, g = 0, b = 0, a = 255;
        if (samplesPerPixel === 3) {
          // RGB color image
          r = pixelArray[i * 3];
          g = pixelArray[i * 3 + 1];
          b = pixelArray[i * 3 + 2];
        } else {
          // Grayscale (MONOCHROME1/2)
          let v = pixelArray[i];
          if (bitsAllocated === 16) {
            v = Math.round(255 * (v - min) / (max - min));
          }
          if (photometric === 'MONOCHROME1') v = 255 - v;
          r = g = b = v;
        }
        imageData.data[i * 4 + 0] = r;
        imageData.data[i * 4 + 1] = g;
        imageData.data[i * 4 + 2] = b;
        imageData.data[i * 4 + 3] = a;
      }
      ctx.putImageData(imageData, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      const b64 = dataUrl.split(',')[1];
      return { base64: b64, mime: 'image/png' };
    } catch (err) {
      console.error('DICOM parsing error details:', {
        error: err,
        message: (err as Error)?.message,
        stack: (err as Error)?.stack,
        fileName: file.name,
        fileSize: file.size
      });
      
      const errorMsg = (err as Error)?.message || 'Unknown error';
      if (errorMsg.includes('DICM signature')) {
        throw new Error('Invalid DICOM file format. Please ensure this is a valid DICOM file.');
      } else if (errorMsg.includes('No pixel data')) {
        throw new Error('DICOM file has no image data. Please try a different file.');
      } else {
        throw new Error(`DICOM processing failed: ${errorMsg}`);
      }
    }
  }

  // Fallback for standard images
  return await new Promise<{ base64: string; mime: string }>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
       const base64 = (reader.result as string).split(',')[1];
       resolve({ base64, mime: file.type || 'image/jpeg' });
    };
    reader.onerror = reject;
  });
}
