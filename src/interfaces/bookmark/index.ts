import { MangaInterface } from 'interfaces/manga';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface BookmarkInterface {
  id?: string;
  page_number: number;
  manga_id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  manga?: MangaInterface;
  user?: UserInterface;
  _count?: {};
}

export interface BookmarkGetQueryInterface extends GetQueryInterface {
  id?: string;
  manga_id?: string;
  user_id?: string;
}
