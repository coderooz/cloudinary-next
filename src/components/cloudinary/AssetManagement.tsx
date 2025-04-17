
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


const dummyImages = [
{
    id: 'image1',
    url: 'https://res.cloudinary.com/dgis8gvg4/image/upload/v1737123545/logo_erjx1r.png',
    publicId: 'logo_erjx1r',
    format: 'png',
    width: 400,
    height: 300,
    tags: ['logo', 'brand'],
    uploaded: '2025-04-15T12:30:00Z'
},
{
    id: 'image2',
    url: 'https://res.cloudinary.com/dgis8gvg4/image/upload/v1737123545/logo_erjx1r.jpg',
    publicId: 'sample1_a4xezd',
    format: 'jpg',
    width: 800,
    height: 600,
    tags: ['sample', 'nature'],
    uploaded: '2025-04-14T10:15:00Z'
},
{
    id: 'image3',
    url: 'https://res.cloudinary.com/dgis8gvg4/image/upload/v1737123545/logo_erjx1r.jpg',
    publicId: 'sample2_dw6i9s',
    format: 'jpg',
    width: 1200,
    height: 800,
    tags: ['sample', 'architecture'],
    uploaded: '2025-04-13T16:45:00Z'
},
];

export default function AssetManagement(){

    const [searchImage, setSearchImage] = useState<string | null>('');

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
                    {dummyImages.map((image) => (
                    <motion.div 
                        key={image.id}
                        whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                        className="grid grid-cols-5 items-center p-3"
                    >
                        <div className="col-span-2 flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden">
                            <Image 
                            src={image.url}
                            alt={image.publicId}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="font-medium text-sm text-gray-900 truncate">{image.publicId}</p>
                            <p className="text-xs text-gray-500">
                            {image.width} × {image.height}
                            </p>
                        </div>
                        </div>
                        
                        <div>
                        <Badge variant="outline" className="uppercase">{image.format}</Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                        {image.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
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