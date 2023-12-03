import React, {useState, useEffect} from 'react'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Header from "./components/Header"
import Footer from "./components/Footer"
import About from "./components/About"
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      // console.log(tasksFromServer)
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  //fetchTasks from json server
  const fetchTasks = async() => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    if(data === undefined)
      return []
    return data
  }

  //fetchTask from json server
  const fetchTask = async(id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    if(data === undefined)
      return []
    return data
  }

  //Add Task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()
    setTasks([...tasks, data])
  }

  //delete task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE"
    })
    setTasks(tasks.filter((task) => task.id !== id))
  }

  //toggle Reminder
  const toggleReminder = async (id) => {
    const taskTotoggle = await fetchTask(id)
    const updatedTask = {...taskTotoggle, reminder: !taskTotoggle.reminder}

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    })

    const data = await res.json()

    setTasks(tasks.map((task) => (task.id === id ? { ...task, reminder : data.reminder } : task)))
  }

  return (
    <Router>
      <div className='container'>
        <Header onAdd={() => {setShowAddTask(!showAddTask)}} showAdd={showAddTask} title={'Task tracker'}></Header>
        <Routes>
          <Route
            path='/'
            element={
              <>
                {showAddTask && <AddTask onAdd={addTask} />}
                {tasks.length > 0 ? (
                  <Tasks
                    tasks={tasks}
                    onDelete={deleteTask}
                    onToggle={toggleReminder}
                  />
                ) : (
                  'No Tasks To Show'
                )}
              </>
            }
          />
          <Route path='/about' element={<About />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  )
}

export default App
