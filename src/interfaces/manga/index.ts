import { BookmarkInterface } from 'interfaces/bookmark';
import { FavoriteInterface } from 'interfaces/favorite';
import { NoteInterface } from 'interfaces/note';
import { ScheduleInterface } from 'interfaces/schedule';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface MangaInterface {
  id?: string;
  title: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;
  bookmark?: BookmarkInterface[];
  favorite?: FavoriteInterface[];
  note?: NoteInterface[];
  schedule?: ScheduleInterface[];
  organization?: OrganizationInterface;
  _count?: {
    bookmark?: number;
    favorite?: number;
    note?: number;
    schedule?: number;
  };
}

export interface MangaGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  organization_id?: string;
}
