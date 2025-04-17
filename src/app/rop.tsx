'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUploader } from '@/components/cloudinary/AssetUpload';
import { AssetGallery } from '@/components/cloudinary/AssetGallery';
import { SelectedAsset } from '@/components/cloudinary/SelectedAsset';

export default function CloudinaryPage() {
  const [activeTab, setActiveTab] = useState('gallery');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Cloudinary Media Manager</h1>
          <p className="text-muted-foreground mt-2">
            Upload, manage, and transform your media assets
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="transform" disabled={!selectedAsset}>Transform</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            {selectedAsset && (
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-4">Selected Asset</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                    <SelectedAsset 
                      asset={selectedAsset} 
                      onRemove={() => setSelectedAsset(null)}
                      onDelete={() => setSelectedAsset(null)}
                    />
                  </div>
                  
                  <div className="md:col-span-3">
                    <div className="p-4 border rounded-lg h-full">
                      <h3 className="font-medium mb-3">Asset Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Public ID</p>
                          <p className="text-sm font-mono break-all">{selectedAsset.public_id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Format</p>
                          <p className="text-sm">{selectedAsset.format}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Size</p>
                          <p className="text-sm">{selectedAsset.bytes} bytes</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Dimensions</p>
                          <p className="text-sm">{selectedAsset.width} × {selectedAsset.height}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Created</p>
                          <p className="text-sm">{new Date(selectedAsset.created_at).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">URL</p>
                          <p className="text-sm font-mono truncate">{selectedAsset.secure_url}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <TabsContent value="gallery" className="mt-0">
              <AssetGallery 
                folder=""
                initialMaxResults={30}
                onSelect={setSelectedAsset}
                selectable={false}
              />
            </TabsContent>
            
            <TabsContent value="upload" className="mt-0">
              <div className="border rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">Upload New Assets</h2>
                <ImageUploader 
                  folder="uploads"
                  onUploadComplete={(results) => {
                    if (results && results.length > 0) {
                      setSelectedAsset(results[0]);
                      setActiveTab('gallery');
                    }
                  }}
                  maxFileSizeMB={10}
                  allowMultiple={true}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="transform" className="mt-0">
              {selectedAsset ? (
                <div className="border rounded-lg p-6">
                  <h2 className="text-lg font-medium mb-4">Transform Asset</h2>
                  <p className="text-muted-foreground">
                    This feature will be implemented in the next sprint.
                  </p>
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">Select an asset to transform</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}