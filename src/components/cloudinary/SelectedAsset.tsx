'use client';

interface SelectedAssetProps {
  asset: any;
  onRemove: () => void;
  onDelete: () => void;
}

export const SelectedAsset: React.FC<SelectedAssetProps> = ({
  asset,
  onRemove,
  onDelete,
}) => {
  return (
    <div className="border p-6 rounded-lg">
      <img src={asset.secure_url} alt={asset.public_id} className="w-full h-auto mb-4" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Public ID</p>
          <p className="text-sm font-mono break-all">{asset.public_id}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Format</p>
          <p className="text-sm">{asset.format}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Size</p>
          <p className="text-sm">{asset.bytes} bytes</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Dimensions</p>
          <p className="text-sm">{asset.width} × {asset.height}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <button onClick={onRemove} className="text-red-500">Remove</button>
        <button onClick={onDelete} className="text-red-500">Delete</button>
      </div>
    </div>
  );
};
