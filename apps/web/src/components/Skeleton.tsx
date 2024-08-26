import React from 'react';

export default function SkeletonComponent({ className, width, height }) {
  return (
    <div className={`${className} animate-pulse`}>
      <div
        className="bg-gray-300"
        style={{ width: width || '100%', height: height || '100px' }}
      />
    </div>
  );
}
