// import { verifyToken } from '$lib/server/jwt';
import { verifyToken } from '$lib/server/jwt';
import prisma from '$lib/server/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import type { RequestHandler } from '@sveltejs/kit';
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


export const POST: RequestHandler = async ({ request }) => {
    const token = request.headers.get('Authorization');
    if(token && verifyToken(token)){
    const data = await request.formData();
  
    const title = data.get('title') as string;
    const picture = data.get('picture') as File;
    let optimizedUrl:string = "";
 
  
    if (!picture) {
      return new Response('No file uploaded', { status: 400 });
    }
    
      const buffer = Buffer.from(await picture.arrayBuffer());
      const result: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'dl_imports' },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
    
        // Send the buffer to Cloudinary
        uploadStream.end(buffer);
      
  
      });

      optimizedUrl = cloudinary.url(result.public_id, {
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'webp' }
        ]
      });
    const newBanner = await prisma.destBanner.create({
      data: { title, picture:optimizedUrl }
  
    });
   
    return new Response(JSON.stringify({ newBanner }), { status: 201 });
  
  }else{
    return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });
  
  }
  };