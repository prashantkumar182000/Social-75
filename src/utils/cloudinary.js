// src/utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: 'dw8ursrnr', 
    api_key: '976551127782426', 
    api_secret: 'gHSsX9DnIGFz5j7EV1UlvndAY5c',
    secure: true
});

export default cloudinary;