import React, { useReducer, useContext, createContext, Dispatch, useRef } from "react";

type TodoType = {
    id: number;
    text: string;
    done: boolean;
}

type TodoContextType = TodoType[];

const initialTodos: TodoType[] = [
    {
        id: 1,
        text: 'Create Project',
        done: true
    },
    {
        id: 2,
        text: 'Styling Components',
        done: true
    },
    {
        id: 3,
        text: 'Create Context',
        done: false
    },
    {
        id: 4,
        text: 'Implements function',
        done: false
    }
];

type Action = {
    type: 'CREATE';
    todo: {id: number, text: string, done: boolean};
} | {
    id: number;
    type: 'TOGGLE';
} | {
    id: number;
    type: 'REMOVE';
}

function todoReducer(state: TodoContextType, action: Action): TodoContextType {
    switch(action.type) {
        case 'CREATE':
            const nstate = [...state];
            nstate.push(action.todo);
            return nstate;
            // return state.concat(action.todo);
        case 'TOGGLE':
            return state.map(todo => {
                return todo.id === action.id ? {...todo, done: !todo.done} : todo;
            });
        case 'REMOVE':
            return state.filter(todo => todo.id !== action.id);
    }
}

type SampleDispatch = Dispatch<Action>;

const TodoStateContext = createContext<TodoContextType | null>(null);
const TodoDispatchContext = createContext<SampleDispatch | null>(null);
const TodoNextIdContext = createContext<React.MutableRefObject<number> | null>(null);

type TodoProviderProps = {
    children: React.ReactNode
}

export function TodoProvider({children}: TodoProviderProps) {
    const [state, dispatch] = useReducer(todoReducer, initialTodos);
    const nextId = useRef<number>(0);

    return (
        <TodoStateContext.Provider value={state}>
            <TodoDispatchContext.Provider value={dispatch}>
                <TodoNextIdContext.Provider value={nextId}>
                    {children}
                </TodoNextIdContext.Provider>

            </TodoDispatchContext.Provider>
        </TodoStateContext.Provider>
    );
}

export function useTodoState(): TodoContextType {
    const state = useContext(TodoStateContext);
    if (!state) throw new Error('Cannot find StateProvider');
    return state;
}

export function useDispatch(): SampleDispatch {
    const dispatch = useContext(TodoDispatchContext);
    if (!dispatch) throw new Error('Cannot find DispatchProvider');
    return dispatch;
}

export function useTodoNextId(): React.MutableRefObject<number> {
    const nextId = useContext(TodoNextIdContext);
    if (!nextId) throw new Error('Cannot find nextIdProvider');
    return nextId;
}


