// app/api/private/assets/folders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary/cloudinary-init';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path') || '';
    
    const result = await cloudinary.api.sub_folders(path);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error listing Cloudinary folders:', error);
    return NextResponse.json({ error: 'Failed to list folders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { folderPath } = await request.json();
    
    if (!folderPath) {
      return NextResponse.json({ error: 'No folder path provided' }, { status: 400 });
    }

    const result = await cloudinary.api.create_folder(folderPath);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating Cloudinary folder:', error);
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { folderPath } = await request.json();
    
    if (!folderPath) {
      return NextResponse.json({ error: 'No folder path provided' }, { status: 400 });
    }

    const result = await cloudinary.api.delete_folder(folderPath);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting Cloudinary folder:', error);
    return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
  }
}