"use client";

export function useImageUpload() {
  async function uploadImages() {
    return [];
  }

  return {
    uploadImages,
    isUploading: false,
    error: null,
  };
}
