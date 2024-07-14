import { Pipe } from "./Pipe";
import { byte } from "./types";



class Register extends Pipe {

    private value : byte;

    constructor(sourcePipes? : Pipe[], name?: string){
        super( name);

        this.value = this.randomValue();
    }

    override read(): number {
       
       this.value = this.readSources() || this.value;

       return this.value;
    }

    public override enableSource(index: number): void {
        this.setSourceEnabled(index, true);
        this.value = this.readSources() || this.value;
    }

    public override disableSource(index: number): void {
        this.value = this.readSources() || this.value;
        this.setSourceEnabled(index, false);
    }
}

export { Register }