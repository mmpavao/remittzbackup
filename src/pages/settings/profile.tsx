import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/auth';
import { Loader2, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  profession: z.string().min(2, 'Profession is required'),
  location: z.string().min(2, 'Location is required'),
  bio: z.string().max(500, 'Bio must be less than 500 characters'),
  website: z.string().url('Please enter a valid URL').or(z.string().length(0)),
});

type ProfileForm = z.infer<typeof profileSchema>;

export function Profile() {
  const { userData, setUserData } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: userData?.fullName || '',
      profession: userData?.profession || '',
      location: userData?.location || '',
      bio: userData?.bio || '',
      website: userData?.website || '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    if (!userData?.uid) {
      toast.error('User not found');
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', userData.uid);
      await updateDoc(userRef, data);

      setUserData({
        ...userData,
        ...data,
      });

      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error('Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {/* Profile Section */}
      <div className="p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={`https://ui-avatars.com/api/?name=${userData?.fullName}&background=random&size=128`}
                alt={userData?.fullName}
                className="w-32 h-32 rounded-full"
              />
              <button
                onClick={() => setEditingAvatar(true)}
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50"
              >
                <Pencil className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{userData?.fullName}</h2>
              <p className="text-sm text-gray-500">{userData?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
        <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              {...register('fullName')}
              className={cn(
                "mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500",
                errors.fullName && "border-red-300 focus:border-red-500 focus:ring-red-500"
              )}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profession
            </label>
            <input
              type="text"
              {...register('profession')}
              className={cn(
                "mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500",
                errors.profession && "border-red-300 focus:border-red-500 focus:ring-red-500"
              )}
            />
            {errors.profession && (
              <p className="mt-1 text-sm text-red-600">{errors.profession.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              {...register('location')}
              className={cn(
                "mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500",
                errors.location && "border-red-300 focus:border-red-500 focus:ring-red-500"
              )}
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              type="text"
              {...register('website')}
              className={cn(
                "mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500",
                errors.website && "border-red-300 focus:border-red-500 focus:ring-red-500"
              )}
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            {...register('bio')}
            rows={4}
            className={cn(
              "mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500",
              errors.bio && "border-red-300 focus:border-red-500 focus:ring-red-500"
            )}
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}