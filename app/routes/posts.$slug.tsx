import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { marked } from "marked";

import { getPostBySlug } from "~/models/post.server";
import { invariantResponse } from "~/utils";

export type LoaderData = {
  title: string;
  content: string;
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { slug } = params;
  invariantResponse(slug, "Slug is required");

  const post = await getPostBySlug(slug);
  invariantResponse(post, `Post Not Found: ${slug}`, { status: 404 });

  const content = await marked(post.markdown);
  return json<LoaderData>({ title: post.title, content });
};

const PostRoute = () => {
  const { title, content } = useLoaderData<typeof loader>();

  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </main>
  );
};

export default PostRoute;
