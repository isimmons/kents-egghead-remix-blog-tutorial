import { Link } from "@remix-run/react";

const AdminIndexRoute = () => {
  return (
    <Link to="new" className="text-blue-600 underline">
      Create New Post
    </Link>
  );
};

export default AdminIndexRoute;
