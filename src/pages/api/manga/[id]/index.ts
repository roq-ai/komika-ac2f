import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { mangaValidationSchema } from 'validationSchema/manga';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.manga
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getMangaById();
    case 'PUT':
      return updateMangaById();
    case 'DELETE':
      return deleteMangaById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMangaById() {
    const data = await prisma.manga.findFirst(convertQueryToPrismaUtil(req.query, 'manga'));
    return res.status(200).json(data);
  }

  async function updateMangaById() {
    await mangaValidationSchema.validate(req.body);
    const data = await prisma.manga.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteMangaById() {
    const data = await prisma.manga.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
