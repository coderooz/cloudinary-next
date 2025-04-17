// app/api/private/assets/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary/cloudinary-init';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Convert buffer to base64
    const base64File = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64File}`;

    // Optional parameters
    const folder = formData.get('folder') as string || 'nextjs-demo';
    const publicId = formData.get('publicId') as string;
    const tags = formData.get('tags') as string;
    
    const uploadOptions: any = {
      folder,
      resource_type: 'auto',
    };

    if (publicId) uploadOptions.public_id = publicId;
    if (tags) uploadOptions.tags = tags.split(',');

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(dataURI, uploadOptions, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}