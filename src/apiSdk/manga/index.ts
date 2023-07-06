import axios from 'axios';
import queryString from 'query-string';
import { MangaInterface, MangaGetQueryInterface } from 'interfaces/manga';
import { GetQueryInterface } from '../../interfaces';

export const getManga = async (query?: MangaGetQueryInterface) => {
  const response = await axios.get(`/api/manga${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createManga = async (manga: MangaInterface) => {
  const response = await axios.post('/api/manga', manga);
  return response.data;
};

export const updateMangaById = async (id: string, manga: MangaInterface) => {
  const response = await axios.put(`/api/manga/${id}`, manga);
  return response.data;
};

export const getMangaById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/manga/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMangaById = async (id: string) => {
  const response = await axios.delete(`/api/manga/${id}`);
  return response.data;
};
