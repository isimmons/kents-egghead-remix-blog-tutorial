import { prisma } from "~/db.server";

export type Post = {
  slug: string;
  title: string;
  markdown: string;
};

export const getPostListings = async () => {
  return prisma.post.findMany({
    select: {
      slug: true,
      title: true,
    },
  });
};

export const getPosts = async () => {
  return prisma.post.findMany();
};
