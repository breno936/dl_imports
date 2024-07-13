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

export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const token = request.headers.get('Authorization');
    if(token && verifyToken(token)){
    const { id } = await request.json();

    
    const existingDestaque = await prisma.destaques.findFirst({
      where:{id},
    });

    const pictures = await prisma.pictures.findMany({
      where:{productId:existingDestaque?.id}
    })

    pictures.forEach(element => {
      deleteImage(element.namePath);
    });

    
    await prisma.destaques.delete({
      where: { id }
    });

    return new Response(JSON.stringify({ message: 'Destaque deleted' }), { status: 200 });
  }else{
    return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });

  }
  } catch (error) {
    console.error('Error deleting destaque:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete destaque' }), { status: 500 });
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