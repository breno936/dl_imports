import prisma from '$lib/server/prisma';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  let ids: number[] = [];
  let idCat: number | undefined;
  let orderPrice: string | undefined;
  let sizes: string[] = [];

  try {
    const body = await request.json();
    ids = body.arrId || [];  // Extrai o array de IDs de subcategoria, ou um array vazio se não fornecido
    idCat = body.idCategory ? Number(body.idCategory) : undefined;  // Extrai e converte o ID da categoria para número, se fornecido
    sizes = body.arrSizes || [];  // Extrai o array de IDs de subcategoria, ou um array vazio se não fornecido
    orderPrice = body.orderPrice;

    // Verifica se `ids` é um array de números válidos
    if (!Array.isArray(ids) || ids.some(id => typeof id !== 'number' || isNaN(id))) {
      return new Response('Invalid subcategory IDs', { status: 400 });
    }

    // Se idCat for fornecido, deve ser um número válido
    if (idCat !== undefined && (typeof idCat !== 'number' || isNaN(idCat))) {
      return new Response('Invalid category ID', { status: 400 });
    }

    if (!Array.isArray(sizes)) {
      return new Response('Invalid sizes', { status: 400 });
    }

  } catch (error) {
    console.error('Invalid JSON body:', error);
    return new Response('Invalid JSON body', { status: 400 });
  }

  try {
    console.log(sizes);
    console.log(ids);
    // Monta a cláusula `where` dinamicamente com base nas condições fornecidas
    const whereConditions: any = {};
    const oderByCondition:any = {};

    if (sizes.length > 0) {
      whereConditions.OR = ids.map(id => ({
        subCategoryId: id  // Adiciona uma condição `OR` para o campo `size`
      }));
    }

    if (idCat !== undefined) {
      whereConditions.categoryId = idCat;  // Adiciona a condição para categoryId se idCat estiver definido
    }
    

    if (sizes.length > 0) {
      whereConditions.OR = sizes.map(size => ({
        size: size  // Adiciona uma condição `OR` para o campo `size`
      }));
    }

    if(orderPrice !== undefined && orderPrice != ""){
      oderByCondition.price = orderPrice;
    }

    // Consulta os produtos filtrados com base nas condições
    const products = await prisma.product.findMany({
      include: {
        pictures: true,  // Inclui a relação com a tabela de `pictures`
        category: true  // Inclui a relação com a tabela de `category`
      },
      where: whereConditions,  // Passa as condições para a cláusula `where`
      orderBy:oderByCondition
    });

    // Retorna os produtos encontrados em formato JSON
    return new Response(JSON.stringify({ products }), { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response('Error fetching products', { status: 500 });
  }
};
