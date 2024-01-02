import express, {Express} from "express";  //Importamos express
import { Server as SocketIOServer, Socket } from 'socket.io';
import {createServer, Server} from 'http'

import {RenderClient} from './controllers/ClientView'
import cors from "cors"
import * as dotenv from "dotenv" // Importamos dotenv (si tenemos variables de entorno)
import morgan from "morgan";
import bodyParser from "body-parser";
dotenv.config(); // Cargamos las variables de entorno
/**
 * Clase Server
 */
export  class ServerExpress{

    private  app:Express;
    private  servernode:Server;
    private  io: SocketIOServer;
    /**
     *
     * @param port Especifica el puerto de escucha del servidor
     */
    constructor(private  port?: number| string) {
        this.app = express();  //Iniciamos express
        this.servernode = createServer(this.app);
        this.io = new SocketIOServer(this.servernode,{
            connectionStateRecovery:{}
        });
        this.configuracion();  //Configuracion
        this.listen();         //Escuchamos
        this.middlewares();    //Middlewares
        this.route();         // Espones las Rutas disponibles
        this.configureSockets();          //inicializacion del socket
        this.db();
    }

    /**
     * Configuracion del puerto de escucha
     */
    private configuracion():void{
        this.app.set("port", this.port || process.env.PORT || 8080);
    }

    /**
     * Escuchamos por el puerto que configuramos
     */
    private async listen():Promise<void>{
        //await  this.app.listen(this.app.get("port")); //express
        await  this.servernode.listen(this.app.get("port")); // server node con instancia de express, con el socket incluido
        console.log(`Servidor escuchando en el puerto: http://localhost:${this.app.get("port")}`);
    }
    async db(){

    }

    //Middlewares
    private middlewares():void{
        this.app.use(morgan("dev")); // Mesaje por consola de las peticiones con estilo dev , puede mirar la documentacion de morgan para ver mas detalles
        this.app.use(express.json()); // Permite leer el body de las peticiones
        this.app.use(bodyParser)
    }
    private configureSockets(): void {
        this.io.on('connection', (socket: Socket) => {
            console.log('Usuario conectado');
            // Manejar eventos de Socket.IO
            socket.on('message', (message: string) => {
                console.log('Mensaje desde el cliente:', message);
                // Puedes emitir mensajes a todos los clientes conectados
                this.io.emit('message_server', `${message}`);
            });

            socket.on('disconnect', () => {
                console.log('Usuario desconectado');
            });
        });
    }

    /**
     * Rutas expuestas
     */
    private  route(){
        this.app.use(express.static('client'));
        this.app.use("/", RenderClient); //Publico la carpeta public, servira un index.html
    }
}
