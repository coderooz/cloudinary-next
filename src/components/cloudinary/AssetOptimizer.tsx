
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AssetData } from '@/lib/cloudinary/cloudinary-types';

interface AssetOptimizerProps{
  optimizerImage: AssetData
}

export default function AssetOptimizer({optimizerImage}:AssetOptimizerProps ){
    return (
        <>
        <Card>
                  <CardHeader>
                    <CardTitle>Optimize Assets</CardTitle>
                    <CardDescription>
                      Optimize your images for web performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="font-medium text-blue-700 mb-2">Current Image</h3>
                          <div className="space-y-2">
                            <p className="text-sm flex justify-between">
                              <span>Size:</span> 
                              <span className="font-medium">1.2 MB</span>
                            </p>
                            <p className="text-sm flex justify-between">
                              <span>Format:</span> 
                              <span className="font-medium">PNG</span>
                            </p>
                            <p className="text-sm flex justify-between">
                              <span>Dimensions:</span> 
                              <span className="font-medium">1200 × 800 px</span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="quality" className="mb-1 block">Quality</Label>
                            <Slider
                              id="quality"
                              min={1}
                              max={100}
                              step={1}
                              defaultValue={[80]}
                            />
                            <p className="text-xs text-gray-500 mt-1">Lower quality = smaller file size</p>
                          </div>
                          
                          <div>
                            <Label htmlFor="format" className="mb-1 block">Format</Label>
                            <Select defaultValue="auto">
                              <SelectTrigger id="format">
                                <SelectValue placeholder="Select format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="auto">Auto (Recommended)</SelectItem>
                                <SelectItem value="webp">WebP</SelectItem>
                                <SelectItem value="avif">AVIF</SelectItem>
                                <SelectItem value="jpeg">JPEG</SelectItem>
                                <SelectItem value="png">PNG</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="pt-2">
                            <h3 className="font-medium mb-2">Advanced Options</h3>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="auto-format">Auto format detection</Label>
                                <Switch id="auto-format" defaultChecked />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Label htmlFor="responsive">Responsive sizing</Label>
                                <Switch id="responsive" defaultChecked />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Label htmlFor="lazy-loading">Lazy loading</Label>
                                <Switch id="lazy-loading" defaultChecked />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                          <Image 
                            src={optimizerImage.url}
                            alt="Preview"
                            width={300}
                            height={200}
                            className="rounded shadow"
                          />
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h3 className="font-medium text-green-700 mb-2">Optimized Preview</h3>
                          <div className="space-y-2">
                            <p className="text-sm flex justify-between">
                              <span>Estimated Size:</span> 
                              <span className="font-medium">320 KB</span>
                            </p>
                            <p className="text-sm flex justify-between">
                              <span>Savings:</span> 
                              <span className="font-medium text-green-600">73% reduction</span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-auto pt-6">
                          <Button className="w-full">Generate Optimized URL</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
        </>
    );
}