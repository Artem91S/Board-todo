import { useEffect, useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskComponent from "./TaskComponent";
import { parseLocalStorageItem } from "../utils";

function TodoBoars() {
  const [columns, setColumns] = useState<Column[]>([])
  const [task, setTask] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const columnsId = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );
  useEffect(()=>{
    setColumns(parseLocalStorageItem('columns'))
    setTask(parseLocalStorageItem('task'))
    setActiveColumn(parseLocalStorageItem('activeColumns'))
    setActiveTask(parseLocalStorageItem('activeTask'))
  },[])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 200,
      },
    })
  );
  function CreateColumn() {
    const columnAddColumn: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnAddColumn]);
    localStorage.setItem('columns',JSON.stringify([...columns, columnAddColumn]))
  }
  function generateId() {
    return Math.floor(Math.random() * 10001);
  }
  function deleteOnCLickColumn(id: Id) {
    const filterColumns = columns.filter((column) => column.id !== id);
    setColumns(filterColumns);
    localStorage.setItem('columns',JSON.stringify(filterColumns))
    const newTask=task.filter(elem=>elem.columnId !== id)
    setTask(newTask)
    localStorage.setItem('task',JSON.stringify(newTask))
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      localStorage.setItem('activeColumns',JSON.stringify(event.active.data.current.column))
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      localStorage.setItem('activeTask',JSON.stringify(event.active.data.current.task))
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null)
    setActiveTask(null)
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;
    setColumns((columns) => {
      const activeIndex = columns.findIndex(
        (column) => column.id === active.id
      );

      const overIndex = columns.findIndex((column) => column.id === over.id);
      localStorage.setItem('columns',JSON.stringify(arrayMove(columns, activeIndex, overIndex)))
      return arrayMove(columns, activeIndex, overIndex);
    });
  }
  function updateColomnValue(id: Id, title: string) {
    const updateColumns = columns.map((column) => {
      if (column.id !== id) return column;
      return { ...column, title };
    });
    setColumns(updateColumns);
    localStorage.setItem('columns',JSON.stringify(updateColumns))
  }

  function createTask(id: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId: id,
      content: `Task ${task.length + 1}`,
    };
    setTask([...task, newTask]);
    localStorage.setItem('task',JSON.stringify([...task, newTask]))
  }
  function deleteTask(id: Id) {
    const newTasks = task.filter((task) => task.id !== id);
    setTask(newTasks);
    localStorage.setItem('task',JSON.stringify(newTasks))
  }

  function updateOurTask(id: Id, content: string) {
    const updateTask = task.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    setTask(updateTask);
    localStorage.setItem('task',JSON.stringify(updateTask))
  }
  function onDragOver (event:DragOverEvent){
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;
    const isActiveTask =active.data.current?.type === "Task"
    const isOverTask =over.data.current?.type === "Task"
    if(!activeTask)return;
    if(isActiveTask && isOverTask ) {
      setTask(task=>{
        const activeIndex =task.findIndex(elem=>elem.id === active.id)
        const overIndex =task.findIndex(elem=>elem.id === over.id)
        task[activeIndex].columnId=task[overIndex].columnId
        localStorage.setItem('task',JSON.stringify(arrayMove(task, activeIndex, overIndex)))
        return arrayMove(task, activeIndex, overIndex);
      })
    }
    const isOverColumn =over.data.current?.type ==="Column"
    if(isOverColumn && isOverTask ){
      setTask(task=>{
        const activeIndex =task.findIndex(elem=>elem.id === active.id)
        task[activeIndex].columnId=over.id;
        localStorage.setItem('task',JSON.stringify(arrayMove(task, activeIndex, activeIndex)))
        return arrayMove(task, activeIndex, activeIndex);
      })
    }
  }
  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        sensors={sensors}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-2">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <ColumnContainer
                  key={column.id}
                  column={column}
                  deleteOnCLickColumn={deleteOnCLickColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateColomnValue={updateColomnValue}
                  updateOurTask={updateOurTask}
                  tasks={task.filter((task) => task.columnId === column.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={CreateColumn}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-sky-900 hover:ring-2 flex gap-2"
          >
            <PlusIcon />
            ADD Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                updateColomnValue={updateColomnValue}
                deleteOnCLickColumn={deleteOnCLickColumn}
                deleteTask={deleteTask}
                createTask={createTask}
                updateOurTask={updateOurTask}
                tasks={task.filter((task) => task.columnId === activeColumn.id)}
              />
            )}
            {activeTask && (
              <TaskComponent
                task={activeTask}
                deleteTask={deleteTask}
                updateOurTask={updateOurTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export default TodoBoars;
