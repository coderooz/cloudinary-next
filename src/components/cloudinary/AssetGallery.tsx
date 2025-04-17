'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Upload, Edit, Filter, Crop, Download, Share } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AssetData } from '@/lib/cloudinary/cloudinary-types';

interface AssetGalleryProps {
  selectImage: (image: AssetData) => void;
  imageData : AssetData[];
  selectedImage?: AssetData;
  isLoading?:boolean;
  maxResults?: number | string; 
  setMaxResult: (maxResults: number|string ) => void;
}

export default function AssetGallery({ imageData, selectImage, selectedImage, isLoading, maxResults, setMaxResult }: AssetGalleryProps) {
  
  const setSelectedImage = (image: AssetData) => {
    selectImage(image);
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Gallery</CardTitle>
        <CardDescription>Browse and showcase your Cloudinary assets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter size={16} />
                <span>Filter</span>
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All media</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="raw">Raw files</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue={String(maxResults) || "5"} onValueChange={(val) => setMaxResult(Number(val))}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Max results" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Crop size={16} className="mr-1" />
                <span>Widget Mode</span>
              </Button>
              <Button size="sm">
                <Upload size={16} className="mr-1" />
                <span>Upload New</span>
              </Button>
            </div>
          </div>

          {isLoading ? (
            <p className="text-sm text-center text-muted-foreground">Loading assets...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {imageData.map((image) => (
                <motion.div
                  key={image.asset_id}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="bg-white border rounded-lg overflow-hidden"
                  onClick={() => setSelectedImage(image)}
                >
                  <div
                    className='aspect-video relative cursor-pointer bg-gray-100'
                    
                  >
                    <Image
                      src={image.url}
                      alt={image.public_id || 'Cloudinary asset'}
                      fill
                      loading="lazy"
                      style={{ objectFit: 'cover' }}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-sm truncate" title={image.display_name}>
                        {image.display_name || image.public_id}
                      </h3>
                      <Badge variant="outline" className="uppercase text-xs">
                        {image.format}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {image.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(image.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-8 cursor-pointer w-8">
                          <Share size={14} />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 cursor-pointer w-8">
                          <Edit size={14} />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 cursor-pointer w-8">
                          <Download size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
