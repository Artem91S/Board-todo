import './App.css'
import TodoBoars from './components/TodoBoars'

function App() {
return (
  <>
  <h1 className='text-3xl text-center absolute  w-full'>Make your day plan with me</h1>
  <TodoBoars/>
   <p className='text-white absolute bottom-0 w-full text-center m-auto text-2xl'>	&copy;Made by <span className='text-sky-900'>Artem Sytnikov </span>Developer</p>
  </>
)
}

export default App
