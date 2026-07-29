"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { authService } from "@/lib/services";
import { useAuth } from "@/providers/auth-provider";
import { normalizeApiError } from "@/lib/api-error";
import { getDashboardPath } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorAlert } from "@/components/ui/error-alert";
import { useState } from "react";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
    role: z.enum(["TENANT", "LANDLORD"]),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [apiError, setApiError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "TENANT" },
  });

  const onSubmit = async (values: FormValues) => {
    setApiError("");
    try {
      await authService.register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        phone: values.phone,
      });
      const loginResult = await authService.login({
        email: values.email,
        password: values.password,
      });
      login(loginResult.token, loginResult.user);
      toast.success("Account created successfully");
      router.push(getDashboardPath(loginResult.user.role));
    } catch (error) {
      const message = normalizeApiError(error);
      setApiError(message);
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-16">
      <Card className="w-full">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--ink)]">
          Create account
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Join RentNest as a tenant or landlord.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input label="Full name" error={errors.name?.message} {...register("name")} />
          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input label="Phone" error={errors.phone?.message} {...register("phone")} />
          <Select
            label="Role"
            error={errors.role?.message}
            options={[
              { label: "Tenant", value: "TENANT" },
              { label: "Landlord", value: "LANDLORD" },
            ]}
            {...register("role")}
          />
          <Input
            label="Password"
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            label="Confirm password"
            type="password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          {apiError ? <ErrorAlert message={apiError} /> : null}
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Register
          </Button>
        </form>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-[var(--brand)]">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
