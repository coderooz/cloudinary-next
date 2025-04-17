// app/api/private/assets/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary/cloudinary-init';

export async function DELETE(request: NextRequest) {
  try {
    const { publicId, resourceType = 'image' } = await request.json();
    
    if (!publicId) {
      return NextResponse.json({ error: 'No public_id provided' }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType as any
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting Cloudinary resource:', error);
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 });
  }
}