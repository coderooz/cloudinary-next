// app/api/private/assets/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary/cloudinary-init';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const folder = searchParams.get('folder') || '';
    const resourceType = searchParams.get('resource_type') || 'image';
    const maxResults = parseInt(searchParams.get('max_results') || '10');
    const nextCursor = searchParams.get('next_cursor') || undefined;
    
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: resourceType as any,
      prefix: folder,
      max_results: maxResults,
      next_cursor: nextCursor
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error listing Cloudinary resources:', error);
    return NextResponse.json({ error: 'Failed to list resources' }, { status: 500 });
  }
}