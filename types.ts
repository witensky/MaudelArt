
export enum ArtworkCategory {
  NATURE = 'Nature',
  SEASCAPE = 'Paysages marins',
  PORTRAIT = 'Portraits',
  STILL_LIFE = 'Natures mortes'
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage: string;
}

export interface Artwork {
  id: string;
  title: string;
  category: ArtworkCategory;
  authorId: string;
  collectionId: string;
  year: string;
  technique: string;
  image: string;
  description: string;
  dimensions: string;
}

export interface Exhibition {
  year: string;
  title: string;
  location: string;
}
