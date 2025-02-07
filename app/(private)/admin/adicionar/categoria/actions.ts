"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

interface Props {
  name: string;
  slug: string;
  description: string;
  imageUrl?: string | undefined;
}

export const createCategory = async (data: Props) => {
  const user = await currentUser();

  if (!user) throw new Error("Usuário não autenticado");

  // TODO: verify if user is admin

  // verify if the slug is already in use by another category
  const categoryWithSlug = await prisma.category.findFirst({
    where: {
      slug: data.slug,
    },
  });

  if (categoryWithSlug) throw new Error("Categoria com slug já existente");

  try {
    const category = await prisma.category.create({ data });

    revalidatePath("/admin/adicionar");

    return category;
  } catch {
    throw new Error("Erro ao atualizar categoria");
  }
};
