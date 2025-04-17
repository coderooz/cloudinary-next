

export interface AssetData {    
    asset_id: string,
    public_id: string,
    version: number,
    resource_type: string,
    id: string,
    type: string,
    url: string,
    secure_url: string,
    display_name: string,
    format: string,
    bytes: number,
    asset_folder: string,
    width: number,
    height: number,
    tags?: string[],
    created_at: string
    last_updated: {
        context_updated_at: string,
        updated_at: string
    }
}
