import { useEffect, useState } from "react";
import { readTodos, createTodo } from "./functions";
import Preloader from "./components/Preloader";
import { updateTodo,deleteTodo } from "./api";

function App() {
    const [todo, setTodo] = useState({ title: '', content: '' });
    const [todos,setTodos]=useState(null);
    const [currentId,setCurrentId]=useState(0);
    useEffect(() => {
        const fetchData = async() => {
            const result = await readTodos();
            console.log(result);
            setTodos(result);
        }
        fetchData()
    }, [currentId]);
    useEffect(() => {
        let currentTodo =currentId!==0?todos.find(t=>t._id===currentId):{title:'',content:''};
setTodo(currentTodo);
    }, [currentId]);
    const onSubmitHandler = async(e) => {
        e.preventDefault();
        if(currentId===0){
            const result = await createTodo(todo);
            console.log(result);
            setTodos([...todos,result]);
            clear();
        }else{
            const result= await updateTodo(currentId,todo);
            clear();
        }
      
    }
    useEffect(()=>{
        const close=e=>{
            if(e.keyCode===27){
              clear()
            }
        }
        window.addEventListener('keydown',close);
        return ()=>window.removeEventListener('keydown',close);
    })
const clear=()=>{
    setCurrentId(0);
    setTodo({title:'',content:''});
}
const removeTodo = async(id)=>{
    console.log('id',id)
    await deleteTodo(id);
    const todosCopy = [...todos];
    console.log(todosCopy);
    todosCopy.filter(todo=>todo._id!==id);
    setTodos(todosCopy);
  }
    return (    <div className="container">
    <div className="row">
    <pre>{JSON.stringify(todo)}</pre>
      <form className="col s12" onSubmit={onSubmitHandler}>
        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">T</i>
            <input value={todo.title} id="icon_prefix" type="text" className="validate" onChange={e=>setTodo({...todo,title:e.target.value})} />
            <label htmlFor="icon_prefix">Title</label>
          </div>
          <div className="input-field col s6">
            <i className="material-icons prefix">description</i>
            <input value={todo.content} id="description" type="tel" className="validate" onChange={e=>setTodo({...todo,content:e.target.value})} />
            <label htmlFor="description">content</label>
          </div>
        </div>
        <div className="row right-align"></div>
        <button className="wave-effect waves-light btn">Submit</button>
      </form>
      {/* <Preloader></Preloader> */}
      {
          !todos?<Preloader/>:todos.length>0?<ul className="collection">
              {todos.map(todo=>(
                //   {JSON.stringify(todo)}
                  <li onClick={()=>setCurrentId(todo._id)} key={todo._id} class="collection-item"><div><h5>{todo.title}</h5><p>{todo.content}<a href="" class="secondary-content"   onClick={()=>removeTodo(todo._id)}><i class="material-icons" >delete</i></a></p></div></li>
    ))}
     
        </ul>:<p>No Content</p>}
        
       
          

    </div>
  </div>
    );
}

export default App;