export type Post = {
  slug: string;
  title: string;
};

export const getPosts = async () => {
  const posts = [
    {
      slug: "my-first-post",
      title: "My First Post!",
    },
    {
      slug: "trail-riding-with-onewheel",
      title: "Trail Riding with Onewheel",
    },
  ];

  return posts;
};
