"use client";
import { PostSchema } from "@/schema/postSchema";
import React, { type FC, useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";
import { TRPCClientError } from "@trpc/client";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";

interface IProps {
  onClose: () => void;
  type?: "create" | "edit";
  postId?: string;
}

const PostForm: FC<IProps> = ({ onClose, type = "create", postId }) => {
  const utils = api.useUtils();

  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    mode: "onBlur",
  });

  const { data: post } = api.post.getDetail.useQuery(postId!, {
    enabled: type === "edit" && !!postId,
  });

  const { mutateAsync: createPost } = api.post.create.useMutation();
  const { mutateAsync: updatePost } = api.post.edit.useMutation();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<z.infer<typeof PostSchema>> = async (data) => {
    try {
      setIsLoading(true);
      if (type === "create") {
        await createPost(data);
        toast.success("Post created successfully");
      }
      if (type === "edit") {
        await updatePost(data);
        toast.success("Post created successfully");
      }
      await utils.post.getAll.invalidate();
      onClose();
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error("Failed to create post");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (post) {
      form.reset(post);
    }
  }, [post]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        className="mt-2 flex flex-col gap-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>name</FormLabel>
              <FormControl>
                <Input placeholder="i'm feeling lucky" {...field} />
              </FormControl>
              <FormDescription>
                minimum 3 characters, maximum 20 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="ml-auto" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Creating post...
            </>
          ) : type === "create" ? (
            "Create Post"
          ) : (
            "Edit Post"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PostForm;
