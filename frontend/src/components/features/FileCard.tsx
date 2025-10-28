import { FileText, Download, Share2, MoreHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface FileCardProps {
  file: {
    id: string;
    name: string;
    size: string;
    date: string;
    client: string;
    type: string;
  };
}

export function FileCard({ file }: FileCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div>
          <h3 className="font-medium text-navy text-sm truncate">{file.name}</h3>
          <p className="text-xs text-gray-500">{file.size} • {file.date}</p>
          <p className="text-xs text-gray-500">{file.client}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            <button className="p-1 hover:bg-gray-100 rounded">
              <Download className="w-4 h-4 text-gray-400" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Share2 className="w-4 h-4 text-gray-400" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
