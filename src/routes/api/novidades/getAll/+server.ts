// import { verifyToken } from '$lib/server/jwt';
import prisma from '$lib/server/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import type { RequestHandler } from '@sveltejs/kit';
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const GET: RequestHandler = async ({request}) => {
  
  const novidades = await prisma.novidades.findMany({
    include:{
      pictures:true,
      category:true,
      size:true,
      subCategory:true
    }
  });
  return new Response(JSON.stringify({ novidades }), { status: 200 });

};