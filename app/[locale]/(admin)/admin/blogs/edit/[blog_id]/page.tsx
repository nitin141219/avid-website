import { BlogForm } from "@/components/admin/blogs/form/blog-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ blog_id: string; locale: string }>;
};

async function getBlog(id: string) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      redirect("/login");
    }

    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/get-blog/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      redirect("/login");
    }

    if (!res.ok) {
      redirect("/admin/blogs");
    }

    const data = await res.json();
    return data;
  } catch {
    redirect("/admin/blogs");
  }
}

async function getAllBlogs() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      redirect("/login");
    }

    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/admin/get-blogs?is_dropdown=true`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      redirect("/login");
    }

    if (!res.ok) {
      redirect("/admin/blogs");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("ERROR-->", error);

    redirect("/admin/blogs");
  }
}

export default async function EditBlog({ params }: Props) {
  const id = (await params).blog_id;
  const blogData = await getBlog(id);
  const allBlogs = await getAllBlogs();

  return <BlogForm blogId={id} blogData={blogData?.data || {}} blogsData={allBlogs?.data || []} />;
}
