import PostContainer from "@/components/post/PostContainer";
import PostHeader from "@/components/post/PostHeader";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import Link from "next/link";

export default async function Home() {
  void (await api.post.getAll.prefetchInfinite({ limit: 10 }));
  const session = await auth();
  return (
    <HydrateClient>
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-2">
        <PostHeader />
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-2xl text-white">
            {session && <span>Logged in as {session.user.email}</span>}
          </p>
          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            {session ? "Sign out" : "Sign in"}
          </Link>
        </div>
        <PostContainer />
      </div>
    </HydrateClient>
  );
}
