// import { verifyToken } from '$lib/server/jwt';
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
    // const token = request.headers.get('Authorization');
    // if(token && verifyToken(token)){
    const data = await request.formData();

    const id = Number(data.get('id') as string);
    const name = data.get('name') as string;
    const price = new Decimal(data.get('price') as string);
    const description = data.get('description') as string;
    const tag = data.get('tag') as string;
    const size = data.get('size') as string;
    const categoryId = Number(data.get('category') as string);
    const newPicture: File[] = [];
    const removePicture: string[] = [];

    const picturesResult: any[] = [];

    const existingVendidos = await prisma.maisVendidos.findFirst({
      where:{id},
    });


    // Iterar sobre os itens do FormData
    data.forEach((value, key) => {
      if (key === 'newPicture' && value instanceof File) {
        newPicture.push(value);
      }
    });    

    data.forEach((value, key) => {
      if (key === 'removePicture') {
        removePicture.push(value.toString());
      }
    });   

    if (newPicture) {
    
    newPicture.forEach(async element => {
      if(typeof element == 'object'){
        const buffer = Buffer.from(await element.arrayBuffer());
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
        picturesResult.push(result.secure_url);

      }
    });
 

    }
 
    if(removePicture){
      removePicture.forEach(element => {
        deleteImage(element);
      });
    }
    
    const updatedVendidos = await prisma.maisVendidos.update({
      where:{id},
      data: { name, description, tag, price, categoryId, size }
  
    });

    picturesResult.forEach(async element => {
      let pictures = await prisma.pictures.create({
        data:{maisVendidosId:updatedVendidos.id, namePath:element.secure_url}
      })
    });
   
    return new Response(JSON.stringify({ maisVendidos: updatedVendidos }), { status: 201 });
  
//   }else{
//     return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });
  
//   }
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