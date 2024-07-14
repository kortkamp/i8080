import { Bus } from "./Bus";
import { byte, word } from "./types";

class Memory extends Bus<byte> {
    public data : byte[];

    private addressBus :  Bus<word>;
     
    constructor( data: byte[], addressBus: Bus<word>, ){
        super(0);
        this.addressBus = addressBus;
        this.data = data;
    }

    public override read(): byte {
        const address = this.addressBus.read();
        return this.data[address]
    }

    public write(value: byte){
        this.data[this.addressBus.read()] = value;
    }
}


export { Memory }