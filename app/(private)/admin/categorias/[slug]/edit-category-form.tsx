"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { UploadButton } from "@/lib/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { CheckIcon, TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";
import { z } from "zod";
import { updateCategory } from "./actions";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(3, "Campo obrigatório"),
  slug: z.optional(z.string()),
  description: z.string().min(20, "Campo obrigatório"),
  imageUrl: z.optional(z.string()),
});

interface Props {
  category: Category;
}

export function EditCategoryForm({ category }: Props) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const slug = slugify(values.name, { lower: true });

    const data = { ...values, slug, id: category.id };

    const update = await updateCategory(data);

    if (!update) return toast.error("Erro ao atualizar categoria");

    toast.success("Categoria atualizada com sucesso");
    return router.push("/admin");
  }

  const { isValid, isDirty, isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da categoria</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="Digite o nome aqui."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição da categoria</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isSubmitting}
                  placeholder="Breve descrição da categoria."
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={() => (
            <FormItem>
              <FormLabel>Imagem (opcional)</FormLabel>
              <FormControl>
                <UploadButton
                  appearance={{
                    container: {
                      alignItems: "start",
                    },
                  }}
                  disabled={isSubmitting}
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    form.setValue("imageUrl", res[0].url, {
                      shouldDirty: true,
                    });
                  }}
                  onUploadError={(error: Error) => {
                    toast.error("Erro ao fazer upload da imagem.", {
                      description: error.message,
                    });
                  }}
                />
              </FormControl>
              {form.watch("imageUrl") && (
                <div className="aspect-[3/2] max-h-64 relative">
                  <Image
                    src={form.watch("imageUrl")!}
                    alt="Imagem da categoria"
                    className="w-full h-full rounded-md bg-muted object-cover"
                    fill
                  />
                  <Button
                    type="button"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      form.setValue("imageUrl", "", { shouldDirty: true })
                    }
                  >
                    <TrashIcon />
                    <span className="sr-only">Remover imagem</span>
                  </Button>
                </div>
              )}
              <FormDescription>Recomendado 900x600px (3:2)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={!isValid || !isDirty || isSubmitting}>
          <CheckIcon />
          Salvar alterações
        </Button>
      </form>
    </Form>
  );
}
