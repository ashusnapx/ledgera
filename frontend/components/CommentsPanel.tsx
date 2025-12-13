"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send } from "lucide-react";

import { GET_TASK_COMMENTS } from "@/graphql/queries";
import { ADD_TASK_COMMENT } from "@/graphql/mutations";
import { useOrg } from "@/context/OrgContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

/* ================= TYPES ================= */

interface TaskComment {
  id: string;
  content: string;
  authorEmail: string;
  createdAt: string;
}

interface GetTaskCommentsData {
  taskComments: TaskComment[];
}

interface GetTaskCommentsVars {
  organizationSlug: string;
  taskId: string;
}

/* ================= COMPONENT ================= */

export function CommentsPanel({ taskId }: { taskId: string }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { orgSlug } = useOrg();

  const { data, loading } = useQuery<GetTaskCommentsData, GetTaskCommentsVars>(
    GET_TASK_COMMENTS,
    {
      variables: {
        organizationSlug: orgSlug,
        taskId,
      },
      skip: !open,
    }
  );

  const [addComment] = useMutation(ADD_TASK_COMMENT, {
    refetchQueries: ["GetTaskComments"],
  });

  return (
    <div className='mt-2'>
      {/* Toggle button */}
      <Button
        variant='ghost'
        size='sm'
        onClick={() => setOpen(!open)}
        className='h-7 px-2 text-xs text-muted-foreground'
      >
        <MessageSquare className='mr-1 h-3.5 w-3.5' />
        {open ? "Hide comments" : "View comments"}
      </Button>

      {/* Animated panel */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className='mt-2 overflow-hidden rounded-lg border bg-muted/30'
          >
            <div className='space-y-3 p-3'>
              {loading && (
                <p className='text-xs text-muted-foreground'>
                  Loading comments…
                </p>
              )}

              {/* Comments list */}
              {data?.taskComments.map((c) => (
                <div
                  key={c.id}
                  className='rounded-md bg-background p-2 text-sm shadow-sm'
                >
                  <p className='leading-snug'>{c.content}</p>
                  <p className='mt-1 text-xs text-muted-foreground'>
                    {c.authorEmail}
                  </p>
                </div>
              ))}

              <Separator />

              {/* Add comment */}
              <form
                className='flex items-center gap-2'
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!text.trim()) return;

                  addComment({
                    variables: {
                      organizationSlug: orgSlug,
                      taskId,
                      content: text,
                      authorEmail: "user@company.com",
                    },
                    optimisticResponse: {
                      addTaskComment: {
                        __typename: "AddTaskComment",
                        comment: text,
                      },
                    },
                  });

                  setText("");
                }}
              >
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder='Write a comment…'
                  className='h-8 text-sm'
                />

                <Button size='icon' type='submit'>
                  <Send className='h-4 w-4' />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
