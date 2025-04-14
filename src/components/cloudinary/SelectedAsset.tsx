'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Copy, ExternalLink, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { deleteAsset } from '@/lib/cloudinary/cloudinary-client';
import { Button } from '@/components/ui/button';
import { formatFileSize, extractFilename } from '@/lib/utils';

interface SelectedAssetProps {
  asset: any;
  onRemove?: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
  showControls?: boolean;
}

export function SelectedAsset({
  asset,
  onRemove,
  onDelete,
  showDelete = true,
  showControls = true,
}: SelectedAssetProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!asset) return null;

  const handleDelete = async () => {
    if (!showDelete || !asset.public_id) return;
    
    try {
      setIsDeleting(true);
      await deleteAsset(asset.public_id);
      toast.success('Asset deleted successfully');
      
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error('Failed to delete asset');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyUrl = () => {
    if (asset.secure_url) {
      navigator.clipboard.writeText(asset.secure_url);
      toast.success('URL copied to clipboard');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative border rounded-lg overflow-hidden bg-card"
    >
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7 bg-black/40 hover:bg-black/60 text-white rounded-full z-10"
          onClick={onRemove}
        >
          <X size={14} />
        </Button>
      )}
      
      <div className="aspect-square">
        <img 
          src={asset.secure_url}
          alt={extractFilename(asset.public_id || '')}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-3">
        <h3 className="text-sm font-medium truncate">
          {extractFilename(asset.public_id || '')}
        </h3>
        
        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
          <span>{asset.width}×{asset.height}</span>
          <span>•</span>
          <span>{formatFileSize(asset.bytes || 0)}</span>
        </div>
        
        {showControls && (
          <div className="mt-3 flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={handleCopyUrl}
            >
              <Copy size={14} className="mr-1.5" />
              Copy URL
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => window.open(asset.secure_url, '_blank')}
            >
              <ExternalLink size={14} />
            </Button>
            
            {showDelete && (
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 text-destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="animate-spin">•</span>
                ) : (
                  <Trash2 size={14} />
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}