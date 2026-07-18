"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UserRole } from "@/types/role.type";
import { Controller, useForm } from "react-hook-form";
import { ALL_ROLES } from "@/features/user/configs/user-role";
import { getManagedRoles } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Link, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  updateUserSchema,
  UpdateUserType,
} from "@/features/user/schemas/update-user.schema";
import { zodResolver } from "@hookform/resolvers/zod";

interface UpdateUserFormProps {
  actorRole: UserRole;
  values: UpdateUserType;
}

export function UpdateUserForm({ actorRole, values }: UpdateUserFormProps) {
  const managedRoles = getManagedRoles(actorRole);

  const form = useForm<UpdateUserType>({
    resolver: zodResolver(updateUserSchema),
    values,
  });

  const onSubmit = (data: UpdateUserType) => {
    toast.info(JSON.stringify(data));
  };

  return (
    <form
      id="form-edit-user"
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
                  id="form-edit-user"
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
              <select
                {...field}
                id="role"
                disabled={form.formState.isSubmitting}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                {ALL_ROLES.filter((r) => managedRoles.includes(r.value)).map(
                  (role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ),
                )}
              </select>
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
              Updating...
            </>
          ) : (
            "Create User"
          )}
        </Button>
      </div>
    </form>
  );
}
