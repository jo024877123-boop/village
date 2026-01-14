'use client';

import { useState } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const compressImage = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1920;
                const MAX_HEIGHT = 1080;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Canvas to Blob failed'));
                    }
                }, 'image/jpeg', 0.8); // 0.8 Quality
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};

export function useImageUpload() {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const uploadImage = async (file, path) => {
        if (!file) return null;

        setUploading(true);
        setError(null);

        try {
            // Compress Image
            const compressedBlob = await compressImage(file);

            // Create a unique filename
            const timestamp = Date.now();
            const filename = `${timestamp}_${file.name.split('.')[0]}.jpg`;
            const storageRef = ref(storage, `${path}/${filename}`);

            const snapshot = await uploadBytes(storageRef, compressedBlob);
            const downloadURL = await getDownloadURL(snapshot.ref);

            setUploading(false);
            return downloadURL;
        } catch (err) {
            console.error("Upload failed:", err);
            setError(err.message);
            setUploading(false);
            return null;
        }
    };

    return { uploadImage, uploading, error };
}
