import { Command } from "./InstructionDecoder";

enum States {
    T1 = 0,
    T2 = 1,
    T3 = 2,
    T4 = 3,
    T5 = 4,
}


enum Cycle {
    M1 = 0,
    M2 = 1,
    M3 = 2,
    M4 = 3,
    M5 = 4,
}

enum CycleType {
    FETCH,
    MEM_READ,
    MEM_WRITE,
    STACK_READ,
    STACK_WRITE,
    INPUT_READ,
    OUTPUT_WRITE,
    INT_ACK,
    INT_ACK_HLT,
    INTERNAL,
}

enum CycleFull {
    FETCH,
    MEM_READ_I,
    MEM_READ_REG_REF,
}



class MachineCycle {
    
    public states : Command[]

    public type: CycleType;

    constructor(type: CycleType, states? : Command[]){
        this.type = type;
        this.states = []
        states?.forEach(s => 
            this.states.push(s)
        )
    }

    public addState(state : Command){
        this.states.push(state);
    }

    public static fetchCycle(){
        const machineCycle =  new MachineCycle(CycleType.FETCH);
        
        machineCycle.addState(Command.PC_OUT);
        machineCycle.addState(Command.PC_INC);
        machineCycle.addState(Command.DATA_IR);

        return machineCycle;
    }

    public static create(type : CycleType , aditionalCommands : Command[] = [], registerEndian : 'h'|'l' = 'h') : MachineCycle {
        switch(type){
            case CycleType.FETCH:
                return  new MachineCycle(CycleType.FETCH, [Command.PC_OUT, Command.PC_INC, Command.DATA_IR, ...aditionalCommands]);
            case CycleType.MEM_READ: 
                return  new MachineCycle(CycleType.MEM_READ, [Command.PC_OUT, Command.PC_INC, registerEndian === 'h'  ? Command.DATA_RH : Command.DATA_RL]);
            case CycleType.MEM_WRITE:
                return  new MachineCycle(CycleType.MEM_WRITE, [Command.PC_OUT, Command.X, Command.TMP_DATA]);
            case CycleType.STACK_READ:
                return  new MachineCycle(CycleType.STACK_READ, [Command.SP_OUT, Command.SP_INC, registerEndian === 'h'  ? Command.DATA_RH : Command.DATA_RL]);
            case CycleType.STACK_WRITE:
                return  new MachineCycle(CycleType.STACK_READ, [Command.SP_OUT, Command.SP_DEC, Command.X]);     
            case CycleType.INPUT_READ:
                return  new MachineCycle(CycleType.INPUT_READ, [Command.WZ_OUT, Command.X, Command.DATA_A]);
            case CycleType.OUTPUT_WRITE:
                return  new MachineCycle(CycleType.OUTPUT_WRITE, [Command.WZ_OUT, Command.X, Command.A_DATA]);     
            
            case CycleType.INT_ACK: 
                return  new MachineCycle(CycleType.INT_ACK, aditionalCommands);   
            case CycleType.INT_ACK_HLT: 
                return  new MachineCycle(CycleType.INT_ACK_HLT, aditionalCommands);   


            case CycleType.INTERNAL: 
                return  new MachineCycle(CycleType.INTERNAL, aditionalCommands);  
        }

    }

}



export { MachineCycle, States , Cycle, CycleType }