// app/api/private/assets/tags/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary/cloudinary-init';

// Get all tags
export async function GET(request: NextRequest) {
  try {
    const result = await cloudinary.api.tags();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error listing Cloudinary tags:', error);
    return NextResponse.json({ error: 'Failed to list tags' }, { status: 500 });
  }
}

// Add tags to resources
export async function POST(request: NextRequest) {
  try {
    const { publicIds, tags, resourceType = 'image' } = await request.json();
    
    if (!publicIds || !tags || !publicIds.length || !tags.length) {
      return NextResponse.json({ 
        error: 'Missing required parameters' 
      }, { status: 400 });
    }

    const result = await cloudinary.uploader.add_tag(tags, publicIds, {
      resource_type: resourceType as any
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error adding Cloudinary tags:', error);
    return NextResponse.json({ error: 'Failed to add tags' }, { status: 500 });
  }
}

// Remove tags from resources
export async function DELETE(request: NextRequest) {
  try {
    const { publicIds, tags, resourceType = 'image' } = await request.json();
    
    if (!publicIds || !tags || !publicIds.length || !tags.length) {
      return NextResponse.json({ 
        error: 'Missing required parameters' 
      }, { status: 400 });
    }

    const result = await cloudinary.uploader.remove_tag(tags, publicIds, {
      resource_type: resourceType as any
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error removing Cloudinary tags:', error);
    return NextResponse.json({ error: 'Failed to remove tags' }, { status: 500 });
  }
}