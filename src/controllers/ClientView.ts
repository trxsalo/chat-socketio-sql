import {Request,Response,NextFunction} from "express";
import * as path from "path";
export const RenderClient = (req:Request, res:Response)=>{
    res.sendFile(path.join(__dirname, 'client', 'index.html'));

}