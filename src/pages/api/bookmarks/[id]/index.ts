import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { bookmarkValidationSchema } from 'validationSchema/bookmarks';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.bookmark
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getBookmarkById();
    case 'PUT':
      return updateBookmarkById();
    case 'DELETE':
      return deleteBookmarkById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBookmarkById() {
    const data = await prisma.bookmark.findFirst(convertQueryToPrismaUtil(req.query, 'bookmark'));
    return res.status(200).json(data);
  }

  async function updateBookmarkById() {
    await bookmarkValidationSchema.validate(req.body);
    const data = await prisma.bookmark.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteBookmarkById() {
    const data = await prisma.bookmark.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
