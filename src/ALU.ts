import { Bit, Byte } from "./Numerics";
import { bit, byte } from "./types";

enum FlagType {
    CARRY = 0,
    NOT_USED_1 = 1,
    PARITY = 2,
    NOT_USED_3 = 3,
    AUXILIARY_CARRY = 4,
    NOT_USED_5 = 5,
    ZERO = 6,
    SIGN = 7
}

enum ALUOperation {

    //0x01oooppp
    ADD = 0,// 000
    ADC = 1,// 001
    SUB = 2,// 010
    SBB = 3,// 011
    ANA = 4,// 100
    XRA = 5,// 101
    ORA = 6,// 110
    CMP = 7,// 111

}

enum FlagCondition {
    NZ = 0, 
    Z  = 1,
    NC = 2,
    C  = 3,
    PO = 4,
    PE = 5,
    P  = 6,
    M  = 7,
}

enum FlagConditionSelector {
    Z = 0,
    C = 1,
    P = 2,
    S = 3,
}

const flagCondToFlagType = {
    [FlagConditionSelector.Z] : FlagType.ZERO,
    [FlagConditionSelector.C] : FlagType.CARRY,
    [FlagConditionSelector.P] : FlagType.PARITY,
    [FlagConditionSelector.S] : FlagType.SIGN,
}

const operationHandler : Record<ALUOperation, (act: byte, tmp: byte, cy : bit ) => byte> = {
    [ALUOperation.ADD] : (act: byte, tmp: byte, cy : bit ) => act + tmp,
    [ALUOperation.ADC] : (act: byte, tmp: byte, cy : bit ) => act + tmp + cy,
    [ALUOperation.SUB] : (act: byte, tmp: byte, cy : bit ) => act + (~tmp + 1),
    [ALUOperation.SBB] : (act: byte, tmp: byte, cy : bit ) => act + (~(tmp + cy) + 1),
    [ALUOperation.ANA] : (act: byte, tmp: byte, cy : bit ) => act & tmp,
    [ALUOperation.XRA] : (act: byte, tmp: byte, cy : bit ) => act ^ tmp,
    [ALUOperation.ORA] : (act: byte, tmp: byte, cy : bit ) => act | tmp,
    [ALUOperation.CMP] : (act: byte, tmp: byte, cy : bit ) => act - tmp,
}



class ALU {
    private flags: bit[];

    private lastOperation9thBit : bit;

    constructor(){
        this.flags = new Array(0); 
        this.flags[FlagType.NOT_USED_1] = 1;
        this.flags[FlagType.NOT_USED_3] = 0;
        this.flags[FlagType.NOT_USED_5] = 0;

        this.lastOperation9thBit = 0;
    }

    private getBitAt(value: byte, position: number) : Bit{
        return ((value >> position) & 0b00000001) as Bit;
    }

    private parity(value : byte ) : Bit{
        return [0,1,2,3,4,5,6,7].reduce((total, index) => this.getBitAt(value, index) ^ total, 1) as Bit;
    }

    public flagTest(condition: FlagCondition) {
        let expectedConditionValue = condition & 1;
        // console.log("expectedConditionValue ", expectedConditionValue);
        let conditionIndex = (condition & 0b110) >> 1 as FlagConditionSelector;
         
        // console.log("conditionIndex ", conditionIndex);


        let flag = this.getFlag(flagCondToFlagType[conditionIndex]);

        // console.log("flag ", flag);


        return flag === expectedConditionValue;
    }

    public getFlag(type: FlagType) {
        return this.flags[type];
    }

    private calculateCarry(): void {
        this.flags[FlagType.CARRY] = this.lastOperation9thBit;
    }

    private limitToByte(value : number) : byte {
        this.lastOperation9thBit = ((value >> 8) & 1) as bit;
        return value & 0xFF;
    }

    private calculateGeneralFlags(act: byte, tmp: byte, result: byte, operation: ALUOperation ) {

        this.flags[FlagType.SIGN] = this.getBitAt(result, 7);
        this.flags[FlagType.ZERO] = (result & 0xff) === 0 ? 1 : 0;
        this.flags[FlagType.NOT_USED_5] = 0;
        this.flags[FlagType.AUXILIARY_CARRY] = 
            (operation & 0b10) === 0b00  // add
                ?(act&0b1000) !== 0 && (tmp&0b1000) !==0  ? 1 : 0  
                :(act&0b1000) === 0 && (tmp&0b1000) !==0  ? 1 : 0  
        this.flags[FlagType.NOT_USED_3] = 0;
        this.flags[FlagType.PARITY] =  this.parity(result);
        this.flags[FlagType.NOT_USED_1] = 1; 
        // this.flags[FlagType.CARRY] = carry;
    }

    public setCarryFlag() {
        this.flags[FlagType.CARRY] = 1;
    }

    public setZeroFlag() {
        this.flags[FlagType.ZERO] = 1;
    }

    public complementCarryFlag() {
        this.flags[FlagType.CARRY] ^= 1;
    }

    public rotateRight(act: byte, useCarry: boolean ) : byte {
        let result = act >> 1;
        if(useCarry) {
            result += this.flags[FlagType.CARRY] * 128;
        }

        return result;
    }

    /**
     * 
     *      RRC
            uint8_t x = state->a;
            state-> a = ((x & 1) << 7 | (x >> 1));
            state->cc.cy = ((x & 1) == 1);


            RAR
            uint8_t x = state->a;
            state-> a = ((state->cc.cy << 7) | (x >> 1));
            state->cc.cy = ((x & 1) == 1);

            RLC 
            uint8_t x = state->a;
            state-> a = ((x << 1) | (x & 0x80) >> 7);
            state->cc.cy = ((x & 0x80) == 0x80);

            RAL

            uint8_t x = state->a;
            state-> a = ((x << 1) | state->cc.cy);
            state->cc.cy = ((x & 0x80) == 0x80);
     */
    public ral(act: byte) {

        // console.log('ral' , act.toString(16))


        let msbit =  (act & 0x80) >> 7

        const cy = this.flags[FlagType.CARRY];

        this.flags[FlagType.CARRY] = msbit as bit


        let result = act << 1
        result = result & 0xfe;
        result = result | cy;

        // console.log('ral' , result.toString(16))


        return result;
    }

    public rlc(act: byte){
        const cy = this.flags[FlagType.CARRY];

        let msbit =  (act & 0x80) >> 7

        this.flags[FlagType.CARRY] =  msbit as bit

        return ((act << 1) | msbit) & 0xff
    }

    

    public rrc(act: byte): byte {
        this.flags[FlagType.CARRY] = (act & 1) as bit;
        return ((act & 1) << 7 | (act >> 1));
    }

    public daa(regA : byte): byte {

        // console.log("aux carry: " , this.getFlag(FlagType.AUXILIARY_CARRY));

        
        let diff = 0;
        // console.log(diff.toString(16))
        
        if((regA & 0x0F) > 9 || this.getFlag(FlagType.AUXILIARY_CARRY) === 1){
            diff += 6;
        }

        // this.flags[FlagType.AUXILIARY_CARRY] =  
        //     (diff &0b1000) !== 0 && (6 & 0b1000) !==0  ? 1 : 0  
       

        // console.log(diff.toString(16))

        let c = this.getFlag(FlagType.CARRY);

        if((regA & 0xF0 ) > 0x90 || this.getFlag(FlagType.CARRY) === 1 || ((regA & 0xF0) === 0x90  && (regA & 0x0F) > 9 )  ){
            diff += 0x60;
            c = 1
        }



        // this.flags[FlagType.CARRY] =  (diff &0x100) === 0x100 ? 1 : 0;

        // console.log(diff.toString(16))


        // precisa calcular os flags

        let result = regA + diff;

        result = this.limitToByte(result);

        this.calculateCarry();

        let value = this.operate(regA, diff, ALUOperation.ADD);

        this.flags[FlagType.CARRY] = c;

        return value
    }

    
    public rar(act: byte): byte {

        let lsbit = act & 0x01;
        const cy = this.flags[FlagType.CARRY];
        this.flags[FlagType.CARRY] = lsbit as bit;

        return ((cy << 7) | (act >> 1));
    }


    public rotateLeft(act: byte, useCarry: boolean ) : byte {
        let result = act << 1;

        result = this.limitToByte(result);

        if(useCarry) {
            this.flags[FlagType.CARRY] = (act & 0b1000000 ) >> 7 as bit;
        }

        return result;
    }

    public operate(act: byte, tmp: byte, operation : ALUOperation) {

        let result : byte |  undefined = operationHandler[operation](act, tmp, this.flags[FlagType.CARRY]);


        result = this.limitToByte(result);

        this.calculateCarry();

        this.calculateGeneralFlags(act, tmp, result, operation);

        // if(operation === ALUOperation.CMP){
        //     result = undefined;
        // }

        return result;
    }

    public increment(tmp: byte){
        let result = tmp + 1

        result = this.limitToByte(result);
        this.calculateGeneralFlags(1, tmp, result, ALUOperation.ADD);

        return result;
    }

    public decrement(tmp: byte){
        let result = tmp +  (~1 + 1)

        result = this.limitToByte(result);
        this.calculateGeneralFlags(1, tmp, result, ALUOperation.SUB);

        return result;
    }


    public getFlags() : byte {
        let resultFlags = 0;

        resultFlags += this.flags[FlagType.SIGN]            << 7;
        resultFlags += this.flags[FlagType.ZERO]            << 6;
        resultFlags += this.flags[FlagType.NOT_USED_5]      << 5;
        resultFlags += this.flags[FlagType.AUXILIARY_CARRY] << 4;
        resultFlags += this.flags[FlagType.NOT_USED_3]      << 3;
        resultFlags += this.flags[FlagType.PARITY]          << 2;
        resultFlags += this.flags[FlagType.NOT_USED_1]      << 1;
        resultFlags += this.flags[FlagType.CARRY]           << 0;

        return resultFlags;
    }

    public setFlags(flags: byte): void{
        for(let i = 0 ; i < 8 ; i += 1){
            this.flags[i] = ((flags >> i) & 1) as bit;
        }
    }
}



export { ALU , ALUOperation , FlagCondition , FlagType}