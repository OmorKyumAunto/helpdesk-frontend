import { useState } from "react";
import { CalendarIcon, XIcon, ClockIcon, CheckIcon } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  repeat: string;
  completed: boolean;
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>({
    id: Date.now(),
    title: "",
    description: "",
    dueDate: "",
    repeat: "Does not repeat",
    completed: false,
  });
  const [showModal, setShowModal] = useState(false);

  const addTask = () => {
    if (newTask.title.trim()) {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
      setNewTask({ id: Date.now(), title: "", description: "", dueDate: "", repeat: "Does not repeat", completed: false });
      setShowModal(false);
    }
  };

  return (
    <div className="flex flex-col items-start p-4 w-full max-w-md">
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700"
      >
        + Create Task
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center border-b pb-2">
              <input
                type="text"
                placeholder="Add title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full text-lg font-medium outline-none border-none"
              />
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center space-x-2 border p-2 rounded-lg">
                <ClockIcon className="w-5 h-5 text-gray-500" />
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full outline-none border-none"
                />
              </div>

              <div className="flex items-center space-x-2 border p-2 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-gray-500" />
                <select
                  value={newTask.repeat}
                  onChange={(e) => setNewTask({ ...newTask, repeat: e.target.value })}
                  className="w-full outline-none border-none"
                >
                  <option>Does not repeat</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>

              <textarea
                placeholder="Add description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full border p-2 rounded-lg outline-none"
              />

              <button
                onClick={addTask}
                className={`w-full py-2 rounded-lg text-white ${newTask.title ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
                disabled={!newTask.title}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
