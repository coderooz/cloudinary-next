// app/api/private/assets/transform/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary/cloudinary-init';

export async function POST(request: NextRequest) {
  try {
    const { publicId, transformations, resourceType = 'image' } = await request.json();
    
    if (!publicId || !transformations) {
      return NextResponse.json({ 
        error: 'Missing required parameters' 
      }, { status: 400 });
    }

    // Create a new transformed image using the explicit method
    const result = await cloudinary.uploader.explicit(publicId, {
      type: 'upload',
      resource_type: resourceType as any,
      eager: [transformations],
      eager_async: true,
      eager_notification_url: process.env.CLOUDINARY_NOTIFICATION_URL // Optional webhook URL
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error transforming Cloudinary resource:', error);
    return NextResponse.json({ error: 'Failed to transform resource' }, { status: 500 });
  }
}