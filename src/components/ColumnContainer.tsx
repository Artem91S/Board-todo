import { SortableContext, useSortable } from "@dnd-kit/sortable";
import Trash from "../icons/Trash";
import { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskComponent from "./TaskComponent";

type Props = {
  column: Column;
  deleteOnCLickColumn: (id: Id) => void;
  updateColomnValue: (id: Id, title: string) => void;
  createTask: (id: Id) => void;
  tasks: Task[];
  deleteTask: (id: Id) => void;
  updateOurTask: (id: Id, component: string) => void;
};

function ColumnContainer({
  column,
  deleteOnCLickColumn,
  updateColomnValue,
  createTask,
  tasks,
  deleteTask,
  updateOurTask,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className=" bg-columnBackgroundColor  w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col opacity-70 border-cyan-500"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className=" bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className=" bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-2xl round-b-none p-3 font-bold border-columnBackgroundColor border-4 flex justify-between items-center"
      >
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2 text-sm rounded-full ">
          {tasks.length}
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-[#4e80ba] focus:border-purple-900  rounded outline-none px-2"
              value={column.title}
              onChange={(e) => updateColomnValue(column.id, e.target.value)}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => deleteOnCLickColumn(column.id)}
          className=" stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2"
        >
          <Trash />
        </button>
      </div>
      <div className="flex flex-grow flex-col gap-4 p-4 overflow-y-auto overflow-x-hidden">
        <SortableContext items={taskIds}>
          {tasks.map((task) => (
            <TaskComponent
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateOurTask={updateOurTask}
            />
          ))}
        </SortableContext>
      </div>
      <button
        onClick={() => {
          createTask(column.id);
        }}
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor active:bg-sky-900"
      >
        <PlusIcon />
        Add Task
      </button>
    </div>
  );
}

export default ColumnContainer;
