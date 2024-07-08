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

export const GET: RequestHandler = async ({url}) => {
  const id = Number(url.searchParams.get('id'));

  if (isNaN(id)) {
    return new Response('Invalid ID', { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id }, include:{
    pictures:true
  } });
  if (!product) {
    return new Response('Product not found', { status: 404 });
  }

  return new Response(JSON.stringify({ product }), { status: 200 });

};