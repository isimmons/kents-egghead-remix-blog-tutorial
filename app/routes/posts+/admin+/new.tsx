import { Form } from "@remix-run/react";

const inputClassName =
  "w-full rounded border border-gray-500 px-2 py-1 text-lg";

const NewPostRoute = () => {
  return (
    <Form method="POST">
      <p>
        <label>
          Post Title:
          <input type="text" name="title" className={inputClassName} />
        </label>
      </p>
      <p>
        <label>
          Post Slug:
          <input type="text" name="slug" className={inputClassName} />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>
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
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Create Post
        </button>
      </p>
    </Form>
  );
};

export default NewPostRoute;
