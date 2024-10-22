
import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDTO, UpdateTodoDTO } from "../../domain/dtos";


export class TodosController {
    
    constructor(){ }

    

    public getTodos= async(req:Request, res:Response) => {

        const todo = await prisma.todo.findMany()
        res.json(todo);
        return
    }

    public getTodoById= async(req:Request, res:Response) =>{
        const id= +req.params.id;        
        const todo = await prisma.todo.findUnique({
            
            where: { id: id }
        });
        
        if ( isNaN(id) )  res.status(400).json({error: 'ID argument is not a number'});
        ( todo )
            ? res.json(todo)
            : res.status(404).json({ error: `TODO with id ${id} not found`})

    }

    public createTodo = async (req:Request, res:Response) =>{
        const [error, createTodoDTO] = CreateTodoDTO.create(req.body);
        if(error) {
            res.status(400).json({ error });
            return
        }
       

        const todo = await prisma.todo.create({
            data: createTodoDTO! //Este texto es el que viene en la primera linea de esta funcion
        });
                
        res.json( todo );
        return

    };

    public updateTodo = async( req:Request, res:Response ) => {
        const id= +req.params.id;
        const [error, updateTodoDTO] = UpdateTodoDTO.create({ ...req.body, id });

        if( error ) {
            res.status(400).json({error});
            return
        }

        const todo = await prisma.todo.findUnique({             
            where: { id: id }
        });
        if ( !todo ){
            res.status(404).json({ error: `Todo with id ${id} not found`});
            return
        }
        

        const todos = await prisma.todo.update({
            where: { id: id },
            data: updateTodoDTO!.values
        });

        res.json( todos );
    }


    public deleteTodo = async( req:Request, res:Response ) =>{
        const id= +req.params.id;
        // const todo = await prisma.todo.delete({
        //     where: { id }
        // });

        // if ( !todo ){
        //     res.status(404).json({ error: `Todo with ${id} not found` })
        //     return
        // }        
        // res.json(todo);

        const todo = await prisma.todo.findFirst({
            where: { id }
        });

        if ( !todo ){
            res.status(404).json({ error: `Todo with id ${ id } not found`});
            return
        }

        const deleted = await prisma.todo.delete({
            where: { id }
        });

        ( deleted )
            ? res.json( deleted )
            : res.status(400).json({ error: `Todo with id ${ id } not found`});

    }

}