export type FavoritesList = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  shareUuid?: string;
  createdAt: Date;
  updatedAt: Date;
  properties: FavoritesListProperty[];
  _count: {
    properties: number;
  };
};

export type FavoritesListProperty = {
  id: string;
  favoritesListId: string;
  propertyId: string;
  note?: string;
  sortOrder?: number;
};

export type CreateFavoritesListRequest = {
  title: string;
  description?: string;
};

export type UpdateFavoritesListRequest = {
  title?: string;
  description?: string;
};

export type AddPropertyToListRequest = {
  propertyId: string;
  note?: string;
};
