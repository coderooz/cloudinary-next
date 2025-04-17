// app/index.tsx
'use client'

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Upload, Edit, Layers, Filter, Tag } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AssetGallery from '@/components/cloudinary/AssetGallery';
import AssetUpload from '@/components/cloudinary/AssetUpload';
import Transformer from '@/components/cloudinary/Transformer';
import AssetOptimizer from '@/components/cloudinary/AssetOptimizer';
import NoImageMessage from '@/components/cloudinary/NoImageMessage';
import AssetManagement from '@/components/cloudinary/AssetManagement';

import { AssetData } from '@/lib/cloudinary/cloudinary-types';


export default function Home() {
  const [activeTab, setActiveTab] = useState('gallery');
  const [selectedImage, setSelectedImage] = useState<AssetData | null>(null);
  const [imagesData, setImageData] = useState<AssetData[] | []>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [maxResults, setMaxResults] = useState<number | string>('5');
  
  useEffect(() => {
    fetchData();
  }, [maxResults]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await fetch(`/api/private/assets/list?max_results=${maxResults}`);
      if (result.ok) {
        const data = await result.json();
        setImageData(data.resources || []); // Change to `data.assets` if your API uses that
      } else {
        console.error('Error fetching data:', result.statusText);
      }
    } catch (error) {
      console.error('Fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Cloudinary SDK Demo</title>
        <meta name="description" content="Demonstration of Cloudinary SDK with Next.js" />
      </Head>
      
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <Image 
              src="https://res.cloudinary.com/dgis8gvg4/image/upload/v1737123545/logo_erjx1r.png"
              alt="Cloudinary Demo"
              width={40}
              height={40}
              className="rounded"
            />
            <h1 className="text-xl font-bold text-blue-600">Cloudinary Demo</h1>
          </motion.div>
          
          <nav>
            <ul className="flex gap-6">
              <li><a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600">Documentation</a></li>
              <li><a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600">About</a></li>
              <li><a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="gallery" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 mb-8 gap-2">
                <TabsTrigger value="gallery" className="flex cursor-pointer items-center gap-2 hover:bg-gray-300">
                  <Tag size={18} />
                  <span>Gallery</span>
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex cursor-pointer items-center gap-2 hover:bg-gray-300">
                  <Upload size={18} />
                  <span>Upload</span>
                </TabsTrigger>
                <TabsTrigger value="transform" className="flex cursor-pointer items-center gap-2 hover:bg-gray-300">
                  <Edit size={18} />
                  <span>Transform</span>
                </TabsTrigger>
                <TabsTrigger value="optimize" className="flex cursor-pointer items-center gap-2 hover:bg-gray-300">
                  <Layers size={18} />
                  <span>Optimize</span>
                </TabsTrigger>
                <TabsTrigger value="manage" className="flex cursor-pointer items-center gap-2 hover:bg-gray-300">
                  <Filter size={18} />
                  <span>Manage</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="gallery" className="pt-2">
                <AssetGallery imageData={imagesData} isLoading={isLoading} selectImage={setSelectedImage} maxResults={maxResults} setMaxResult={setMaxResults}/>
              </TabsContent>

              <TabsContent value="upload" className="pt-2">
                <AssetUpload/>
              </TabsContent>
              
              {selectedImage && (activeTab === 'gallery' || activeTab === 'upload' || activeTab==='manage') ? (
                <>
                
              <TabsContent value="transform" className="pt-2">
                <Transformer transformImage={selectedImage}/>
              </TabsContent>
              
              <TabsContent value="optimize" className="pt-2">
                <AssetOptimizer optimizerImage={selectedImage}/>
              </TabsContent>

                </>
              ): ( <NoImageMessage />)}
              <TabsContent value="manage" className="pt-2">
                <AssetManagement imageData={imagesData}/>
              </TabsContent>              
            </Tabs>
          </div>
        </motion.div>
      </main>
      
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Cloudinary SDK Demo © {new Date().getFullYear()}
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-blue-600">Terms</a>
              <a href="#" className="text-sm text-gray-500 hover:text-blue-600">Privacy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-blue-600">Documentation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
