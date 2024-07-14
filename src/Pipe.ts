import { byte } from "./types";

class Source {
    public enabled : boolean;
    public pipe : Pipe;

    constructor(pipe : Pipe){
        this.enabled = false;
        this.pipe = pipe;
    }
}


class Pipe {

    private name: string;
    private sources : Source[]

    constructor(name?: string){
        this.sources = [];
        // if(sourcePipes){
        //     this.sources = sourcePipes.map(sp => new Source(sp));
        // } else {
        // }

        this.name = name || "";
    }

    public addSource(sourcePipe : Pipe) : number{
        this.sources.push(new Source(sourcePipe));

        return this.sources.length - 1;
    }

    public getName() : string {
        return this.name;
    }


    protected readSources() : byte | undefined {
        let source = this.sources.find(s => s.enabled);

        if(source){
            return source.pipe.read();
        }

    }

    public read(): byte{
        return this.readSources() || this.randomValue();
    }

    public setSourceEnabled(index: number, enabled: boolean): void {
        if( index < 0 || index > this.sources.length){
            throw new Error(`source of index: ${index} does not existe`);
        }
        this.sources[index].enabled = enabled;
    }

    public enableSource(index: number){
        this.setSourceEnabled(index, true);
    }

    public disableSource(index: number){
        this.setSourceEnabled(index, false);
    }

    protected randomValue() : byte {
        return Math.floor(Math.random() * 256);
    }

    protected update(){
        
    }
}


export { Pipe }