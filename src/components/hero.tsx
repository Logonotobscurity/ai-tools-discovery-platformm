import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast, Toaster } from 'sonner';

const newsletterFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;

const NewsletterForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
  });

  const onSubmit = (data: NewsletterFormValues) => {
    console.log("Newsletter submission:", data);
    toast.success(`Thank you for subscribing! A confirmation has been sent to ${data.email}.`);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto" role="form" aria-labelledby="newsletter-heading">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          id="email"
          aria-label="Email address"
          aria-describedby="email-error"
          placeholder="Enter your email address"
          className="flex-grow bg-white/80 dark:bg-gray-800/80"
          {...register("email")}
        />
        <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold">
          Join Newsletter
        </Button>
      </div>
      {errors.email && (
        <p id="email-error" className="text-red-500 text-sm mt-2">{errors.email.message}</p>
      )}
    </form>
  );
};

const Hero: React.FC = () => {
  return (
    <section className="hero-carousel bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-black py-16 lg:py-24">
       <Toaster richColors />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 id="newsletter-heading" className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Discover the Perfect
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              AI Tools
            </span>
            for Your Project
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            From startup ideation to enterprise scaling, find exactly what you need 
            with our AI-powered discovery platform.
          </p>
          
          <div className="mt-8">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
