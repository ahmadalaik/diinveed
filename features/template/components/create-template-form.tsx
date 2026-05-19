"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import {
  createTemplateSchema,
  CreateTemplateType,
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
  useCloudinaryUpload,
  UploadedImage,
} from "../hooks/use-cloudinary-upload";
import Image from "next/image";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

interface CreateTemplateFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function CreateTemplateForm({
  onSuccess,
  onClose,
}: CreateTemplateFormProps) {
  const router = useRouter();
  const { upload, remove, isUploading, uploadProgress } = useCloudinaryUpload();

  const uploadedImageRef = useRef<UploadedImage | null>(null);
  const submittedRef = useRef(false);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<CreateTemplateType>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      status: "draft",
      thumbnailUrl: "",
    },
  });

  useEffect(() => {
    return () => {
      if (!submittedRef.current && uploadedImageRef.current) {
        remove(uploadedImageRef.current.publicId);
      }
    };
  }, [remove]);

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;

    setThumbnailError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setThumbnailError(
        "Hanya format .jpg, .jpeg, .png dan .webp yang diperbolehkan",
      );
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setThumbnailError("Ukuran maksimal thumbnail adalah 5MB");
      return;
    }

    if (uploadedImageRef.current) {
      await remove(uploadedImageRef.current.publicId);
      uploadedImageRef.current = null;
    }

    try {
      const uploaded = await upload(file);
      uploadedImageRef.current = uploaded;
      form.setValue("thumbnailUrl", uploaded.url, { shouldValidate: true });
      setPreview(uploaded.url);
    } catch {
      toast.error("Gagal mengupload thumbnail, coba lagi.");
    }
  };

  const onSubmit = async (data: CreateTemplateType) => {
    const result = await createTemplateAction(data);

    if (result.errors) {
      if (result.errors._form) {
        toast.error(result.errors._form[0]);
      }
      Object.entries(result.errors).forEach(([field, messages]) => {
        if (field !== "_form" && messages) {
          form.setError(field as keyof CreateTemplateType, {
            message: messages[0],
          });
        }
      });
      return;
    }

    submittedRef.current = true;
    toast.success("Template berhasil dibuat.");
    onSuccess();
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

        <Field
          data-invalid={
            !!thumbnailError || !!form.formState.errors.thumbnailUrl
          }
        >
          <FieldLabel htmlFor="thumbnail">Thumbnail</FieldLabel>
          <Input
            id="thumbnail"
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            disabled={form.formState.isSubmitting || isUploading}
            onChange={(e) => handleFileChange(e.target.files?.[0])}
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
                className="h-24 w-auto rounded-md border object-cover"
              />
            </div>
          )}
          {thumbnailError && (
            <p className="text-sm text-destructive">{thumbnailError}</p>
          )}
          {form.formState.errors.thumbnailUrl && !thumbnailError && (
            <p className="text-sm text-destructive">
              {form.formState.errors.thumbnailUrl.message}
            </p>
          )}
        </Field>
      </FieldGroup>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={form.formState.isSubmitting || isUploading}
        >
          Cancel
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
