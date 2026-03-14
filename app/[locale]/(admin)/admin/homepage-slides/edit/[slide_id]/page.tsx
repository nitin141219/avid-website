import { HomepageSlideForm } from "@/components/admin/homepage-slides/form/homepage-slide-form";

type Props = {
  params: Promise<{ slide_id: string }>;
};

export default async function EditHomepageSlidePage({ params }: Props) {
  const { slide_id } = await params;

  return <HomepageSlideForm slideId={slide_id} />;
}
