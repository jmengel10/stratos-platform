import { Star, Download, Eye } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface TemplateCardProps {
  template: {
    id: string;
    title: string;
    description: string;
    category: string;
    rating: number;
    uses: number;
    author: string;
    featured?: boolean;
    previewColor: string;
  };
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {template.featured && (
          <div className="flex justify-between items-start">
            <Badge variant="planning">Featured</Badge>
          </div>
        )}
        
        <div 
          className="w-full h-32 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: template.previewColor }}
        >
          <div className="text-white font-bold text-lg">{template.title.charAt(0)}</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="default">{template.category}</Badge>
          </div>
          
          <h3 className="font-semibold text-navy font-serif">{template.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{template.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>{template.uses} uses</span>
            </div>
          </div>
          <span>by {template.author}</span>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="primary" size="sm" className="flex-1">
            Use Template
          </Button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Eye className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </Card>
  );
}
