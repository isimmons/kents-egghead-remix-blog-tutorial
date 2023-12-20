import {
  redirect,
  type ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useNavigation,
  useParams,
  useRouteError,
} from "@remix-run/react";

import {
  createPost,
  deletePost,
  getPostBySlug,
  updatePost,
} from "~/models/post.server";
import { requireAdminUser } from "~/session.server";
import { invariantResponse } from "~/utils";

const inputClassName =
  "w-full rounded border border-gray-500 px-2 py-1 text-lg";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAdminUser(request);

  const { slug } = params;
  invariantResponse(typeof slug === "string");

  if (slug === "new") return json({ post: null });

  const post = await getPostBySlug(slug);
  invariantResponse(post, "Post Not Found", { status: 404 });

  return json({ post });
};

export type ActionData =
  | {
      title: string | null;
      slug: string | null;
      markdown: string | null;
    }
  | undefined;

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await requireAdminUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  invariantResponse(params.slug, "slug is required");

  if (intent === "delete") {
    await deletePost(params.slug);

    return redirect("/posts/admin");
  }

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  // update to zod later for server and client side validation
  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) return json<ActionData>(errors);

  // must pass strings to createPost will fix with zod validation later
  invariantResponse(typeof title === "string");
  invariantResponse(typeof slug === "string");
  invariantResponse(typeof markdown === "string");

  if (params.slug === "new") {
    await createPost({ title, slug, markdown });
  } else {
    await updatePost(params.slug, { title, slug, markdown });
  }

  return redirect("/posts/admin");
};

const NewPostRoute = () => {
  const data = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.formData?.get("intent") === "create";
  const isUpdating = navigation.formData?.get("intent") === "update";
  const isDeleting = navigation.formData?.get("intent") === "delete";
  const isNewPost = !data.post;

  return (
    <Form method="POST" key={data.post?.slug ?? "new"}>
      <p>
        <label>
          Post Title:{" "}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input
            type="text"
            name="title"
            defaultValue={data.post?.title}
            className={inputClassName}
          />
        </label>
      </p>
      <p>
        <label>
          Post Slug:
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input
            type="text"
            name="slug"
            defaultValue={data.post?.slug}
            className={inputClassName}
          />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>
        {errors?.markdown ? (
          <em className="text-red-600">{errors.markdown}</em>
        ) : null}
        <textarea
          name="markdown"
          id="markdown"
          rows={20}
          defaultValue={data.post?.markdown}
          className={`${inputClassName} font-mono`}
        ></textarea>
      </p>
      <div className="flex justify-end gap-4">
        {isNewPost ? null : (
          <button
            type="submit"
            name="intent"
            value="delete"
            disabled={isDeleting}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300 disabled:text-gray-400"
          >
            {isDeleting ? "Deleting..." : "Delete Post"}
          </button>
        )}
        <button
          type="submit"
          name="intent"
          value={isNewPost ? "create" : "update"}
          disabled={isSubmitting || isUpdating}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300 disabled:text-gray-400"
        >
          {isNewPost
            ? isSubmitting
              ? "Creating post..."
              : "Create Post"
            : null}
          {isNewPost ? null : isUpdating ? "Updating..." : "Update Post"}
        </button>
      </div>
    </Form>
  );
};

export const ErrorBoundary = () => {
  const error = useRouteError();
  const params = useParams();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div>{`Uh oh! A post with slug '${params.slug}' does not exist!`}</div>
      );
    }
    throw new Error(`Unsupported thrown response status code: ${error.status}`);
  } else if (error instanceof Error) {
    return (
      <>
        <div className="text-red-500">Oh no, something went wrong!</div>
        <pre>{error.message}</pre>
      </>
    );
  }
};

export default NewPostRoute;
