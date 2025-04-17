"use client";

import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  onUploadComplete: (file: {
    url: string;
    size: number;
    name: string;
    type: string;
  }) => void;
}

const ImageUploader: React.FC<Props> = ({ onUploadComplete }) => {
  const { edgestore } = useEdgeStore();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await edgestore.publicFiles.upload({ file });
      onUploadComplete({
        url: res.url,
        size: file.size,
        name: file.name,
        type: file.type,
      });
    } catch (error) {
      console.error("Error uploading file", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Input type="file" accept="image/*" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload Image"}
      </Button>
    </div>
  );
};

export default ImageUploader;
