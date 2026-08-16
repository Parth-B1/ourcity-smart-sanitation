import { useRef, useState } from "react";
import { Camera, ImagePlus, X } from "lucide-react";

interface ImageUploadProps {
  onImageChange?: (file: File | null) => void;
}

function ImageUpload({ onImageChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (file: File | undefined) => {
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    onImageChange?.(file);
  };

  const removeImage = () => {
    setPreview(null);
    onImageChange?.(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="image-upload">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(event) => handleFileChange(event.target.files?.[0])}
      />

      {preview ? (
        <div className="image-preview">
          <img src={preview} alt="Selected waste" />

          <button
            type="button"
            className="remove-image"
            onClick={removeImage}
            aria-label="Remove image"
          >
            <X size={18} />
          </button>

          <button
            type="button"
            className="change-image"
            onClick={() => inputRef.current?.click()}
          >
            <Camera size={16} />
            Change photo
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="upload-placeholder"
          onClick={() => inputRef.current?.click()}
        >
          <div className="upload-icon">
            <ImagePlus size={26} />
          </div>

          <strong>Upload a photo</strong>

          <span>
            Take a picture or choose one from your device
          </span>
        </button>
      )}
    </div>
  );
}

export default ImageUpload;