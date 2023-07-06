import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { mangaValidationSchema } from 'validationSchema/manga';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getManga();
    case 'POST':
      return createManga();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getManga() {
    const data = await prisma.manga
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'manga'));
    return res.status(200).json(data);
  }

  async function createManga() {
    await mangaValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.bookmark?.length > 0) {
      const create_bookmark = body.bookmark;
      body.bookmark = {
        create: create_bookmark,
      };
    } else {
      delete body.bookmark;
    }
    if (body?.favorite?.length > 0) {
      const create_favorite = body.favorite;
      body.favorite = {
        create: create_favorite,
      };
    } else {
      delete body.favorite;
    }
    if (body?.note?.length > 0) {
      const create_note = body.note;
      body.note = {
        create: create_note,
      };
    } else {
      delete body.note;
    }
    if (body?.schedule?.length > 0) {
      const create_schedule = body.schedule;
      body.schedule = {
        create: create_schedule,
      };
    } else {
      delete body.schedule;
    }
    const data = await prisma.manga.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
