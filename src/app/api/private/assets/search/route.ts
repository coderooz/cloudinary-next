// app/api/private/assets/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary/cloudinary-init';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const resourceType = searchParams.get('resource_type') || 'image';
    const maxResults = parseInt(searchParams.get('max_results') || '30');
    const nextCursor = searchParams.get('next_cursor') || undefined;
    
    // Build expression for search
    let expression = `resource_type:${resourceType}`;
    if (query) {
      expression += ` AND (public_id:*${query}* OR tags:${query})`;
    }

    const result = await cloudinary.search
      .expression(expression)
      .max_results(maxResults)
      .next_cursor(nextCursor)
      .execute();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error searching Cloudinary resources:', error);
    return NextResponse.json({ error: 'Failed to search resources' }, { status: 500 });
  }
}