
'use client';

import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Edit, Trash2, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AssetData } from '@/lib/cloudinary/cloudinary-types';

interface AssetManagementProps{
    imageData: AssetData[]
}


export default function AssetManagement({imageData}: AssetManagementProps){

    const [searchImage, setSearchImage] = useState<string>('');

    return (
        <>
        <Card>
            <CardHeader>
            <CardTitle>Asset Management - {searchImage}</CardTitle>
            <CardDescription>
                Manage your Cloudinary assets with powerful tools
            </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                <Input type="text" value={searchImage} onChange={(text)=>setSearchImage(text)}  placeholder="Search assets..." className="max-w-md" />
                <Select defaultValue="date-desc">
                    <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="date-desc">Date (newest)</SelectItem>
                    <SelectItem value="date-asc">Date (oldest)</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="size-desc">Size (largest)</SelectItem>
                    <SelectItem value="size-asc">Size (smallest)</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                
                <div className="bg-white border rounded-lg overflow-hidden">
                <div className="grid grid-cols-5 text-xs font-medium text-gray-500 bg-gray-50 p-3">
                    <div className="col-span-2">Asset</div>
                    <div>Format</div>
                    <div>Tags</div>
                    <div>Actions</div>
                </div>
                
                <div className="divide-y">
                    {imageData.map((image) => (
                    <motion.div 
                        key={image.id}
                        whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                        className="grid grid-cols-5 items-center p-3"
                    >
                        <div className="col-span-2 flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden">
                            <Image 
                            src={image.url}
                            alt={image.public_id}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="font-medium text-sm text-gray-900 truncate">{image.public_id}</p>
                            <p className="text-xs text-gray-500">
                            {image.width} × {image.height}
                            </p>
                        </div>
                        </div>
                        
                        <div>
                        <Badge variant="outline" className="uppercase">{image.format}</Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                        {/* {image.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))} */}
                        </div>
                        
                        <div className="flex gap-2">
                        <Button size="icon" variant="ghost">
                            <Edit size={16} />
                        </Button>
                        <Button size="icon" variant="ghost">
                            <Download size={16} />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600">
                            <Trash2 size={16} />
                        </Button>
                        </div>
                    </motion.div>
                    ))}
                </div>
                </div>
                
                <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Showing 3 of 26 assets</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                </div>
                </div>
            </div>
            </CardContent>
        </Card>
        </>
    );
}