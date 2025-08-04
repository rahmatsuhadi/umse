'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone } from 'lucide-react';

const phoneCheckSchema = z.object({
  phone: z.string().min(10, "Nomor HP minimal 10 karakter.").regex(/^08[0-9]{8,}$/, "Format Nomor HP tidak valid."),
});

type Props = {
  onSuccess: (phone: string) => void;
};

export default function PhoneNumberCheckStep({ onSuccess }: Props) {
  const form = useForm<z.infer<typeof phoneCheckSchema>>({
    resolver: zodResolver(phoneCheckSchema),
    defaultValues: { phone: "" },
  });

  async function onSubmit(values: z.infer<typeof phoneCheckSchema>) {
    try {
      toast.info("Mengecek nomor HP...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulasi: Anggap nomor HP selalu tersedia
      toast.success("Nomor HP tersedia!", { description: "Silakan lanjutkan pendaftaran." });
      onSuccess(values.phone);
    } catch (error) {
      toast.error("Nomor HP sudah terdaftar", {
        description: "Gunakan nomor lain atau masuk.",
      });
    }
  }

  return (
    <Card className="w-full max-w-md animate-in fade-in-0 zoom-in-95">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-pink-600">Daftar</CardTitle>
        <CardDescription>Masukkan nomor HP Anda untuk memeriksa apakah sudah terdaftar.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor HP</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input placeholder="0812 xxxxxx" className="pl-10 rounded-lg border-primary" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full py-6" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Memeriksa...' : 'Periksa'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}