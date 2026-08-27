import { redirect } from 'next/navigation';

interface StoryRedirectProps {
  params: Promise<{ slug: string }>;
}

export default async function StoryDetailRedirectPage({ params }: StoryRedirectProps) {
  const { slug } = await params;
  redirect(`/publications/${slug}`);
}
