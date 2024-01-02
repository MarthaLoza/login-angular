import { Response, Request } from "express";
import bcrypt from 'bcrypt';
import { User } from "../models/user";
import jwt from 'jsonwebtoken';

export const newUser = async (req: Request, res: Response) => {

    const { username, password } = req.body;

    //Validamos si el usuario ya existe en la base de datos
   const exist_user = await User.findOne({where: { username: username }})

   if(exist_user){
        return res.status(400).json({
            msg: `Ya existe un usuairo con el nombre ${username}`
        })
   }
    
    const hasedPassword = await bcrypt.hash(password, 10)

    try {
        //Guardamos usuario en la base de datos
        await User.create({
            username: username,
            password: hasedPassword
        })
    
        res.json({
            msg: `Usuario ${username} creado exitosamente.`   
        })
        
    } catch (error) {
        res.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        })
    }

}

export const loginUser = async (req: Request, res: Response) => {

    const { username, password } = req.body;

    //Validamos si el usuario existe en la base de datos
    const exist_user: any = await User.findOne({where: { username: username }});

    if(!exist_user){

        return res.status(400).json({
            msg: `No existe un usuario con el nombre ${username} en la base de datos`
        })
    }

    //Validamos el password
    const passwordValid = await bcrypt.compare(password, exist_user.password)
    if(!passwordValid){
        return res.status(400).json({
            msg: `Password incorrecto`
        })
    }

    //Generamos token
    const token = jwt.sign({
        username: username
    }, process.env.SECRET_KEY || 'pepito123');

    res.json({token});  

}