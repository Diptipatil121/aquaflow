import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplet, Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { signupSchema, type SignupFormData } from '@/components/forms/schemas';
import { APP_NAME } from '@/utils/constants';

export default function SignupPage() {
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup(data);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error((err as { message: string }).message ?? 'Signup failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
            <Droplet className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gradient">{APP_NAME}</h1>
        </div>
        <h2 className="text-2xl font-bold">Create account</h2>
        <p className="mt-1 text-sm text-slate-500">Get started with your water management dashboard</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input label="Full Name" icon={<User className="h-4 w-4" />} error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" icon={<Mail className="h-4 w-4" />} error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" icon={<Lock className="h-4 w-4" />} error={errors.password?.message} {...register('password')} />
          <Input label="Confirm Password" type="password" icon={<Lock className="h-4 w-4" />} error={errors.confirmPassword?.message} {...register('confirmPassword')} />
          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>Create Account</Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
