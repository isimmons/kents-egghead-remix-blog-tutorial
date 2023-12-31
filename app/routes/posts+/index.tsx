import { json } from "@remix-run/node";
import { Link, useLoaderData, useRouteError } from "@remix-run/react";

import { getPostListings } from "~/models/post.server";
import { useOptionalAdminUser } from "~/utils";

export type LoaderData = {
  posts: Awaited<ReturnType<typeof getPostListings>>;
};

export const loader = async () => {
  const posts = await getPostListings();

  return json<LoaderData>({ posts });
};

const PostsRoute = () => {
  const { posts } = useLoaderData<typeof loader>();
  const adminUser = useOptionalAdminUser();

  return (
    <main>
      <h1>Posts</h1>
      {adminUser ? (
        <Link to="admin" className="text-red-600 underline">
          Admin
        </Link>
      ) : null}
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to={post.slug}
              prefetch="intent"
              className="text-blue-600 underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export const ErrorBoundary = () => {
  const error = useRouteError();

  if (error instanceof Error) {
    return (
      <>
        <div className="text-red-500">Oh no, something went wrong!</div>
        <pre>{error.message}</pre>
      </>
    );
  }
};

export default PostsRoute;
