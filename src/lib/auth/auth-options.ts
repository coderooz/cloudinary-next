// Cloudinary client utilities for frontend usage

type CloudinaryAction = 
  | 'upload'
  | 'delete'
  | 'bulkDelete'
  | 'list'
  | 'details'
  | 'rename'
  | 'transform'
  | 'tag'
  | 'generateArchive'
  | 'folders'
  | 'createFolder'
  | 'usage';

type CloudinaryTransformation = {
  width?: number;
  height?: number;
  crop?: string;
  effect?: string;
  radius?: string | number;
  quality?: string | number;
  gravity?: string;
  zoom?: string | number;
  [key: string]: any;
};

/**
 * Upload a file to Cloudinary
 */
export async function uploadAsset(file: File, folder?: string, tags?: string) {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) formData.append('folder', folder);
  if (tags) formData.append('tags', tags);
  
  const response = await fetch('/api/private/assets/upload', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }
  
  return response.json();
}

/**
 * Delete an asset from Cloudinary
 */
export async function deleteAsset(publicId: string) {
  const response = await fetch('/api/private/assets/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ publicId }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Delete failed');
  }
  
  return response.json();
}

/**
 * Delete multiple assets from Cloudinary
 */
export async function bulkDeleteAssets(publicIds: string[]) {
  const response = await fetch('/api/private/assets/bulkDelete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ publicIds }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Bulk delete failed');
  }
  
  return response.json();
}

/**
 * List assets from Cloudinary
 */
export async function listAssets(options: {
  folder?: string;
  maxResults?: number;
  nextCursor?: string;
  tags?: string;
}) {
  const { folder, maxResults = 30, nextCursor, tags } = options;
  
  const params = new URLSearchParams();
  if (folder) params.append('folder', folder);
  if (maxResults) params.append('max_results', maxResults.toString());
  if (nextCursor) params.append('next_cursor', nextCursor);
  if (tags) params.append('tags', tags);
  
  const response = await fetch(`/api/private/assets/list?${params.toString()}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'List failed');
  }
  
  return response.json();
}

/**
 * Get details of a specific asset
 */
export async function getAssetDetails(publicId: string) {
  const params = new URLSearchParams();
  params.append('public_id', publicId);
  
  const response = await fetch(`/api/private/assets/details?${params.toString()}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Get details failed');
  }
  
  return response.json();
}

/**
 * Rename an asset
 */
export async function renameAsset(publicId: string, newPublicId: string, overwrite: boolean = false) {
  const response = await fetch('/api/private/assets/rename', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ publicId, newPublicId, overwrite }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Rename failed');
  }
  
  return response.json();
}

/**
 * Apply transformations to an asset
 */
export async function transformAsset(publicId: string, transformations: CloudinaryTransformation) {
  const response = await fetch('/api/private/assets/transform', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ publicId, transformations }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Transform failed');
  }
  
  return response.json();
}

/**
 * Tag assets
 */
export async function tagAssets(publicIds: string[], tags: string, command: 'add' | 'remove' = 'add') {
  const response = await fetch('/api/private/assets/tag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ publicIds, tags, command }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Tag operation failed');
  }
  
  return response.json();
}

/**
 * Generate ZIP archive of assets
 */
export async function generateArchive(options: {
  publicIds?: string[];
  tags?: string[];
  resourceType?: 'image' | 'video' | 'raw';
  type?: 'zip' | 'pdf';
}) {
  const response = await fetch('/api/private/assets/generateArchive', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Generate archive failed');
  }
  
  return response.json();
}

/**
 * Get Cloudinary folders
 */
export async function getFolders(path?: string) {
  const params = new URLSearchParams();
  if (path) params.append('path', path);
  
  const response = await fetch(`/api/private/assets/folders?${params.toString()}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Get folders failed');
  }
  
  return response.json();
}

/**
 * Create a new Cloudinary folder
 */
export async function createFolder(path: string) {
  const response = await fetch('/api/private/assets/createFolder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Create folder failed');
  }
  
  return response.json();
}

/**
 * Get Cloudinary usage statistics
 */
export async function getUsage() {
  const response = await fetch('/api/private/assets/usage');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Get usage failed');
  }
  
  return response.json();
}

/**
 * Get optimized Cloudinary URL with transformations
 */
export function getOptimizedUrl(publicId: string, transformations: CloudinaryTransformation = {}) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    console.error('Cloudinary cloud name not configured');
    return '';
  }
  
  // Default transformations for better performance
  const defaultTransformations = {
    quality: 'auto',
    fetch_format: 'auto',
  };
  
  // Combine default with custom transformations
  const allTransformations = { ...defaultTransformations, ...transformations };
  
  // Build the transformation string
  const transformationStr = Object.entries(allTransformations)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationStr}/${publicId}`;
}