import axios from 'axios';
import queryString from 'query-string';
import { BookmarkInterface, BookmarkGetQueryInterface } from 'interfaces/bookmark';
import { GetQueryInterface } from '../../interfaces';

export const getBookmarks = async (query?: BookmarkGetQueryInterface) => {
  const response = await axios.get(`/api/bookmarks${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createBookmark = async (bookmark: BookmarkInterface) => {
  const response = await axios.post('/api/bookmarks', bookmark);
  return response.data;
};

export const updateBookmarkById = async (id: string, bookmark: BookmarkInterface) => {
  const response = await axios.put(`/api/bookmarks/${id}`, bookmark);
  return response.data;
};

export const getBookmarkById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/bookmarks/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBookmarkById = async (id: string) => {
  const response = await axios.delete(`/api/bookmarks/${id}`);
  return response.data;
};
