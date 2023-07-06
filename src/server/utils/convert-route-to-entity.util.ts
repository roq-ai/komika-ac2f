const mapping: Record<string, string> = {
  bookmarks: 'bookmark',
  favorites: 'favorite',
  manga: 'manga',
  notes: 'note',
  organizations: 'organization',
  schedules: 'schedule',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
