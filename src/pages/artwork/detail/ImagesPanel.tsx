import type { Artwork, Image } from '@art-vbst/art-types';
import { useState } from 'react';
import { AddImageModal } from './AddImageModal';
import { ImageDetailModal } from './ImageDetailModal';

type ImagesPanelProps = {
  artwork: Artwork;
  onUpdate: () => void;
};

export const ImagesPanel = ({ artwork, onUpdate }: ImagesPanelProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-gray-900 text-xl">Images</h2>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="rounded bg-gray-900 px-3 py-2 font-medium text-sm text-white hover:bg-gray-700"
        >
          Add Image
        </button>
      </div>

      {artwork.images.length === 0 ? (
        <div className="rounded border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-600 text-sm">No images yet</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {artwork.images.map((image) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="group cursor-pointer overflow-hidden rounded border border-gray-200 hover:border-gray-400"
            >
              <div className="aspect-square bg-gray-100">
                <img
                  src={image.image_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-2 text-gray-600 text-xs">
                {image.is_main_image && (
                  <span className="mr-2 rounded bg-gray-900 px-2 py-1 text-white">
                    Primary
                  </span>
                )}
                {new Date(image.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddImageModal
          artworkId={artwork.id}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            onUpdate();
          }}
        />
      )}

      {selectedImage && (
        <ImageDetailModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onUpdate={() => {
            setSelectedImage(null);
            onUpdate();
          }}
        />
      )}
    </div>
  );
};
