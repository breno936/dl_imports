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
  
    const name = data.get('name') as string;
    const price = new Decimal(data.get('price') as string);
    const description = data.get('description') as string;
    const tag = data.get('tag') as string;
    const size = data.get('size') as string;
    const categoryId = Number(data.get('categoryId') as string) > 0 ? Number(data.get('categoryId') as string) : null;
    const subCategoryId = Number(data.get('subCategoryId') as string) > 0 ? Number(data.get('subCategoryId') as string) : null;
    const picture: File[] = [];

    const picturesResult: any[] = [];
    const sizes: any[] = [];


    // Iterar sobre os itens do FormData
    data.forEach((value, key) => {
      if (key === 'picture' && value instanceof File) {
        picture.push(value);
      }
    });    
  
    data.forEach((value, key) => {
      console.log(data);
      if (key === 'size') {
        sizes.push(Number(value));
      }
    });


    if (!picture) {
      return new Response('No file uploaded', { status: 400 });
    }
    
    
    for (const element of picture) {
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
      console.log(result);
      const optimizedUrl = cloudinary.url(result.public_id, {
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'webp' }
        ]
      });

    picturesResult.push(optimizedUrl);
      console.log(picturesResult);
    }
    const newVendidos = await prisma.maisVendidos.create({
      data: {
        name,
        description,
        tag,
        price,
      size:{
       connect:sizes.map((s) => ({id:s}))
      },
       categoryId,
       subCategoryId,
        pictures: {
          create: picturesResult.map((url) => ({
            namePath: url,
          })),
        },
      },
      include: {
        pictures: true, 
        size:true,
        category:true,
        subCategory:true// Incluir as imagens associadas no retorno
      },
    });
   
    return new Response(JSON.stringify({ maisVendidos: newVendidos }), { status: 201 });
  
  }else{
    return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });
  
  }
  };