import { useState } from "react";
import Trash from "../icons/Trash";
import { Id, Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  task: Task;
  deleteTask: (id: Id) => void;
  updateOurTask: (id: Id, content: string) => void;
};

function TaskComponent({ task, deleteTask, updateOurTask }: Props) {
  const [hover, setHover] = useState(false);
  const [editMod, setEditMod] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMod,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const changeEditMod = () => {
    setEditMod((prev) => !prev);
    setHover(false);
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className=" opacity-50 bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl  border-2 border-sky-900 cursor-grab relative task"
      />
    );
  }

  if (editMod) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className=" bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] w-full items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-sky-900 cursor-grab relative"
      >
        <textarea
          value={task.content}
          autoFocus
          placeholder="Task"
          onBlur={changeEditMod}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) return changeEditMod();
          }}
          onChange={(e) => updateOurTask(task.id, e.target.value)}
          className="h-[90%]  w-full border-none rounded bg-transparent text-white focus:outline-none"
        ></textarea>
      </div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={changeEditMod}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className=" bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-sky-900 cursor-grab relative task"
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>

      {hover && (
        <button
          onClick={() => deleteTask(task.id)}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded"
        >
          <Trash />
        </button>
      )}
    </div>
  );
}

export default TaskComponent;
