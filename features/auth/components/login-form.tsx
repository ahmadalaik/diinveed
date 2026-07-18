"use client";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, LoginType } from "@/features/auth/schemas/login.schema";
import { Eye, EyeOff, GalleryVerticalEnd, Loader2 } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { loginAction } from "../actions/login.action";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginType) => {
    const { error } = await signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      const errorMessage = error.message || "";
      const lowerMsg = errorMessage.toLowerCase();

      const translations: Record<string, string> = {
        "invalid email or password": "Email atau password salah",
        "invalid password": "Email atau password salah",
        "invalid credentials": "Email atau password salah",
        "user not found": "Pengguna tidak ditemukan",
        "too many requests": "Terlalu banyak percobaan, coba lagi nanti",
      };

      const translatedMessage =
        Object.entries(translations).find(([key]) =>
          lowerMsg.includes(key),
        )?.[1] ||
        errorMessage ||
        "Gagal Login";

      toast.error(translatedMessage);

      const errorField =
        lowerMsg.includes("password") || lowerMsg.includes("credentials")
          ? "password"
          : lowerMsg.includes("user not found") || lowerMsg.includes("email")
            ? "email"
            : null;

      if (errorField) {
        form.setError(errorField, { message: translatedMessage });
      }
      return;
    }

    const result = await loginAction();
    if (!result.success) {
      toast.error(result.message || "Login gagal");
      return;
    }

    toast.success("Login berhasil");

    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push(result.data?.redirectTo || "/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="relative w-full max-w-sm overflow-hidden rounded-xl border bg-linear-to-b from-muted/50 to-card px-8 py-8 shadow-lg/5 dark:from-transparent dark:shadow-xl">
        <div
          className="absolute inset-0 -top-px -left-px z-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, color-mix(in srgb, var(--card-foreground) 8%, transparent) 1px, transparent 1px),
              linear-gradient(to bottom, color-mix(in srgb, var(--card-foreground) 8%, transparent) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 0",
            maskImage: `
              repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
              radial-gradient(ellipse 70% 50% at 50% 0%, #000 60%, transparent 100%)`,
            WebkitMaskImage: `repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
              radial-gradient(ellipse 70% 50% at 50% 0%, #000 60%, transparent 100%)
            `,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        />

        <div className="relative isolate flex flex-col items-center">
          <GalleryVerticalEnd className="h-9 w-9" />
          <p className="mt-4 font-semibold text-xl tracking-tight">Diinveed</p>

          <form
            className="w-full space-y-4 mt-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Your Email Address"
                      autoComplete="off"
                      disabled={form.formState.isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your password"
                        autoComplete="off"
                        disabled={form.formState.isSubmitting}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setShowPassword((prevState) => !prevState)
                        }
                        className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent z-10"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              className="w-full mt-4"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait..
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* <RegisterRedirect /> */}
        </div>
      </div>
    </div>
  );
}

function RegisterRedirect() {
  return (
    <div className="mt-5 space-y-5">
      <Link
        className="block text-center text-muted-foreground text-sm underline"
        href="#"
      >
        Forgot your password?
      </Link>
      <p className="text-center text-sm">
        Don&apos;t have an account?
        <Link className="ml-1 text-muted-foreground underline" href="/register">
          Create account
        </Link>
      </p>
    </div>
  );
}
