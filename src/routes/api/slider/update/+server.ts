// import { verifyToken } from '$lib/server/jwt';
import { verifyToken } from '$lib/server/jwt';
import prisma from '$lib/server/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import type { RequestHandler } from '@sveltejs/kit';
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import path from 'path';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});




export const PUT: RequestHandler = async ({ request }) => {
    const token = request.headers.get('Authorization');
    if(token && verifyToken(token)){
    const data = await request.formData();
    let filePath = "";

    const id = Number(data.get('id') as string);
 
    const title = data.get('title') as string;
    const subTitle = data.get('subTitle') as string;
    const textButton = data.get('textButton') as string;
    const linkButton = data.get('linkButton') as string;
    const picture = data.get('picture') as File;
    let optimizedUrl:string = "";

    const existingSlide = await prisma.slideHome.findFirst({
      where:{id},
    });
 
      if(typeof picture == 'object'){
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
        deleteImage(existingSlide.picture);
        filePath = optimizedUrl;

      }


    const updateSlide = await prisma.slideHome.update({
      where:{id},
      data: { title, linkButton, picture:filePath, subTitle, textButton }
  
    });
   
    return new Response(JSON.stringify({ slide: updateSlide }), { status: 201 });
  
  }else{
    return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });
  
  }
  };


  async function deleteImage(imagePath: string) {
    try {
      // if (token && verifyToken(token)) {
        // Excluir do Cloudinary
        if (imagePath.startsWith('http')) {
          // Extrair o public_id do URL do Cloudinary
          const public_id = extractPublicIdFromUrl(imagePath);
  
          // Excluir do Cloudinary pelo public_id
          cloudinary.uploader.destroy(public_id, (error, result) => {
            if (error) {
              console.error('Error deleting image from Cloudinary:', error);
            } else {
              console.log('Image deleted from Cloudinary:', result);
            }
          });
        }
  

     // Encontrar o ID da imagem com base no namePath
     const picture = await prisma.pictures.findFirst({
      where: { namePath: imagePath },
    });

    if (picture) {
      // Excluir do banco de dados usando o ID
      await prisma.pictures.delete({
        where: { id: picture.id },
      });
    }
      // } else {
      //   console.log('Unauthorized access to delete image');
      // }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }
  
  // Função para extrair o public_id de um URL do Cloudinary
  function extractPublicIdFromUrl(imageUrl: string): string | null {
    const matches = imageUrl.match(/\/dl_imports\/([^/]+)/);
    return matches ? matches[1] : null;
  }