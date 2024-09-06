"use client";

import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import PostItem from "./PostItem";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Loader } from "lucide-react";

const PostContainer = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, error } =
    api.post.getAll.useInfiniteQuery(
      {
        limit: 3,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  const { ref, inView } = useInView();

  const [parent] = useAutoAnimate();

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (error) return <h1>erorrr</h1>;

  return (
    <div ref={parent} className="flex w-full flex-col gap-4">
      {isLoading ? (
        <>
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </>
      ) : (
        <>
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </>
      )}
      {hasNextPage ? (
        <div ref={ref} className="flex w-full justify-center p-2">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div>
          <p className="text-center text-sm font-semibold text-muted-foreground">
            item sudah keload semua
          </p>
        </div>
      )}
    </div>
  );
};

export default PostContainer;
