// app/categories/loading.tsx — Next.js Suspense loading UI for /categories
import { CategoriesPageSkeleton } from '@/components/ui/Skeleton';

export default function CategoriesLoading() {
  return <CategoriesPageSkeleton />;
}
