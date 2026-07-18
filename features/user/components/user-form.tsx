"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  createUserSchema,
  type CreateUserType,
} from "../schemas/create-user.schema";
import {
  updateUserSchema,
  type UpdateUserType,
} from "../schemas/update-user.schema";
import { createUserAction } from "../actions/create-user.action";
import { updateUserAction } from "../actions/update-user.action";
import { UserRole } from "@/types/role.type";
import { getAllowedRoles } from "@/lib/permissions";
import { applyServerErrors } from "@/lib/apply-server-errors";

const ALL_ROLES: { value: UserRole; label: string }[] = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
];

type CreateMode = {
  mode: "create";
  userId?: undefined;
  defaultValues?: undefined;
  onSuccess?: () => void;
  onClose?: () => void;
  actorRole: UserRole;
};

type EditMode = {
  mode: "edit";
  userId: string;
  defaultValues: UpdateUserType;
  onSuccess?: () => void;
  onClose?: () => void;
  actorRole: UserRole;
};

type UserFormProps = CreateMode | EditMode;

export function UserForm(props: UserFormProps) {
  const router = useRouter();

  if (props.mode === "create") {
    return (
      <CreateUserForm
        router={router}
        actorRole={props.actorRole}
        onSuccess={props.onSuccess}
        onClose={props.onClose}
      />
    );
  }

  return (
    <EditUserForm
      userId={props.userId}
      defaultValues={props.defaultValues}
      actorRole={props.actorRole}
      router={router}
      onSuccess={props.onSuccess}
      onClose={props.onClose}
    />
  );
}

function CreateUserForm({
  router,
  onSuccess,
  onClose,
  actorRole,
}: {
  router: ReturnType<typeof useRouter>;
  onSuccess?: () => void;
  onClose?: () => void;
  actorRole: UserRole;
}) {
  const allowedRoles = getAllowedRoles(actorRole);

  const form = useForm<CreateUserType>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: (allowedRoles.includes("user") ? "user" : allowedRoles[0]) || "user",
      phone: "",
    },
  });

  const onSubmit = async (data: CreateUserType) => {
    const result = await createUserAction(data);

    if (!result.success) {
      toast.error(result.message);
      applyServerErrors(form.setError, result.errors);
      return;
    }

    toast.success(result.message);
    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/admin/users");
    }
  };

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
              <select
                {...field}
                id="role"
                disabled={form.formState.isSubmitting}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                {ALL_ROLES.filter((r) => allowedRoles.includes(r.value)).map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => (onClose ? onClose() : router.push("/admin/users"))}
          disabled={form.formState.isSubmitting}
        >
          Cancel
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

function EditUserForm({
  userId,
  defaultValues,
  router,
  onSuccess,
  onClose,
  actorRole,
}: {
  userId: string;
  defaultValues: UpdateUserType;
  router: ReturnType<typeof useRouter>;
  onSuccess?: () => void;
  onClose?: () => void;
  actorRole: UserRole;
}) {
  const allowedRoles = getAllowedRoles(actorRole);

  const form = useForm<UpdateUserType>({
    resolver: zodResolver(updateUserSchema),
    defaultValues,
  });

  const onSubmit = async (data: UpdateUserType) => {
    const result = await updateUserAction(userId, data);

    if (!result.success) {
      toast.error(result.message);
      applyServerErrors(form.setError, result.errors);
      return;
    }

    toast.success(result.message);
    if (onSuccess) {
      onSuccess();
    } else {
      router.push(`/admin/users`);
      router.refresh();
    }
  };

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
              <select
                {...field}
                id="role"
                disabled={form.formState.isSubmitting}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                {ALL_ROLES.filter((r) => allowedRoles.includes(r.value) || r.value === defaultValues.role).map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            onClose ? onClose() : router.push(`/admin/users/${userId}`)
          }
          disabled={form.formState.isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
