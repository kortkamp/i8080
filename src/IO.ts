import { Bus } from "./Bus";
import { byte, word } from "./types";

import {Buffer} from "node:buffer"
import { loadText, writeBin } from "./loader";

interface IExternalBus {
    read(port: word) : byte;
    write(port: word, value: byte) : void;
}



class IO extends Bus<byte> {
    
    private addressBus :  Bus<word>;




    private externalBus : IExternalBus;


     
    constructor( addressBus: Bus<word>, externalBus: IExternalBus ){
        super(0);
        this.addressBus = addressBus;
       

        this.externalBus = externalBus;

        
       
    }


    public override read(): byte {

        const port = this.addressBus.read() & 0xFF

        return this.externalBus.read(port);
    }


    public write(value: byte){
        const port = this.addressBus.read() & 0xFF

        this.externalBus.write(port, value);
    }
}


export { IO , IExternalBus}