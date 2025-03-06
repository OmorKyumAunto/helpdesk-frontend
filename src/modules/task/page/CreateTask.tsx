import { useState } from "react";
import { Plus, Trash2, CalendarDays, Clock, X, ChevronDown, ChevronUp } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Task {
  id: number;
  title: string;
  startDate: Date | null;
  startTime: string;
  endDate: Date | null;
  endTime: string;
  description: string;
  completed: boolean;
  expanded: boolean;
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>({
    id: Date.now(),
    title: "",
    startDate: null,
    startTime: "",
    endDate: null,
    endTime: "",
    description: "",
    completed: false,
    expanded: false,
  });
  const [showModal, setShowModal] = useState(false);

  const addTask = () => {
    if (newTask.title.trim() && newTask.startDate && newTask.startTime) {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
      setNewTask({
        id: Date.now(),
        title: "",
        startDate: null,
        startTime: "",
        endDate: null,
        endTime: "",
        description: "",
        completed: false,
        expanded: false,
      });
      setShowModal(false);
    }
  };

  const toggleTaskExpand = (taskId: number) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, expanded: !task.expanded } : task));
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 text-gray-900 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Task Manager</h1>

      {/* Task List */}
      <div className="w-full max-w-3xl space-y-4">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks yet. Click the + button to create one!</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="p-4 rounded-xl transition-all bg-white shadow-lg hover:shadow-xl border border-gray-200 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`text-lg font-semibold ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {task.startDate?.toLocaleDateString()} {task.startTime} → {task.endDate ? task.endDate.toLocaleDateString() : "No end date"} {task.endTime}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button onClick={() => toggleTaskExpand(task.id)} className="p-2 text-gray-600 hover:text-gray-900 transition-all">
                    {task.expanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                  </button>
                  <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="p-2 text-gray-500 hover:text-red-500 transition-all">
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
              {task.expanded && <p className="mt-2 text-gray-700">{task.description || "No description"}</p>}
            </div>
          ))
        )}
      </div>

      {/* Floating Add Task Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 p-5 rounded-full shadow-xl hover:scale-110 transition-transform flex items-center justify-center"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Task Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="bg-white text-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center border-b pb-3">
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full text-lg font-semibold outline-none border-none bg-transparent p-2"
              />
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Start Date & Time */}
              <div className="space-y-2">
                <label className="text-gray-600 text-sm font-medium">Start Time (Required)</label>
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-100 shadow-sm">
                  <CalendarDays className="w-5 h-5 text-gray-500" />
                  <DatePicker
                    selected={newTask.startDate}
                    onChange={(date) => setNewTask({ ...newTask, startDate: date })}
                    dateFormat="MM/dd/yyyy"
                    placeholderText="Start Date"
                    className="w-full bg-transparent outline-none text-gray-900"
                  />
                  <Clock className="w-5 h-5 text-gray-500" />
                  <input
                    type="time"
                    value={newTask.startTime}
                    onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                    className="w-full bg-transparent outline-none text-gray-900"
                    required
                  />
                </div>
              </div>

              {/* End Date & Time */}
              <div className="space-y-2">
                <label className="text-gray-600 text-sm font-medium">End Time (Optional)</label>
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-100 shadow-sm">
                  <CalendarDays className="w-5 h-5 text-gray-500" />
                  <DatePicker
                    selected={newTask.endDate}
                    onChange={(date) => setNewTask({ ...newTask, endDate: date })}
                    dateFormat="MM/dd/yyyy"
                    placeholderText="End Date"
                    className="w-full bg-transparent outline-none text-gray-900"
                  />
                  <Clock className="w-5 h-5 text-gray-500" />
                  <input
                    type="time"
                    value={newTask.endTime}
                    onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
                    className="w-full bg-transparent outline-none text-gray-900"
                  />
                </div>
              </div>

              {/* Task Description */}
              <textarea
                placeholder="Task Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full p-3 rounded-xl outline-none bg-gray-100 text-gray-900 shadow-sm"
              />

              {/* Add Task Button */}
              <button
                onClick={addTask}
                className="w-full py-3 rounded-xl bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
