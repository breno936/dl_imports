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
  
    const size = data.get('size') as string;
    const categorySize = data.get('categorySize') as string;
    
    
    const newSize = await prisma.sizes.create({
      data: { size,categorySize }
  
    });
   
    return new Response(JSON.stringify({ size: newSize }), { status: 201 });
  
  }else{
    return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });
  
  }
  };