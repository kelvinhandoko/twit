import { z } from "zod";

import { getAllPostQuerySchema, PostSchema } from "@/schema/postSchema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { type Prisma } from "@prisma/client";
import { TRPCError, type inferRouterOutputs } from "@trpc/server";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(PostSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  edit: protectedProcedure
    .input(PostSchema)
    .mutation(async ({ ctx, input }) => {
      const findPost = await ctx.db.post.findUnique({
        where: { id: input.id },
      });
      if (!findPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }
      return ctx.db.post.update({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
        where: { id: input.id },
      });
    }),
  getAll: protectedProcedure
    .input(getAllPostQuerySchema)
    .query(async ({ ctx, input }) => {
      const { authorId, cursor, limit } = input;
      const whereClause: Prisma.PostWhereInput = {};
      if (authorId) {
        whereClause.createdById = authorId;
      }

      const posts = await ctx.db.post.findMany({
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
        include: { createdBy: true },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }

      return {
        data: posts,
        nextCursor,
      };
    }),

  getDetail: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input },
        include: { createdBy: true },
      });
      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }
      return post;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const findPost = await ctx.db.post.findUnique({
        where: { id: input },
      });
      if (!findPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }
      return ctx.db.post.delete({ where: { id: input } });
    }),
});

export type PostRouter = inferRouterOutputs<typeof postRouter>;
