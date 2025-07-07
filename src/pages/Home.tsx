import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

interface Todo {
    id: number
    text: string
    completed: boolean
}

const schema = z.object({
    todo: z.string().min(2, 'Todo must be at least 2 characters'),
})

type FormData = z.infer<typeof schema>

export default function Home() {
    const [todos, setTodos] = useState<Todo[]>([])

    const addTodo = (data: FormData) => {
        if (data.todo.trim()) {
            const newTodo: Todo = {
                id: Date.now(),
                text: data.todo.trim(),
                completed: false
            }
            setTodos([...todos, newTodo])
        }
    }

    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ))
    }

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id))
    }

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const onSubmit = (data: FormData) => {
        addTodo(data)
    }
    console.log(todos)
    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
            <h1>Basic Todo App</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        {...register('todo')}
                        placeholder="Add a new todo..."
                        style={{
                            width: '70%',
                            padding: '10px',
                            marginRight: '10px',
                            fontSize: '16px'
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Add
                    </button>
                </div>
                {errors.todo && <p style={{ color: 'red' }}>{errors.todo.message}</p>}
            </form>
            <div>
                {todos.length === 0 ? (
                    <p style={{ color: '#666', textAlign: 'center' }}>No todos yet. Add one above!</p>
                ) : (
                    todos.map(todo => (
                        <div
                            key={todo.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '10px',
                                margin: '5px 0',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                backgroundColor: todo.completed ? '#f8f9fa' : 'white'
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => toggleTodo(todo.id)}
                                style={{ marginRight: '10px' }}
                            />
                            <span
                                style={{
                                    flex: 1,
                                    textDecoration: todo.completed ? 'line-through' : 'none',
                                    color: todo.completed ? '#666' : 'black'
                                }}
                            >
                                {todo.text}
                            </span>
                            <button
                                onClick={() => deleteTodo(todo.id)}
                                style={{
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>

            {todos.length > 0 && (
                <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
                    <p>Total: {todos.length} | Completed: {todos.filter(t => t.completed).length}</p>
                </div>
            )}
        </div>
    )
}
