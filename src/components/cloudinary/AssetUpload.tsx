

import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';


export default function AssetUpload(){
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Upload Assets</CardTitle>
          <CardDescription>
            Upload images and videos to your Cloudinary account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center"
              >
                <Upload className="h-10 w-10 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  Drag and drop your files here, or click to browse
                </p>
                <Button>Select Files</Button>
              </motion.div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Upload Options</h3>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-tagging" className="flex gap-2 items-center">
                    Auto-tagging
                    <Badge variant="outline" className="ml-2">AI-Powered</Badge>
                  </Label>
                  <Switch id="auto-tagging" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-categorize">Auto-categorize</Label>
                  <Switch id="auto-categorize" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="face-detection">Face detection</Label>
                  <Switch id="face-detection" />
                </div>
                
                <div className="mt-2">
                  <Label htmlFor="upload-preset" className="mb-1 block">Upload preset</Label>
                  <Select defaultValue="default">
                    <SelectTrigger id="upload-preset">
                      <SelectValue placeholder="Select preset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="ml_default">ML Default</SelectItem>
                      <SelectItem value="custom">Custom Preset</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Upload Files</Button>
        </CardFooter>
      </Card>
    </>
  );
}