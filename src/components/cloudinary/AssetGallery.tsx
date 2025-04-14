'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, Download, Edit, Tag, Loader2, X, Filter, RefreshCcw, Search, Grid3x3,
  Grid2x2, Grid, FolderOpen, SlidersHorizontal, ChevronRight, Check, Copy
} from 'lucide-react';
import { toast } from 'sonner';

import { 
  listAssets, deleteAsset, bulkDeleteAssets, tagAssets, generateArchive 
} from '@/lib/cloudinary/cloudinary-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { formatFileSize, formatDate, extractFilename } from '@/lib/utils';

interface AssetGalleryProps {
  folder?: string;
  initialMaxResults?: number;
  onSelect?: (asset: any) => void;
  selectable?: boolean;
  transformable?: boolean;
}

type ViewMode = 'grid' | 'large' | 'list';
type SortOption = 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'size_asc' | 'size_desc';

export function AssetGallery({
  folder = '',
  initialMaxResults = 30,
  onSelect,
  selectable = false,
  transformable = true,
}: AssetGalleryProps) {
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedAssets, setSelectedAssets] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeFolder, setActiveFolder] = useState(folder);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTabs, setSelectedTabs] = useState('gallery');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  // Filter and sort assets
  const filteredAssets = assets.filter(asset => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      asset.public_id.toLowerCase().includes(query) || 
      (asset.tags && asset.tags.some((tag: string) => tag.toLowerCase().includes(query)))
    );
  });

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'name_asc':
        return extractFilename(a.public_id).localeCompare(extractFilename(b.public_id));
      case 'name_desc':
        return extractFilename(b.public_id).localeCompare(extractFilename(a.public_id));
      case 'size_asc':
        return a.bytes - b.bytes;
      case 'size_desc':
        return b.bytes - a.bytes;
      default:
        return 0;
    }
  });

  // Load assets on mount and when folder changes
  useEffect(() => {
    fetchAssets();
  }, [activeFolder]);

  const fetchAssets = async (cursor?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await listAssets({
        folder: activeFolder,
        maxResults: initialMaxResults,
        nextCursor: cursor || undefined,
      });
      
      if (cursor) {
        setAssets(prev => [...prev, ...response.resources]);
      } else {
        setAssets(response.resources);
      }
      
      setNextCursor(response.next_cursor);
      setHasMore(!!response.next_cursor);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Failed to load assets. Please try again.');
      toast.error('Failed to load assets');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (nextCursor && hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      fetchAssets(nextCursor);
    }
  };

  const RefreshCcwGallery = () => {
    setAssets([]);
    setNextCursor(null);
    setHasMore(true);
    fetchAssets();
  };

  const handleAssetSelect = (asset: any) => {
    if (onSelect) {
      onSelect(asset);
      return;
    }
    
    if (selectable) {
      const isSelected = selectedAssets.some(item => item.public_id === asset.public_id);
      
      if (isSelected) {
        setSelectedAssets(selectedAssets.filter(item => item.public_id !== asset.public_id));
      } else {
        setSelectedAssets([...selectedAssets, asset]);
      }
    } else {
      setSelectedAsset(asset);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedAssets.length === 0) return;
    
    try {
      if (selectedAssets.length === 1) {
        await deleteAsset(selectedAssets[0].public_id);
        toast.success('Asset deleted successfully');
      } else {
        await bulkDeleteAssets(selectedAssets.map(asset => asset.public_id));
        toast.success(`${selectedAssets.length} assets deleted successfully`);
      }
      
      setSelectedAssets([]);
      RefreshCcwGallery();
    } catch (err) {
      console.error('Error deleting assets:', err);
      toast.error('Failed to delete assets');
    }
  };

  const handleTagSelected = async (tags: string, command: 'add' | 'remove' = 'add') => {
    if (selectedAssets.length === 0) return;
    
    try {
      await tagAssets(
        selectedAssets.map(asset => asset.public_id),
        tags,
        command
      );
      
      toast.success(`Tags ${command === 'add' ? 'added' : 'removed'} successfully`);
      RefreshCcwGallery();
    } catch (err) {
      console.error('Error updating tags:', err);
      toast.error('Failed to update tags');
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedAssets.length === 0) return;
    
    try {
      const response = await generateArchive({
        publicIds: selectedAssets.map(asset => asset.public_id),
        resourceType: 'image',
        type: 'zip'
      });
      
      // Open download link in new tab
      if (response.url) {
        window.open(response.url, '_blank');
        toast.success('Download started');
      }
    } catch (err) {
      console.error('Error generating download:', err);
      toast.error('Failed to generate download');
    }
  };

  const handleFolderChange = (newFolder: string) => {
    setActiveFolder(newFolder);
    setSelectedAssets([]);
  };

  // UI rendering based on view mode
  const renderAssetGrid = () => {
    return (
      <div className={`grid gap-4 ${
        viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 
        viewMode === 'large' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 
        'grid-cols-1'
      }`}>
        {sortedAssets.map((asset) => {
          const isSelected = selectedAssets.some(item => item.public_id === asset.public_id);
          
          return (
            <motion.div
              key={asset.public_id}
              layoutId={`asset-${asset.public_id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`
                relative overflow-hidden border rounded-lg
                ${isSelected ? 'ring-2 ring-primary border-primary' : 'border-border'}
                ${viewMode === 'list' ? 'flex items-center p-2 gap-3' : ''}
                ${selectable || onSelect ? 'cursor-pointer' : ''}
                hover:bg-accent/20 transition-colors
              `}
              onClick={() => handleAssetSelect(asset)}
            >
              {/* Thumbnail */}
              <div 
                className={`
                  bg-secondary/30 relative
                  ${viewMode === 'list' ? 'w-16 h-16' : viewMode === 'large' ? 'aspect-square' : ''}
                  ${viewMode !== 'list' ? 'aspect-square' : ''}
                `}
              >
                <img
                  src={asset.secure_url}
                  alt={extractFilename(asset.public_id)}
                  className="w-full h-full object-cover"
                />
                
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
                      <Check size={16} />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Details */}
              <div className={`
                ${viewMode === 'list' ? 'flex-1' : 'p-3'}
              `}>
                <h3 className="text-sm font-medium truncate">
                  {extractFilename(asset.public_id)}
                </h3>
                
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                  <span>{formatFileSize(asset.bytes)}</span>
                  {viewMode !== 'grid' && (
                    <>
                      <span>•</span>
                      <span>{asset.width}×{asset.height}</span>
                      {viewMode === 'list' && (
                        <>
                          <span>•</span>
                          <span>{formatDate(asset.created_at)}</span>
                        </>
                      )}
                    </>
                  )}
                </div>
                
                {viewMode !== 'grid' && asset.tags && asset.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {asset.tags.map((tag: string) => (
                      <span 
                        key={tag} 
                        className="px-1.5 py-0.5 bg-secondary text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Quick actions (visible on hover) */}
              {viewMode !== 'grid' && (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download size={16} />
                  </Button>
                  {transformable && (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit size={16} />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  // Render asset details dialog
  const renderAssetDetails = () => {
    if (!selectedAsset) return null;
    
    return (
      <Dialog open={!!selectedAsset} onOpenChange={(open) => !open && setSelectedAsset(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
            <DialogDescription>
              Details for {extractFilename(selectedAsset.public_id)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="aspect-square relative rounded-lg overflow-hidden border">
              <img 
                src={selectedAsset.secure_url} 
                alt={extractFilename(selectedAsset.public_id)}
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p className="text-sm">{extractFilename(selectedAsset.public_id)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Public ID</h3>
                <p className="text-sm font-mono break-all">{selectedAsset.public_id}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Dimensions</h3>
                  <p className="text-sm">{selectedAsset.width} × {selectedAsset.height}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Size</h3>
                  <p className="text-sm">{formatFileSize(selectedAsset.bytes)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Format</h3>
                  <p className="text-sm">{selectedAsset.format}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                  <p className="text-sm">{formatDate(selectedAsset.created_at)}</p>
                </div>
              </div>
              
              {selectedAsset.tags && selectedAsset.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedAsset.tags.map((tag: string) => (
                      <span 
                        key={tag} 
                        className="px-2 py-0.5 bg-secondary text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">URL</h3>
                <div className="flex items-center mt-1">
                  <Input 
                    value={selectedAsset.secure_url} 
                    readOnly 
                    className="text-xs font-mono"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-2"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedAsset.secure_url);
                      toast.success('URL copied to clipboard');
                    }}
                  >
                    <Copy size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <div className="w-full flex justify-between items-center">
              <Button 
                variant="destructive" 
                onClick={async () => {
                  try {
                    await deleteAsset(selectedAsset.public_id);
                    toast.success('Asset deleted successfully');
                    setSelectedAsset(null);
                    RefreshCcwGallery();
                  } catch (err) {
                    console.error('Error deleting asset:', err);
                    toast.error('Failed to delete asset');
                  }
                }}
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
              
              <div className="flex items-center gap-2">
                {transformable && (
                  <Button variant="outline">
                    <Edit size={16} className="mr-2" />
                    Transform
                  </Button>
                )}
                
                <Button onClick={() => window.open(selectedAsset.secure_url, '_blank')}>
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={RefreshCcwGallery}
            disabled={isLoading}
          >
            <RefreshCcw size={16} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <div className="flex items-center gap-1">
            <Button 
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 size={16} />
            </Button>
            <Button 
              variant={viewMode === 'large' ? 'secondary' : 'ghost'} 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setViewMode('large')}
            >
              <Grid2x2 size={16} />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <Grid size={16} />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search 
              size={16} 
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <Input 
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full sm:w-auto"
            />
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            className="h-9 w-9"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={16} />
          </Button>
        </div>
      </div>
      
      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-lg p-4 bg-card"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Sort By</h3>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full sm:w-auto bg-background border rounded-md px-3 py-1 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name_asc">Name (A-Z)</option>
                  <option value="name_desc">Name (Z-A)</option>
                  <option value="size_asc">Size (Small-Large)</option>
                  <option value="size_desc">Size (Large-Small)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Folder</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8">
                    <FolderOpen size={14} className="mr-1" />
                    {activeFolder || 'Root'}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedAssets.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-secondary fixed bottom-4 left-1/2 transform -translate-x-1/2 rounded-lg shadow-lg p-3 flex items-center gap-3 z-10"
          >
            <span className="text-sm">
              {selectedAssets.length} {selectedAssets.length === 1 ? 'asset' : 'assets'} selected
            </span>
            
            <div className="h-4 w-px bg-border" />
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedAssets([])}
            >
              <X size={14} className="mr-1.5" />
              Clear
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                // Open tag dialog
              }}
            >
              <Tag size={14} className="mr-1.5" />
              Tag
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleDownloadSelected}
            >
              <Download size={14} className="mr-1.5" />
              Download
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={handleDeleteSelected}
            >
              <Trash2 size={14} className="mr-1.5" />
              Delete
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <div>
        {isLoading && assets.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={RefreshCcwGallery}
            >
              Try Again
            </Button>
          </div>
        ) : sortedAssets.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No assets found</p>
            {searchQuery && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <>
            {renderAssetGrid()}
            
            {hasMore && (
              <div className="mt-6 text-center">
                <Button 
                  variant="outline"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Loading
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Asset Details Dialog */}
      {renderAssetDetails()}
    </div>
  );
}