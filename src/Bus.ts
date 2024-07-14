class Bus <T> {
    
    private value: T; 
    private sourceBus: Bus<T> | null;
    private consumerBus : Bus<T> | null;

    constructor (initialiValue : T, source? : Bus<T>, consumer ? : Bus<T> ) {
        this.value = initialiValue; 
        this.sourceBus  = source || null;
        this.consumerBus = consumer || null;
    }

    public setSource( source : Bus<T>){
        this.sourceBus = source;
    }

    public resetSource() {
        this.sourceBus = null;
    }

    public setConsumer( Consumer : Bus<T>){
        this.consumerBus = Consumer;
    }

    public resetConsumer() {
        this.consumerBus = null;
    }

    public read() : T {
        if(this.sourceBus){
            return this.sourceBus.read();
        }
        return this.value;
    }

    public write(value :  T) : void {
        if(this.consumerBus){
            this.consumerBus.write(value);
        }
        this.value = value;
    }

    // precisa definir um destino tambem além de source de modo que quando escrever em dataBus , escreva em memória

}

export { Bus }