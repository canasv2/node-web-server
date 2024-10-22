
import { Request, Response } from "express";

const todos = [
    { id: 1, text:'comprar leche', createdAt: new Date()},
    { id: 2, text:'comprar pan', createdAt: null},
    { id: 3, text:'comprar cereal', createdAt: new Date()},
];

export class TodosController {
    
    constructor(){ }

    

    public getTodos=(req:Request, res:Response) => {

        res.json(todos);
        return
    }

    public getTodoById=(req:Request, res:Response) =>{
        const id= +req.params.id;
        const todo = todos.find( todo => todo.id === id);
        if ( isNaN(id) )  res.status(400).json({error: 'ID argument is not a number'});
        ( todo )
            ? res.json(todo)
            : res.status(404).json({ error: `TODO with id ${id} not found`})

    }

    public createTodo = (req:Request, res:Response) =>{
        const { text } = req.body;
        if ( !text ) {
            res.status(400).json({error: 'Text property is required'}) ;
            return
        } 
        const newTodo= {
            id: todos.length +1,
            text: text,
            createdAt: null
        };

        todos.push(newTodo);
        
        res.json(newTodo);
        return

    };

    public updateTodo = ( req:Request, res:Response ) => {
        const id= +req.params.id;
        if( isNaN( id ) ) {
            res.status(400).json({ error: 'ID argument is not a number'});
            return
        }

        const todo = todos.find( todo => todo.id === id);
        if ( !todo ){
            res.status(404).json({ error: `Todo with id ${id} not found`});
            return
        }

        const { text, createdAt } = req.body;

        todo.text = text || todo.text;
        ( createdAt === 'null' )
            ? todo.createdAt = null
            : todo.createdAt = new Date( createdAt || todo.createdAt );

        res.json(todo);
    }


    public deleteTodo = ( req:Request, res:Response ) =>{
        const id= +req.params.id;
        const todo = todos.find( todo => todo.id === id);
        if ( !todo ){
            res.status(404).json({ error: `Todo with ${id} not found` })
            return
        }
        todos.splice( todos.indexOf(todo),1 );
        res.json(todo);
        // const todo = todos.filter( item => item.id !== id) 
        // res.json( todo )
    }

}