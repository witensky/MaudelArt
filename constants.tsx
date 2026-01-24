
import { Artwork, ArtworkCategory, Exhibition, Author, Collection } from './types';

export const COLORS = {
  emerald: '#064e3b',
  gold: '#d4af37',
  ivory: '#fcfcf9',
  beige: '#f5f5f0',
};

export const AUTHORS: Author[] = [
  {
    id: 'mme',
    name: 'Marie Maude Eliacin',
    bio: 'Artiste peintre passionnée, explorant la lumière et les émotions à travers l\'huile et le fusain.',
    avatar: 'https://cdn.80.lv/api/upload/content/c6/images/67dd0c485282c/widen_920x0.jpg'
  },
  {
    id: 'guest1',
    name: 'Lucien Valescot',
    bio: 'Maître du réalisme expressif, collaborateur invité pour la collection "Terres de feu".',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
  }
];

export const COLLECTIONS: Collection[] = [
  {
    id: 'lumiere',
    name: 'Lumière d\'Haïti',
    description: 'Une série dédiée aux contrastes vibrants des Caraïbes.',
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'echos',
    name: 'Échos de l\'Âme',
    description: 'Portraits et regards explorant l\'intimité de l\'être.',
    coverImage: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1200'
  }
];

export const ARTWORKS: Artwork[] = [
  {
    id: '1',
    title: 'Sérénité Tropicale',
    category: ArtworkCategory.NATURE,
    authorId: 'mme',
    collectionId: 'lumiere',
    year: '2023',
    technique: 'Huile sur toile',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200',
    description: "Une exploration de la lumière filtrant à travers le feuillage dense.",
    dimensions: '80 x 100 cm'
  },
  {
    id: '2',
    title: 'Horizon Azur',
    category: ArtworkCategory.SEASCAPE,
    authorId: 'mme',
    collectionId: 'lumiere',
    year: '2021',
    technique: 'Huile sur toile',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
    description: "Le mouvement perpétuel des vagues rencontrant le calme infini du ciel.",
    dimensions: '60 x 120 cm'
  },
  {
    id: '3',
    title: 'Regard Profond',
    category: ArtworkCategory.PORTRAIT,
    authorId: 'mme',
    collectionId: 'echos',
    year: '2019',
    technique: 'Fusain et Graphite',
    image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1200',
    description: "Un portrait d'une intensité rare dévoilant l'âme.",
    dimensions: '50 x 70 cm'
  },
  {
    id: '4',
    title: 'Éclats de Vie',
    category: ArtworkCategory.STILL_LIFE,
    authorId: 'guest1',
    collectionId: 'echos',
    year: '2022',
    technique: 'Acrylique et Encre',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&q=80&w=1200',
    description: "Composition florale jouant sur les contrastes.",
    dimensions: '90 x 90 cm'
  },
  {
    id: '5',
    title: 'Forêt Mystique',
    category: ArtworkCategory.NATURE,
    authorId: 'mme',
    collectionId: 'lumiere',
    year: '2024',
    technique: 'Huile sur bois',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200',
    description: "Une immersion dans le vert profond d'une forêt ancestrale.",
    dimensions: '100 x 140 cm'
  },
  {
    id: '6',
    title: 'Souffle Marin',
    category: ArtworkCategory.SEASCAPE,
    authorId: 'mme',
    collectionId: 'lumiere',
    year: '2020',
    technique: 'Aquarelle et Pastels',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=1200',
    description: "La délicatesse de l'écume et la puissance du vent.",
    dimensions: '70 x 50 cm'
  }
];

export const EXHIBITIONS: Exhibition[] = [
  { year: '2015', title: 'Order and Fantasy', location: 'Private Residence, Pétion-Ville, Haiti' },
  { year: '2007', title: 'International Caribbean Art Fair (ICA)', location: 'New York, USA' },
  { year: '2007', title: 'Art and Spectacle', location: 'Festival Arts, Pétion Ville, Haiti' },
  { year: '2007', title: 'Open-Air Creations', location: 'Kenscoff, Haiti' }
];
