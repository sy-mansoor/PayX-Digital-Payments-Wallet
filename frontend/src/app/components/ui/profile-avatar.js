import React from 'react';

const ProfileAvatar = ({ imageUrl }) => {
  return (
    <img 
      src={imageUrl || './../../../../public/default-avatar.svg'} // Use .svg for the default image
      alt="Profile" 
      className="w-16 h-16 rounded-full object-cover" 
    />
  );
};

export default ProfileAvatar;