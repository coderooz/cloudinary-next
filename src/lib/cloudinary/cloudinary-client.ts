// @/lib/cloudinary/cloudinary-client
// Cloudinary client utilities for frontend usage

import cloudinary from "@/lib/cloudinary/cloudinary-init";

export async function uploadAsset(fileUrl: string, folder?: string, tags?: string) {
  return await cloudinary.uploader.upload(fileUrl, {
    folder,
    tags,
  });
}

export async function deleteAsset(publicId: string) {
  return await cloudinary.uploader.destroy(publicId);
}

export async function bulkDeleteAssets(publicIds: string[]) {
  return await cloudinary.api.delete_resources(publicIds);
}

export async function listAssets(options: {
  folder?: string;
  maxResults?: number;
  nextCursor?: string;
  tags?: string;
}) {
  return await cloudinary.api.resources({
    type: 'upload',
    prefix: options.folder || '',
    max_results: options.maxResults || 30,
    next_cursor: options.nextCursor,
  });
}

export async function getAssetDetails(publicId: string) {
  return await cloudinary.api.resource(publicId);
}

export async function renameAsset(publicId: string, newPublicId: string, overwrite: boolean = false) {
  return await cloudinary.uploader.rename(publicId, newPublicId, { overwrite });
}

export async function transformAsset(publicId: string, transformations: Record<string, any>) {
  const url = cloudinary.url(publicId, { transformation: [transformations] });
  return { transformedUrl: url };
}

export async function tagAssets(publicIds: string[], tags: string, command: 'add' | 'remove' = 'add') {
  if (command === 'add') {
    return await cloudinary.uploader.add_tag(tags, publicIds);
  } else {
    return await cloudinary.uploader.remove_tag(tags, publicIds);
  }
}

export async function generateArchive(options: {
  publicIds?: string[];
  tags?: string[];
  resourceType?: 'image' | 'video' | 'raw';
  type?: 'zip' | 'pdf';
}) {
  return await cloudinary.utils.download_zip_url({
    public_ids: options.publicIds,
    tags: options.tags,
    resource_type: options.resourceType || 'image',
    target_format: options.type || 'zip',
  });
}

export async function getFolders(path?: string) {
  return await cloudinary.api.sub_folders(path || '');
}

export async function createFolder(path: string) {
  return await cloudinary.api.create_folder(path);
}

export async function getUsage() {
  return await cloudinary.api.usage();
}

export function getOptimizedUrl(publicId: string, transformations: Record<string, any> = {}) {
  const defaultTransformations = {
    quality: 'auto',
    fetch_format: 'auto',
  };

  const allTransformations = { ...defaultTransformations, ...transformations };

  return cloudinary.url(publicId, { transformation: [allTransformations] });
}
