"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { type PostRouter } from "@/server/api/routers/post";
import { api } from "@/trpc/react";
import { getFallbackName } from "@/utils/nameHelper";
import { TRPCClientError } from "@trpc/client";
import { MoreVertical } from "lucide-react";
import { useState, type FC } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import PostForm from "./PostForm";

interface IProps {
  post: PostRouter["getAll"]["data"][0];
}

const PostItem: FC<IProps> = ({ post }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const utils = api.useUtils();

  const { mutateAsync: deletePost } = api.post.delete.useMutation();

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      await utils.post.getAll.invalidate();
      toast.success("Post deleted successfully");
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error("Failed to delete post");
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 space-y-0 border-b">
          <div className="grid h-8 w-8 place-content-center rounded-full border bg-muted">
            <p className="text-sm font-thin">
              {getFallbackName(post.createdBy.email ?? "")}
            </p>
          </div>
          <p className="mt-0">{post.createdBy.email ?? ""}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="ml-auto">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteOpen(true)}>
                delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-3">
          <h3 className="text-lg font-semibold">{post.name}</h3>
        </CardContent>
      </Card>
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>edit post form</DialogTitle>
            <PostForm
              onClose={() => setIsEditOpen(false)}
              postId={post.id}
              type="edit"
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostItem;
