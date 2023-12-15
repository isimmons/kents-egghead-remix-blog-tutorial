import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { requireAdminUser } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdminUser(request);
  return json({});
};

const AdminIndexRoute = () => {
  return (
    <Link to="new" className="text-blue-600 underline">
      Create New Post
    </Link>
  );
};

export default AdminIndexRoute;
