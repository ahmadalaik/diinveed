"use client";

import { Controller, useForm } from "react-hook-form";
import {
  createUserSchema,
  CreateUserType,
} from "@/features/user/schemas/create-user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@/types/role.type";
import { getManagedRoles } from "@/lib/permissions";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ALL_ROLES } from "@/features/user/configs/user-role";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateUserFormProps {
  actorRole: UserRole;
}

export function CreateUserForm({ actorRole }: CreateUserFormProps) {
  const managedRoles = getManagedRoles(actorRole);

  const form = useForm<CreateUserType>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role:
        (managedRoles.includes("user") ? "user" : managedRoles[0]) || "user",
      phone: "",
    },
  });

  const onSubmit = (data: CreateUserType) => {
    toast.info(JSON.stringify(data));
  };

  return (
    <form
      id="form-create-user"
      className="space-y-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                {...field}
                id="name"
                placeholder="John Doe"
                disabled={form.formState.isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                placeholder="john@example.com"
                disabled={form.formState.isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                {...field}
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                disabled={form.formState.isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="phone"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="phone">Phone (optional)</FieldLabel>
              <Input
                {...field}
                id="phone"
                type="tel"
                placeholder="+62..."
                disabled={form.formState.isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="role"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                disabled={form.formState.isSubmitting}
              >
                <SelectTrigger
                  id="form-create-user"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_ROLES.filter((r) => managedRoles.includes(r.value)).map(
                    (role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
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
          disabled={form.formState.isSubmitting}
        >
          <Link href="/admin/users">Cancel</Link>
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create User"
          )}
        </Button>
      </div>
    </form>
  );
}
