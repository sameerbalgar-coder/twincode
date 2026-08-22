'use client';

import React, { useRef } from 'react';
import { Camera, Upload, Check } from 'lucide-react';

interface AvatarUploadProps {
  avatarUrl: string;
  name: string;
  isEditable?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: string;
  onAvatarChange?: (newUrl: string) => void;
  className?: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  avatarUrl,
  name,
  isEditable = true,
  size = 'xl',
  status,
  onAvatarChange,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onAvatarChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    if (isEditable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Main Avatar Container */}
      <div 
        onClick={triggerUpload}
        className={`group relative rounded-full overflow-hidden ring-4 ring-white shadow-xl transition-all duration-300 ${sizeClasses[size]} ${
          isEditable ? 'cursor-pointer hover:ring-indigo-300 hover:shadow-indigo-500/20' : ''
        }`}
      >
        <img
          src={avatarUrl}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover-to-Upload Overlay */}
        {isEditable && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white text-center p-2">
            <Camera className="w-5 h-5 mb-1 animate-in zoom-in-50 duration-200" />
            <span className="text-[10px] font-bold tracking-tight leading-none uppercase">
              Change
            </span>
            <span className="text-[9px] text-slate-300">Photo</span>
          </div>
        )}

        {/* Hidden File Input */}
        {isEditable && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload profile picture"
          />
        )}
      </div>

      {/* Online / Active Status Badge */}
      {status && (
        <span 
          title={`Status: ${status}`}
          className={`absolute bottom-1 right-1 w-4 h-4 rounded-full ring-2 ring-white shadow-sm ${
            status === 'Active' ? 'bg-emerald-500' :
            status === 'Remote' ? 'bg-sky-500' :
            status === 'On Leave' ? 'bg-amber-500' : 'bg-purple-500'
          }`} 
        />
      )}
    </div>
  );
};

