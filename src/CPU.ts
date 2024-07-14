import { ALU, ALUOperation, FlagCondition, FlagType } from "./ALU";
import { Bus } from "./Bus";
import { disasm } from "./Disassembler";
import { IExternalBus, IO } from "./IO";
import { Command, InstructionDecoder, Op, instructionName, opcodes, rpTableWZ } from "./InstructionDecoder";
import { CycleType, MachineCycle } from "./MachineCycle";
import { Memory } from "./Memory";
import { DoubleRegisterSelector, Multiplexer, RegisterSelector } from "./Multiplexer";
import { byte, word } from "./types";



// enum Command {
//     PC_OUT          = 0b0000000000000001,
//     HL_OUT          = 0b0000000000000010,
//     SP_OUT          = 0b0000000000000100,
//     // WZ_OUT          = 0b0000000000001000,
//     PC_INC   = 0b0000000000010000,
//     // ADD_LATCH_DEC   = 0b0000000000100000,
//     DATA_IR         = 0b0000000001000000,
//     DATA_DDD        = 0b0000000010000000,
//     SSS_TMP         = 0b0000000100000000,

//     TMP_DDD         = 0b0000001000000000,
//     TMP_DATA        = 0b0000010000000000,
//     DATA_TMP        = 0b0000100000000000,
// }

const commandHandler : Record<Command, (cpu: CPU) => void> = {
    [Command.PC_OUT]   : (cpu: CPU) =>  { cpu.multiplexer.pcOut() },
    [Command.HL_OUT]   : (cpu: CPU) =>  { cpu.multiplexer.hlOut() },
    [Command.SP_OUT]   : (cpu: CPU) =>  { cpu.multiplexer.spOut() },
    [Command.WZ_OUT]   : (cpu: CPU) => { cpu.multiplexer.wzOut() },
    [Command.RP_OUT]   : (cpu: CPU) => { cpu.multiplexer.rpOut(cpu.getRP()) },

    [Command.HL_SP]    : (cpu: CPU) => { cpu.multiplexer.hlsp() },
    [Command.PC_HL]    : (cpu: CPU) => { cpu.multiplexer.pchl() },
    [Command.WZ_HL]    : (cpu: CPU) => { cpu.multiplexer.wzhl() },
    [Command.HLXDE]    : (cpu: CPU) => { cpu.multiplexer.hlxde() },
    [Command.WZ_INC_PC]    : (cpu: CPU) => { cpu.multiplexer.wzIncPc() },

    [Command.PC_INC]   : (cpu: CPU) =>  { cpu.multiplexer.pcIncrement() },
    [Command.SP_INC]   : (cpu: CPU) =>  { cpu.multiplexer.spIncrement() },
    [Command.WZ_INC]   : (cpu: CPU) =>  { cpu.multiplexer.rpIncrement(DoubleRegisterSelector.WZ) },
    [Command.RP_INC]   : (cpu: CPU) =>  { cpu.multiplexer.rpIncrement(cpu.getRP()) },
    [Command.RP_DEC]   : (cpu: CPU) =>  { cpu.multiplexer.rpDecrement(cpu.getRP()) },
    [Command.SP_DEC]   : (cpu: CPU) =>  { cpu.multiplexer.spDecrement() },

    [Command.DATA_IR]  : (cpu: CPU) =>  { cpu.setIR(cpu.dataBus.read()) },
    [Command.DATA_DDD] : (cpu: CPU) =>  { 
        const regIndex = cpu.getDDD();
        if(regIndex === 7) {
            cpu.A =  cpu.dataBus.read();
        }else {
            cpu.multiplexer.write(regIndex, cpu.dataBus.read()) 
        }
    },

    [Command.RH_DATA] : (cpu : CPU) => { cpu.dataBus.write(cpu.multiplexer.read(cpu.getRP() as number as RegisterSelector)) }, 
    [Command.RL_DATA] : (cpu : CPU) => { cpu.dataBus.write(cpu.multiplexer.read(cpu.getRP() + 1)) }, 

    [Command.RH_ACT] : (cpu : CPU) => { cpu.ACT = cpu.multiplexer.read(cpu.getRP() as number as RegisterSelector) }, 
    [Command.RL_ACT] : (cpu : CPU) => { cpu.ACT = cpu.multiplexer.read(cpu.getRP() + 1) }, 

    [Command.SSS_TMP]  : (cpu : CPU) => { 
        let register = cpu.getSSS();

        if(register === 7){
            cpu.TMP = cpu.A;
        }else {
            cpu.TMP = cpu.multiplexer.read(cpu.getSSS());
        }
        
    }, 
    [Command.TMP_DDD]  : (cpu : CPU) => { 
        let register = cpu.getDDD();
        if(register === 7) {
            cpu.A = cpu.TMP;
        } else {
            cpu.multiplexer.write(cpu.getDDD(), cpu.TMP) ;
        }
    }, 
    [Command.TMP_DATA] : (cpu : CPU) => { cpu.dataBus.write(cpu.TMP) }, 
    [Command.FLAG_DATA] : (cpu : CPU) => { cpu.dataBus.write(cpu.alu.getFlags()) }, 
    [Command.PCH_DATA] : (cpu : CPU) => { cpu.dataBus.write(cpu.multiplexer.getPCH()) }, 
    [Command.PCL_DATA] : (cpu : CPU) => { cpu.dataBus.write(cpu.multiplexer.getPCL()) }, 
    [Command.DATA_TMP] : (cpu : CPU) => { cpu.TMP = cpu.dataBus.read()}, 
    [Command.A_DATA]   : (cpu : CPU) => { cpu.dataBus.write(cpu.A) }, 
    [Command.A_ACT]    : (cpu : CPU) => { cpu.ACT = cpu.A }, 
    [Command.DATA_A]   : (cpu : CPU) => { cpu.A = cpu.dataBus.read()}, 
    [Command.DATA_RH]  : (cpu : CPU) => { cpu.multiplexer.write( cpu.getRP() as number , cpu.memory.read())}, 
    [Command.DATA_RL]  : (cpu : CPU) => { cpu.multiplexer.write( cpu.getRP() + 1 , cpu.memory.read())}, 
    [Command.DATA_W]   : (cpu : CPU) => { cpu.multiplexer.write(RegisterSelector.W , cpu.memory.read())}, 
    [Command.DATA_Z]   : (cpu : CPU) => { cpu.multiplexer.write(RegisterSelector.Z , cpu.memory.read())}, 
    [Command.DATA_L]   : (cpu : CPU) => { cpu.multiplexer.write(RegisterSelector.L , cpu.memory.read())}, 
    [Command.DATA_H]   : (cpu : CPU) => { cpu.multiplexer.write(RegisterSelector.H , cpu.memory.read())}, 

    [Command.DATA_FLAG]   : (cpu : CPU) => { cpu.alu.setFlags(cpu.memory.read())}, 

    [Command.ALU_OP]   : (cpu : CPU) => { cpu.ACT = cpu.A ; cpu.TMP = cpu.readRegister(cpu.getSSS())}, 
    [Command.ALU_A]   : (cpu : CPU) => {  }, 

    [Command.JUDGE_COND] : (cpu : CPU) => { cpu.judgeCondition() }, 
    [Command.HALT]        :  (cpu : CPU) => {cpu.haltCpu()},

    [Command.CMA]        :  (cpu : CPU) => { cpu.A ^= 0b11111111; },
    [Command.DAA]        :  (cpu : CPU) => { cpu.A = cpu.alu.daa(cpu.A); },

    [Command.CMC]        :  (cpu : CPU) => { cpu.alu.complementCarryFlag()},
    [Command.STC]        :  (cpu : CPU) => { cpu.alu.setCarryFlag()},

    [Command.ALU_RLC]        :  (cpu : CPU) => { cpu.ACT = cpu.A; cpu.A = cpu.alu.rlc(cpu.ACT) },
    [Command.ALU_RRC]        :  (cpu : CPU) => { cpu.ACT = cpu.A; cpu.A = cpu.alu.rrc(cpu.ACT) },
    [Command.ALU_RAL]        :  (cpu : CPU) => { cpu.ACT = cpu.A; cpu.A = cpu.alu.ral(cpu.ACT) },
    [Command.ALU_RAR]        :  (cpu : CPU) => { cpu.ACT = cpu.A; cpu.A = cpu.alu.rar(cpu.ACT) },



    [Command.DDD_TMP_1_ACT] : (cpu : CPU) => { cpu.TMP = cpu.readRegister(cpu.getDDD()) ; cpu.ACT = 1;},
    [Command.INR_DDD]        :  (cpu : CPU) => { cpu.writeRegister(cpu.getDDD() , cpu.alu.increment(cpu.TMP)) },
    [Command.DCR_DDD]        :  (cpu : CPU) => { cpu.writeRegister(cpu.getDDD() , cpu.alu.decrement(cpu.TMP)) },

    [Command.INR_M]        :  (cpu : CPU) => { cpu.writeRegister(cpu.getDDD() , cpu.alu.increment(cpu.TMP)) },
    [Command.DCR_M]        :  (cpu : CPU) => { cpu.writeRegister(cpu.getDDD() , cpu.alu.decrement(cpu.TMP)) },

    [Command.ALU_INC_DATA]        :  (cpu : CPU) => { cpu.dataBus.write( cpu.alu.increment(cpu.TMP)) },
    [Command.ALU_DEC_DATA]        :  (cpu : CPU) => { cpu.dataBus.write( cpu.alu.decrement(cpu.TMP)) },


    [Command.L_TMP]        :  (cpu : CPU) => { cpu.TMP = cpu.multiplexer.read(RegisterSelector.L) },
    [Command.H_TMP]        :  (cpu : CPU) => { cpu.TMP = cpu.multiplexer.read(RegisterSelector.H) },

    [Command.ZERO_W]        :  (cpu : CPU) => { cpu.multiplexer.write(RegisterSelector.W, 0) },

    [Command.RST_TMP_Z]        :  (cpu : CPU) => { cpu.multiplexer.write(RegisterSelector.Z,  cpu.IR & 0b00111000 ) },

    [Command.L_DATA]        :  (cpu : CPU) => { cpu.dataBus.write(cpu.multiplexer.read(RegisterSelector.L)) },
    [Command.H_DATA]        :  (cpu : CPU) => { cpu.dataBus.write(cpu.multiplexer.read(RegisterSelector.H)) },



    [Command.ALU_ADD_L]        :  (cpu : CPU) => { cpu.multiplexer.write(RegisterSelector.L, cpu.alu.operate(cpu.ACT, cpu.TMP, ALUOperation.ADD) as byte)},
    [Command.ALU_ADC_H]        :  (cpu : CPU) => { cpu.multiplexer.write(RegisterSelector.H, cpu.alu.operate(cpu.ACT, cpu.TMP, ALUOperation.ADC) as byte)},


    [Command.X]        : () => {},
    [Command.NOT_IMP]  : (cpu : CPU) => { throw new Error("Command not implemented: " + cpu.IR.toString(16))},
}

class CPU {
    public A : byte;
    public ACT : byte;
    public TMP : byte;
    public FLAG : byte;
    public IR : byte;

    public IDBUS : Bus<byte>;
    public addressBus : Bus<word>;
    public dataBus : Bus<byte>;

    public memory : Memory;
    public io: IO;

    public multiplexer : Multiplexer;

    public currentCycleIndex : number;
    public currentStateIndex : number;

    private instructionDecoder : InstructionDecoder;

    public alu : ALU;

    private cycles : MachineCycle[];

    private haltMode : boolean;

    public instruction = "";
    public A_REG = "";

    public flagZ = 0;
    public flagC = 0;
    public flagA = 0;

    public SP = "";


    private CycleTypeEffect : Record<CycleType, () => void> = {
        [CycleType.FETCH] : () => {this.dataBus.setSource(this.memory)},
        [CycleType.MEM_READ] : () => {this.dataBus.setSource(this.memory)},
        [CycleType.MEM_WRITE] : () => {this.dataBus.setConsumer(this.memory)},
        [CycleType.STACK_READ] : () => {this.dataBus.setSource(this.memory)},
        [CycleType.STACK_WRITE] : () =>  {this.dataBus.setConsumer(this.memory)},
        [CycleType.INPUT_READ] : () => { this.dataBus.setSource(this.io)},
        [CycleType.OUTPUT_WRITE] : () => { this.dataBus.setConsumer(this.io)},
        [CycleType.INT_ACK] : () => {},
        [CycleType.INT_ACK_HLT] : () => {},
        [CycleType.INTERNAL] : () => {},
    }


    
    constructor(memory : number[ ], externalBus: IExternalBus) {
        this.A = 0;
        this.ACT = 0;
        this.TMP = 0;
        this.FLAG = 0;
        this.IR = 0;
        this.IDBUS =  new Bus<byte>(0);

        this.A_REG = ""

        this.addressBus = new Bus<word>(0);
        
        this.memory = new Memory(memory, this.addressBus);

        this.multiplexer = new Multiplexer(this.addressBus);

        this.instructionDecoder = new InstructionDecoder();

        this.alu = new ALU();

        this.dataBus = new Bus<byte>(0);
        this.io = new IO(this.addressBus, externalBus);

        this.dataBus.setSource(this.memory);
        this.dataBus.setConsumer(this.memory);

        this.currentCycleIndex = 0;
        this.currentStateIndex = 0;
        this.cycles = [MachineCycle.fetchCycle()];

        this.haltMode = false;
    }

    public setIR(instruction : byte){
        this.IR = instruction;

        if(instruction === 0o315){ // CALL 
            let aaa = 1;
        }

        // console.log(`new Fetch: inst: ${instruction.toString(16).padStart(2,'0')} address: ${this.addressBus.read().toString(16).padStart(2,'0')}` )

        this.cycles = this.instructionDecoder.decode(instruction);

        // this.instruction = disasm(this.memory.data, this.addressBus.read());

        if(!this.cycles) {
            throw new Error('Instruction not found: 0x' + instruction.toString(16).padStart(2,'0') + ' at address: 0x' + this.addressBus.read().toString(16).padStart(2,'0') )
        }
   

        return;
    }



    public postJMPM1() : boolean {
        const postJumpTable = [
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,            
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,            
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,            
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            
            1,0,1,2,1,0,0,2,
            1,2,1,2,1,2,0,2,
            1,0,1,0,1,0,0,2,
            1,2,1,0,1,2,0,2,
            1,0,1,0,1,0,0,2,
            1,0,1,0,1,2,0,2,
            1,0,1,0,1,0,0,2,
            1,0,1,0,1,2,0,2,
        ]

        // 1 jump if condition,
        // 2 jump without condition ,
        return postJumpTable[this.IR] === 2 || (postJumpTable[this.IR] === 1 && this.isConditionMet());
    }

    public lazyAluOperation() {
        const lazyAluTable : (0|1|2)[] = [
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,            
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,            
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,
            2,2,2,2,2,2,2,2,
            
            0,0,0,0,0,0,1,0,
            0,0,0,0,0,0,1,0,
            0,0,0,0,0,0,1,0,
            0,0,0,0,0,0,1,0,            
            0,0,0,0,0,0,1,0,
            0,0,0,0,0,0,1,0,
            0,0,0,0,0,0,1,0,
            0,0,0,0,0,0,2,0,
        ]

        const actions = {
            [0]: ()=> {},
            [1]: ()=> { 
                 this.A = this.alu.operate(this.ACT, this.TMP, this.getAluOp()) as byte ;

            },
            [2]: ()=> {
                this.alu.operate(this.ACT, this.TMP, this.getAluOp())
            },
        }

        const index = lazyAluTable[this.IR];
        if(index !== 0) {
            let aaaaa= 1;
        }
        actions[index]();
    }



    public getRP(): DoubleRegisterSelector { 
        if(rpTableWZ[this.IR] === 1){
            return DoubleRegisterSelector.WZ;
        }
        return (this.IR & 0b00110000) >> 3;
    }

    // 0b00DDD000
    public getDDD() : RegisterSelector { 
        return (this.IR & 0b00111000) >> 3;
    }

    // 0b00DDD000
    public getAluOp() : ALUOperation { 
        return (this.IR & 0b00111000) >> 3;
    }

    public getAluResult(operation : ALUOperation){
        const result = this.alu.operate(this.ACT, this.TMP, operation);

        return result !== undefined ? result : this.A;
    }

    public aluResultToA(){
        const op = this.getAluOp();
        const result = this.alu.operate(this.ACT, this.TMP, op);

        this.A = result !== undefined ? result : this.A;
    }

    // 0b00000SSS
    public getSSS() : RegisterSelector {
        return (this.IR & 0b00000111);
    }


    public isConditionMet() {
        let condition = ((this.IR & 0b00111000) >> 3) as FlagCondition;

        return this.alu.flagTest(condition);
    }

    public judgeCondition(){

        let skipCycleOnConditionNotMetM1 = (this.IR & 0b11000111) === 0b11000000 ; //para o cz nao ta funcionando , o skip precisa ser no final do M3

        let isConditionalCallInstruction = (this.IR & 0b11000111) === 0b11000100 ;
        
        if(skipCycleOnConditionNotMetM1 && !this.isConditionMet()){
            this.skipCurrentInstruction();
        }
        
        if(isConditionalCallInstruction && !this.isConditionMet()){
            this.cycles = [        
                MachineCycle.create(CycleType.FETCH, [Command.JUDGE_COND, Command.SP_DEC]),
                MachineCycle.create(CycleType.MEM_READ, [] ,'l' ), 
                MachineCycle.create(CycleType.MEM_READ, [] ,'h' ), 
            ]
        }
        
        if(isConditionalCallInstruction && this.isConditionMet()){
            this.multiplexer.spDecrement();
        }
    }

    public haltCpu() {
        // console.log("cpu halted!!");
        this.haltMode = true;
    }

    public readRegister(register: number): byte {
        if(register === 7){
            return this.A;
        }
        return this.multiplexer.read(register);
    }

    public writeRegister(register: number, value : byte): void {
        if(register === 7){
            this.A  = value;
        }else {
            this.multiplexer.write(register, value);

        }
    }

    public executeCommand(command : Command ) : void {
        commandHandler[command](this)
    }

    public skipCurrentInstruction(){
        this.cycles = [MachineCycle.fetchCycle()];
        this.currentCycleIndex = 0;
        this.currentStateIndex = -1;
    }


    public runSteps(steps: number){
        for(let i = 0; i < steps; i+=1){
            // console.log(this.currentCycleIndex, this.currentStateIndex)
            this.step();
        }
    }   

    public step() : void {

        if(this.haltMode){
            return;
        }

        // this.flagC = this.alu.getFlag(FlagType.CARRY);
        // this.flagZ = this.alu.getFlag(FlagType.ZERO);
        // this.flagA = this.alu.getFlag(FlagType.AUXILIARY_CARRY);
        // this.A_REG = this.A.toString(16).toUpperCase().padStart(2, '0');
        // this.SP = (this.multiplexer.readSP().toString(16).toUpperCase().padStart(4,'0'))

        if(this.currentStateIndex === 1 && this.currentCycleIndex === 0) {
            this.lazyAluOperation();
        }
       
        const currentCycle = this.cycles[this.currentCycleIndex];

        if(this.currentStateIndex === 0) {
            this.CycleTypeEffect[currentCycle.type]();
        }

        const command = this.cycles[this.currentCycleIndex].states[this.currentStateIndex]; 

        this.executeCommand(command);
        
        this.currentStateIndex += 1;

        if(this.currentStateIndex >=  this.cycles[this.currentCycleIndex].states.length){
            this.currentCycleIndex += 1;
            this.currentStateIndex = 0;
        }

        if(this.currentCycleIndex >= this.cycles.length){ 
            // next instruction cycle
            
            if(this.postJMPM1()){
                this.cycles = [new MachineCycle(CycleType.FETCH, [Command.WZ_OUT, Command.WZ_INC_PC, Command.DATA_IR])]
            }else {
                this.cycles = [MachineCycle.create(CycleType.FETCH)];
            }

            this.currentCycleIndex = 0;
            this.currentStateIndex = 0;
        } 

    }
}


export { CPU }