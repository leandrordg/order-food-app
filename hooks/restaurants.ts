import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const getRestaurants = async () => {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      categories: true,
      products: true,
      reviews: true,
    },
  });

  const latestRestaurants = restaurants.sort((a, b) =>
    a.createdAt > b.createdAt ? -1 : 1
  );

  return {
    latestRestaurants,
  };
};

export const getRestaurantBySlug = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    include: {
      categories: true,
      products: true,
    },
  });

  return {
    restaurant,
    categories: restaurant?.categories,
    products: restaurant?.products,
  };
};

export const getUserRestaurantBySlug = async (slug: string) => {
  const session = await auth();

  if (!session?.user) throw new Error("Usuário não autenticado.");

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      slug,
      ownerId: session.user.id,
    },
    include: {
      categories: true,
      products: true,
    },
  });

  return {
    restaurant,
    categories: restaurant?.categories,
    products: restaurant?.products,
  };
};

export const getRestaurantsByCategory = async (slug: string) => {
  const hasCategory = await prisma.category.findUnique({
    where: {
      slug,
    },
  });

  if (!hasCategory)
    return {
      category: null,
      latestRestaurants: [],
    };

  const restaurants = await prisma.restaurant.findMany({
    where: {
      categories: {
        some: {
          slug,
        },
      },
    },
    include: {
      categories: true,
      products: true,
      reviews: true,
    },
  });

  const latestRestaurants = restaurants.sort((a, b) => {
    return a.createdAt > b.createdAt ? -1 : 1;
  });

  return {
    category: hasCategory,
    latestRestaurants: latestRestaurants,
  };
};

export const getRestaurantsByUser = async () => {
  const session = await auth();

  if (!session?.user) throw new Error("Usuário não autenticado.");

  const restaurants = await prisma.restaurant.findMany({
    where: {
      ownerId: session.user.id,
    },
    include: {
      categories: true,
      products: true,
      reviews: true,
    },
  });

  return {
    restaurants,
  };
};
