
import { motion } from 'framer-motion';
import { LucideFileWarning} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


export default function NoImageMessage(){
    return (<>
    
        <Card>
            <CardHeader>
                <CardTitle>No Image</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                <div className="border-2 border-gray-300 rounded-lg p-12 text-center">
                    <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="flex flex-col items-center"
                    >
                        <LucideFileWarning className="h-10 w-10 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-600 mb-4">
                            You have not selected an image!
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                            Select a image....
                        </p>
                    </motion.div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </>);
}