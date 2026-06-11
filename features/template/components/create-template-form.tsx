"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import {
  createTemplateFormSchema,
  CreateTemplateFormType,
  CreateTemplateActionType,
} from "../schemas/create-template";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createTemplateAction } from "../actions/create-template";
import {
  useR2Upload,
  UploadedImage,
} from "@/hooks/use-r2-upload";
import Image from "next/image";
import Link from "next/link";

export function CreateTemplateForm() {
  const router = useRouter();
  const { upload, remove, isUploading, uploadProgress } = useR2Upload();

  const uploadedImageRef = useRef<UploadedImage | null>(null);
  const submittedRef = useRef(false);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<CreateTemplateFormType>({
    resolver: zodResolver(createTemplateFormSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      status: "draft",
      thumbnail: undefined,
    },
  });

  useEffect(() => {
    return () => {
      if (!submittedRef.current && uploadedImageRef.current) {
        remove(uploadedImageRef.current.key);
      }
    };
  }, [remove]);

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;

    const validationResult =
      createTemplateFormSchema.shape.thumbnail.safeParse(file);
    if (!validationResult.success) {
      setPreview(null);
      return;
    }

    if (uploadedImageRef.current) {
      await remove(uploadedImageRef.current.key);
      uploadedImageRef.current = null;
    }

    try {
      const uploaded = await upload(file, { kind: "thumbnail" });
      uploadedImageRef.current = uploaded;
      setPreview(uploaded.url);
    } catch {
      toast.error("Gagal mengupload thumbnail, coba lagi.");
    }
  };

  const onSubmit = async (data: CreateTemplateFormType) => {
    if (!uploadedImageRef.current) {
      form.setError("thumbnail", {
        type: "manual",
        message: "Silahkan tunggu upload thumbnail selesai.",
      });
      return;
    }

    const actionData: CreateTemplateActionType = {
      name: data.name,
      category: data.category,
      description: data.description,
      status: data.status,
      thumbnailUrl: uploadedImageRef.current.url,
    };

    const result = await createTemplateAction(actionData);

    if (result.errors) {
      if (result.errors._form) {
        toast.error(result.errors._form[0]);
      }
      Object.entries(result.errors).forEach(([field, messages]) => {
        if (field !== "_form" && messages) {
          const formField =
            field === "thumbnailUrl"
              ? "thumbnail"
              : (field as keyof CreateTemplateFormType);
          form.setError(formField, { message: messages[0] });
        }
      });
      return;
    }

    submittedRef.current = true;
    toast.success("Template berhasil dibuat.");
    router.push("/admin/templates");
  };

  const handleFormSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    form.handleSubmit(onSubmit)(e);
  };

  return (
    <form className="space-y-6" onSubmit={handleFormSubmit}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Template Name</FieldLabel>
              <Input
                {...field}
                id="name"
                placeholder="Coastal"
                disabled={form.formState.isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="category"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="category">Template Category</FieldLabel>
              <Input
                {...field}
                id="category"
                placeholder="Elegant"
                disabled={form.formState.isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                {...field}
                id="description"
                placeholder="Describe the template"
                disabled={form.formState.isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="status"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <select
                {...field}
                id="status"
                disabled={form.formState.isSubmitting}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="thumbnail"
          render={({ field: { onChange, ...field }, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="thumbnail">Thumbnail</FieldLabel>
              <Input
                {...field}
                value=""
                id="thumbnail"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                disabled={form.formState.isSubmitting || isUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  onChange(file || null);
                  handleFileChange(file);
                  form.trigger("thumbnail");
                }}
              />
              {isUploading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Uploading... {uploadProgress}%
                </div>
              )}
              {preview && !isUploading && (
                <div className="relative mt-2 aspect-square max-h-24">
                  <Image
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    src={preview}
                    alt="Thumbnail preview"
                    className="rounded-md border object-cover"
                  />
                </div>
              )}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex gap-3">
        <Button
          asChild
          type="button"
          variant="outline"
          disabled={form.formState.isSubmitting || isUploading}
        >
          <Link href="/admin/templates">Cancel</Link>
        </Button>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || isUploading}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Template"
          )}
        </Button>
      </div>
    </form>
  );
}
