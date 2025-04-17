'use client'

import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssetData } from '@/lib/cloudinary/cloudinary-types';

interface TransformerProps {
    transformImage: AssetData
}

export default function Transformer({transformImage}: TransformerProps) {

    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);

    return (
        <>
        <Card>
            <CardHeader>
            <CardTitle>Transform Images</CardTitle>
            <CardDescription>
                Apply transformations to your images in real-time
            </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="flex justify-center items-center bg-gray-100 rounded-lg p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Image 
                    src={transformImage.url}
                    alt="Selected image"
                    width={400}
                    height={300}
                    className="max-w-full h-auto rounded shadow"
                    style={{
                        filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
                    }}
                    />
                </motion.div>
                </div>
                
                <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="brightness">Brightness: {brightness}%</Label>
                    </div>
                    <Slider
                    id="brightness"
                    min={0}
                    max={200}
                    step={1}
                    value={[brightness]}
                    onValueChange={(values) => setBrightness(values[0])}
                    />
                </div>
                
                <div>
                    <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="contrast">Contrast: {contrast}%</Label>
                    </div>
                    <Slider
                    id="contrast"
                    min={0}
                    max={200}
                    step={1}
                    value={[contrast]}
                    onValueChange={(values) => setContrast(values[0])}
                    />
                </div>
                
                <div>
                    <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="saturation">Saturation: {saturation}%</Label>
                    </div>
                    <Slider
                    id="saturation"
                    min={0}
                    max={200}
                    step={1}
                    value={[saturation]}
                    onValueChange={(values) => setSaturation(values[0])}
                    />
                </div>
                
                <div className="mt-2">
                    <Label htmlFor="crop-mode" className="mb-1 block">Crop Mode</Label>
                    <Select defaultValue="fill">
                    <SelectTrigger id="crop-mode">
                        <SelectValue placeholder="Select crop mode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="fill">Fill</SelectItem>
                        <SelectItem value="fit">Fit</SelectItem>
                        <SelectItem value="crop">Crop</SelectItem>
                        <SelectItem value="scale">Scale</SelectItem>
                        <SelectItem value="thumb">Thumb</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                
                <div className="flex gap-3 mt-6">
                    <Button variant="outline" className="flex-1">Reset</Button>
                    <Button className="flex-1">Apply</Button>
                </div>
                </div>
            </div>
            </CardContent>
        </Card>
        </>
    );
}