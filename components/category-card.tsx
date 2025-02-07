import Image from "next/image";
import Link from "next/link";

import { Category, Restaurant } from "@prisma/client";

interface Props {
  category: Category;
  restaurants?: Restaurant[];
}

export function CategoryCard({ category }: Props) {
  return (
    <Link href={`/categorias/${category.slug}`}>
      <div className="relative w-full h-40 sm:max-h-48 md:max-h-52 group rounded-md overflow-clip">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover bg-muted"
            fill
          />
        ) : (
          <Image
            src="/images/placeholder.svg"
            alt={category.name}
            className="w-full h-full object-cover bg-muted"
            fill
          />
        )}

        <span className="absolute inset-0 p-4 flex text-white text-xl font-bold tracking-tight bg-gradient-to-r from-neutral-700 to-transparent bg-opacity-30 transition-all group-hover:backdrop-blur-[2px]">
          {category.name}
        </span>
      </div>
    </Link>
  );
}
