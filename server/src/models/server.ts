import express, { Application } from 'express';
import cors from 'cors';
import routesProduct from '../ruotes/product';
import routesUser from '../ruotes/user'
import { Product } from './product';
import { User } from './user';

class Server{
    private app: Application;
    private port: string;

    constructor(){
        this.app = express();
        this.port = process.env.PORT || '3002';
        this.listen();
        this.midlewares();
        this.routes();
        this.dbConnect();
    }

    listen() {        
        this.app.listen(this.port, () => {
            console.log('Aplicación corriendo en el puerto ' + this.port);
        })
    }

    routes() {
        this.app.use('/api/products', routesProduct);
        this.app.use('/api/users', routesUser);
    }

    midlewares() {
        //Parseo body
        this.app.use(express.json());

        //Cors
        this.app.use(cors());
    }

    async dbConnect() {
        try {
            await Product.sync()
            await User.sync()
            
        } catch (error) {
            console.log("Unable to connect to the database: ", error);
            
        }
    }
}

export default Server;