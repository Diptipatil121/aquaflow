import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/components/forms/schemas';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const message = await forgotPassword(data.email);
      toast.success(message);
    } catch {
      toast.error('Failed to send reset link');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass-card">
        <Link to="/login" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>
        <h2 className="text-2xl font-bold">Forgot password?</h2>
        <p className="mt-1 text-sm text-slate-500">Enter your email and we&apos;ll send you a reset link</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input label="Email" type="email" icon={<Mail className="h-4 w-4" />} error={errors.email?.message} {...register('email')} />
          <Button type="submit" className="w-full" isLoading={isSubmitting}>Send Reset Link</Button>
        </form>
      </motion.div>
    </div>
  );
}
