import { type Post } from "@prisma/client";

import { prisma } from "~/db.server";

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

export const getPostBySlug = async (slug: string) => {
  return prisma.post.findUnique({
    where: { slug },
  });
};

export const createPost = async (
  post: Pick<Post, "slug" | "title" | "markdown">,
) => {
  return prisma.post.create({ data: post });
};
