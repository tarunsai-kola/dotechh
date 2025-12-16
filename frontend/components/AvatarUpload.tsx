import React, { useState } from 'react';
import { Camera, Loader2, Upload } from 'lucide-react';
import { uploadAvatar } from '../services';

interface AvatarUploadProps {
    currentAvatarUrl?: string;
    onUploadSuccess: (url: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentAvatarUrl, onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create local preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setUploading(true);

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const data = await uploadAvatar(formData);
            onUploadSuccess(data.avatarUrl);
        } catch (error) {
            console.error('Avatar upload failed:', error);
            alert('Failed to upload avatar. Please try again.');
            setPreview(currentAvatarUrl || null); // Revert on failure
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative group w-32 h-32 mx-auto">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                {preview ? (
                    <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                        <Camera size={40} />
                    </div>
                )}
            </div>

            <label className="absolute bottom-0 right-0 bg-brand-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-brand-700 transition-colors">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png"
                    onChange={handleFileChange}
                    disabled={uploading}
                />
            </label>
        </div>
    );
};

export default AvatarUpload;
