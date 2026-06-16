import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useRegister } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import type { AuthResponse } from "@workspace/api-client-react";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  userName: z.string().min(3, "Min 3 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Min 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["brand", "creator"]),
  gender: z.enum(["male", "female"]),
  countryId: z.number().default(1),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { setAuth } = useAuth();
  const { toast } = useToast();
  const [role, setRole] = useState<"brand" | "creator">("brand");
  const registerMutation = useRegister();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", userName: "", email: "", password: "", phone: "", role: "brand", gender: "male", countryId: 1 },
  });

  const onSubmit = (values: FormData) => {
    registerMutation.mutate({ data: { ...values, role } }, {
      onSuccess: (data) => {
        const auth = data as unknown as AuthResponse;
        setAuth(auth.token, auth.user);
        setLocation("/");
      },
      onError: (err: unknown) => {
        const msg = (err as { data?: { error?: string } })?.data?.error ?? "Registration failed";
        toast({ title: "Error", description: msg, variant: "destructive" });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6" data-testid="page-register">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="text-2xl font-bold text-foreground mb-1">Create an account</div>
          <p className="text-muted-foreground text-sm">Join iGoTrend — West Africa's influencer platform</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setRole("brand"); form.setValue("role", "brand"); }}
            className={`flex-1 py-2.5 rounded-md text-sm font-medium border transition-colors ${role === "brand" ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:bg-muted"}`}
            data-testid="button-role-brand"
          >Brand / Agency</button>
          <button
            onClick={() => { setRole("creator"); form.setValue("role", "creator"); }}
            className={`flex-1 py-2.5 rounded-md text-sm font-medium border transition-colors ${role === "creator" ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:bg-muted"}`}
            data-testid="button-role-creator"
          >Creator</button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="firstName" render={({ field }) => (
                <FormItem><FormLabel>First name</FormLabel><FormControl><Input {...field} data-testid="input-first-name" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="lastName" render={({ field }) => (
                <FormItem><FormLabel>Last name</FormLabel><FormControl><Input {...field} data-testid="input-last-name" /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="userName" render={({ field }) => (
              <FormItem><FormLabel>Username</FormLabel><FormControl><Input {...field} placeholder="@yourname" data-testid="input-username" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} type="email" data-testid="input-email" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem><FormLabel>Password</FormLabel><FormControl><Input {...field} type="password" data-testid="input-password" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="gender" render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <select {...field} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring" data-testid="select-gender">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" className="w-full mt-2" disabled={registerMutation.isPending} data-testid="button-register">
              {registerMutation.isPending ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline" data-testid="link-login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
