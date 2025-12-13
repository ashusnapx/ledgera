"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";
import { GET_TASK_COMMENTS } from "@/graphql/queries";
import { ADD_TASK_COMMENT } from "@/graphql/mutations";

export function CommentsPanel({ taskId }: { taskId: string }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const { data, loading } = useQuery(GET_TASK_COMMENTS, {
    variables: { organizationSlug: "acme", taskId },
    skip: !open,
  });

  const [addComment] = useMutation(ADD_TASK_COMMENT, {
    refetchQueries: ["GetTaskComments"],
  });

  return (
    <div className='mt-2'>
      <button
        onClick={() => setOpen(!open)}
        className='text-xs text-blue-600 hover:underline'
      >
        {open ? "Hide comments" : "View comments"}
      </button>

      <div
        className={`transition-all duration-300 ease-out overflow-hidden ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className='mt-2 space-y-2'>
          {loading && <p className='text-xs text-gray-400'>Loading…</p>}

          {data?.taskComments.map((c: any) => (
            <div key={c.id} className='text-sm bg-white border rounded p-2'>
              <p>{c.content}</p>
              <p className='text-xs text-gray-400 mt-1'>{c.authorEmail}</p>
            </div>
          ))}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!text.trim()) return;

              addComment({
                variables: {
                  organizationSlug: "acme",
                  taskId,
                  content: text,
                  authorEmail: "user@acme.com",
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
            className='flex gap-2'
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='Add a comment…'
              className='flex-1 border rounded px-2 py-1 text-sm'
            />
            <button
              type='submit'
              className='text-sm bg-blue-600 text-white px-3 rounded'
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
