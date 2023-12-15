import {
  redirect,
  type ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";

import { createPost } from "~/models/post.server";
import { requireAdminUser } from "~/session.server";
import { invariantResponse } from "~/utils";

const inputClassName =
  "w-full rounded border border-gray-500 px-2 py-1 text-lg";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdminUser(request);
  return json({});
};

export type ActionData =
  | {
      title: string | null;
      slug: string | null;
      markdown: string | null;
    }
  | undefined;

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminUser(request);
  const formData = await request.formData();

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

  // must pass strings to createPost
  invariantResponse(typeof title === "string");
  invariantResponse(typeof slug === "string");
  invariantResponse(typeof markdown === "string");
  await createPost({ title, slug, markdown });

  return redirect("/posts/admin");
};

const NewPostRoute = () => {
  const errors = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="POST">
      <p>
        <label>
          Post Title:{" "}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input type="text" name="title" className={inputClassName} />
        </label>
      </p>
      <p>
        <label>
          Post Slug:
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input type="text" name="slug" className={inputClassName} />
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
          className={`${inputClassName} font-mono`}
        ></textarea>
      </p>
      <p className="text-right">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300 disabled:text-gray-400"
        >
          {isSubmitting ? "Creating post..." : "Create Post"}
        </button>
      </p>
    </Form>
  );
};

export default NewPostRoute;
