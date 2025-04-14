import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Cloudinary action handler functions
const handlers = {
  // Upload image to Cloudinary
  async upload(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';
    const tags = formData.get('tags') as string || '';
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer for Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Create a base64 string from the buffer
    const base64String = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;
    
    const uploadOptions: any = {
      folder,
      resource_type: 'auto',
    };
    
    if (tags) {
      uploadOptions.tags = tags.split(',').map(tag => tag.trim());
    }
    
    try {
      const result = await cloudinary.uploader.upload(dataURI, uploadOptions);
      return NextResponse.json(result);
    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }
  },
  
  // Delete image from Cloudinary
  async delete(req: NextRequest) {
    const { publicId } = await req.json();
    
    if (!publicId) {
      return NextResponse.json({ error: 'No public ID provided' }, { status: 400 });
    }
    
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return NextResponse.json(result);
    } catch (error: any) {
      console.error('Cloudinary delete error:', error);
      return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
    }
  },
  
  // Bulk delete images from Cloudinary
  async bulkDelete(req: NextRequest) {
    const { publicIds } = await req.json();
    
    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      return NextResponse.json({ error: 'No public IDs provided' }, { status: 400 });
    }
    
    try {
      const results = await Promise.all(
        publicIds.map(publicId => cloudinary.uploader.destroy(publicId))
      );
      return NextResponse.json({ results });
    } catch (error: any) {
      console.error('Cloudinary bulk delete error:', error);
      return NextResponse.json({ error: error.message || 'Bulk delete failed' }, { status: 500 });
    }
  },
  
  // List images from Cloudinary
  async list(req: NextRequest) {
    const url = new URL(req.url);
    const folder = url.searchParams.get('folder') || '';
    const maxResults = parseInt(url.searchParams.get('max_results') || '30');
    const nextCursor = url.searchParams.get('next_cursor') || undefined;
    const tags = url.searchParams.get('tags') || undefined;
    
    try {
      const options: any = {
        type: 'upload',
        max_results: maxResults,
        resource_type: 'image'
      };
      
      if (folder) options.prefix = folder;
      if (nextCursor) options.next_cursor = nextCursor;
      if (tags) options.tags = tags;
      
      const result = await cloudinary.api.resources(options);
      return NextResponse.json(result);
    } catch (error: any) {
      console.error('Cloudinary list error:', error);
      return NextResponse.json({ error: error.message || 'List failed' }, { status: 500 });
    }
  },
  
  // Get details of a specific image
  async details(req: NextRequest) {
    const url = new URL(req.url);
    const publicId = url.searchParams.get('public_id');
    
    if (!publicId) {
      return NextResponse.json({ error: 'No public ID provided' }, { status: 400 });
    }
    
    try {
      const result = await cloudinary.api.resource(publicId);
      return NextResponse.json(result);
    } catch (error: any) {
      console.error('Cloudinary details error:', error);
      return NextResponse.json({ error: error.message || 'Get details failed' }, { status: 500 });
    }
  },
  
  // Rename an image
  async rename(req: NextRequest) {
    const { publicId, newPublicId, overwrite = false } = await req.json();
    
    if (!publicId || !newPublicId) {
      return NextResponse.json({ 
        error: 'Both current and new public IDs required' 
      }, { status: 400 });
    }
    
    try {
      const result = await cloudinary.uploader.rename(publicId, newPublicId, {
        overwrite
      });
      return NextResponse.json(result);
    } catch (error: any) {
      console.error('Cloudinary rename error:', error);
      return NextResponse.json({ error: error.message || 'Rename failed' }, { status: 500 });
    }
  },
  
  // Apply transformations to an image
  async transform(req: NextRequest) {
    const { publicId, transformations } = await req.json();
    
    if (!publicId || !transformations) {
      return NextResponse.json({ 
        error: 'Public ID and transformations required' 
      }, { status: 400 });
    }
    
    try {
      const result = await cloudinary.uploader.explicit(publicId, {
        type: 'upload',
        eager: [transformations]
      });
      return NextResponse.json(result);
    } catch (error: any) {
      console.error('Cloudinary transform error:', error);
      return NextResponse.json({ error: error.message || 'Transform failed' }, { status: 500 });
    }
  },
  
  // Tag images
  async tag(req: NextRequest) {
    const { publicIds, tags, command = 'add' } = await req.json();
    
    if (!publicIds || !tags) {
      return NextResponse.json({ 
        error: 'Public IDs and tags required' 
      }, { status: 400 });
    }
    
    try {
      const result = await cloudinary.uploader.add_tag(tags, publicIds, {
        command
      });
      return NextResponse.json(result);
    } catch (error: any) {
      console.error('Cloudinary tag error:', error);
      return NextResponse.json({ error: error.message || 'Tag operation failed' }, { status: 500 });
    }
  },
  
  // Generate ZIP archive of images
  async generateArchive(req: NextRequest) {
    const { publicIds, tags, resourceType = 'image', type = 'zip' } = await req.json();
    
    if ((!publicIds && !tags) || (publicIds && tags)) {
      return NextResponse.json({ 
        error: 'Provide either publicIds or tags, not both or neither' 
      }, { status: 400 });
    }
    
    try {
      const options: any = {
        resource_type: resourceType,
        target_format: type
      };
      
      if (publicIds) options.public_ids = publicIds;
      if (tags) options.tags = tags;
      
      const result = await cloudinary.utils.download_zip_url(options);
      return NextResponse.json({ downloadUrl: result });
    } catch (error: any) {
      console.error('Cloudinary archive error:', error);
      return NextResponse.json({ error: error.message || 'Generate archive failed' }, { status: 500 });
    }
  },
  
  // Get list of folders
  async folders(req: NextRequest) {
    const url = new URL(req.url);
    const path = url.searchParams.get('path') || '';
    
    try {
      const result = await cloudinary.api.root_folders();
      
      if (path) {
        const subFolders = await cloudinary.api.sub_folders(path);
        return NextResponse.json(subFolders);
      }
      
      return NextResponse.json(result);
    } catch (error: any) {
      console.error('Cloudinary folders error:', error);
      return NextResponse.json({ error: error.message || 'Get folders failed' }, { status: 500 });
    }
  },
  
  // Create a new folder
  async createFolder(req: NextRequest) {
    const { path } = await req.json();
    
    if (!path) {
      return NextResponse.json({ error: 'No folder path provided' }, { status: 400 });
    }
    
    try {
      const result = await cloudinary.api.create_folder(path);
      return NextResponse.json(result);
    } catch (error: any) {
      console.error('Cloudinary create folder error:', error);
      return NextResponse.json({ error: error.message || 'Create folder failed' }, { status: 500 });
    }
  },
  
  // Get usage statistics
  async usage(req: NextRequest) {
    try {
      const result = await cloudinary.api.usage();
      return NextResponse.json(result);
    } catch (error: any) {
      console.error('Cloudinary usage error:', error);
      return NextResponse.json({ error: error.message || 'Get usage failed' }, { status: 500 });
    }
  }
};

// Handler for GET requests
export async function GET(
  req: NextRequest,
  { params }: { params: { actionName: string } }
) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { actionName } = params;
  
  // Only allow GET actions: list, details, folders, usage
  if (['list', 'details', 'folders', 'usage'].includes(actionName) && handlers[actionName as keyof typeof handlers]) {
    return handlers[actionName as keyof typeof handlers](req);
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

// Handler for POST requests
export async function POST(
  req: NextRequest,
  { params }: { params: { actionName: string } }
) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { actionName } = params;
  
  if (handlers[actionName as keyof typeof handlers]) {
    return handlers[actionName as keyof typeof handlers](req);
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}