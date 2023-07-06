import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { favoriteValidationSchema } from 'validationSchema/favorites';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.favorite
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getFavoriteById();
    case 'PUT':
      return updateFavoriteById();
    case 'DELETE':
      return deleteFavoriteById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFavoriteById() {
    const data = await prisma.favorite.findFirst(convertQueryToPrismaUtil(req.query, 'favorite'));
    return res.status(200).json(data);
  }

  async function updateFavoriteById() {
    await favoriteValidationSchema.validate(req.body);
    const data = await prisma.favorite.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteFavoriteById() {
    const data = await prisma.favorite.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
