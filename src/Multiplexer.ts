import { Bus } from "./Bus";
import { byte, word } from "./types";

enum RegisterSelector {
    B = 0,
    C = 1,
    D = 2,
    E = 3,
    H = 4,
    L = 5,
    S = 6,
    P = 7,
    W = 8,
    Z = 9,
} 

enum DoubleRegisterSelector {
    BC = 0,
    DE = 2,
    HL = 4,
    SP = 6,
    WZ = 8,
} 




class Multiplexer {

    private singleRegisters : byte[]
    // private doubleRegisters : word[]

    private B : byte;
    private C : byte;
    private D : byte;
    private E : byte;
    private H : byte;
    private L : byte;
    private S : byte;
    private P : byte;
    private W : byte;
    private Z : byte;

    public PC : word;
    private addressBus: Bus<word>;

    private registerSelector: RegisterSelector;

    constructor(addressBus: Bus<word>){
        this.singleRegisters = new Array(10).fill(0); 

        this.B = 0;
        this.C = 0;
        this.D = 0;
        this.E = 0;
        this.H = 0;
        this.L = 0;
        this.S = 0;
        this.P = 0;
        this.W = 0;
        this.Z = 0;

        this.PC = 0;

        this.addressBus = addressBus;

        this.registerSelector = RegisterSelector.B;
    }

    public selectRegister(registerSelector : RegisterSelector){
        this.registerSelector = registerSelector;
    }

    public write(registerSelector : RegisterSelector, value : byte) : void {
        // this.registerSelector = registerSelector;
        this.singleRegisters[registerSelector] = value;
    }

    public read(registerSelector : RegisterSelector) : byte {
        this.registerSelector = registerSelector;
        return this.singleRegisters[registerSelector];
    }

    public pcOut(){
        this.addressBus.write(this.PC);
    }

    public hlOut(){
        this.addressBus.write(this.singleRegisters[RegisterSelector.H] * 0x100 + this.singleRegisters[RegisterSelector.L]);
    }

    public spOut(){
        this.addressBus.write(this.singleRegisters[RegisterSelector.S] * 0x100 + this.singleRegisters[RegisterSelector.P]);
    }

    public wzOut(){
        this.addressBus.write(this.singleRegisters[RegisterSelector.W] * 0x100 + this.singleRegisters[RegisterSelector.Z]);
    }

    public hlsp(){
        this.singleRegisters[RegisterSelector.S] = this.singleRegisters[RegisterSelector.H];
        this.singleRegisters[RegisterSelector.P] = this.singleRegisters[RegisterSelector.L];
    }

    public wzhl(){
        this.singleRegisters[RegisterSelector.H] = this.singleRegisters[RegisterSelector.W];
        this.singleRegisters[RegisterSelector.L] = this.singleRegisters[RegisterSelector.Z];
    }


    public pchl(){
        this.PC = this.singleRegisters[RegisterSelector.H] * 0x100 + this.singleRegisters[RegisterSelector.L];
    }

    public readSP() {
        return  this.singleRegisters[RegisterSelector.S] * 0x100 + this.singleRegisters[RegisterSelector.P];
    }

    public hlxde(){
        const hb = this.singleRegisters[RegisterSelector.D];
        this.singleRegisters[RegisterSelector.D] = this.singleRegisters[RegisterSelector.H];
        this.singleRegisters[RegisterSelector.H] = hb;

        const lb = this.singleRegisters[RegisterSelector.E];
        this.singleRegisters[RegisterSelector.E] = this.singleRegisters[RegisterSelector.L];
        this.singleRegisters[RegisterSelector.L] = lb;
    }
    
    public rpOut(rp : DoubleRegisterSelector){
        this.addressBus.write(this.singleRegisters[rp] * 0x100 + this.singleRegisters[rp + 1]);
    }

    public pcIncrement() {
        this.PC = (this.PC + 1) & 0xFFFF; 
    }

    public wzIncPc(){
        this.PC = (this.singleRegisters[RegisterSelector.W] * 0x100 + this.singleRegisters[RegisterSelector.Z]) + 1
    }
    
    private rpLowByte(rp : DoubleRegisterSelector): RegisterSelector{
        return rp + 1;
    }

    private rpHighByte(rp : DoubleRegisterSelector): RegisterSelector{
        return rp as number as RegisterSelector;
    }

    public getPCH(){
        return this.PC >> 8;
    }

    public getPCL(){
        return this.PC & 0xFF;
    }

    public rpIncrement(rp : DoubleRegisterSelector) {
        let v1 = this.singleRegisters[this.rpHighByte(rp)] << 8
        let v2 = this.singleRegisters[this.rpLowByte(rp)]
        let value =  v1 + v2

        value =  (value + 1) & 0xFFFF;

        this.singleRegisters[this.rpHighByte(rp)] = value >> 8;
        this.singleRegisters[this.rpLowByte(rp)] = value & 0xFF;
    } 

    public rpDecrement(rp : DoubleRegisterSelector) {
        // let value = this.singleRegisters[this.rpHighByte(rp)] << 8 + this.singleRegisters[this.rpLowByte(rp)]

        let highValue = this.singleRegisters[this.rpHighByte(rp)] << 8
        let lowValue = this.singleRegisters[this.rpLowByte(rp)]

        let value = highValue + lowValue;

        value -= 1;

        if(value < 0 ){
            value = 0;
        }

        this.singleRegisters[this.rpHighByte(rp)] = value >> 8;
        this.singleRegisters[this.rpLowByte(rp)] = value & 0xFF;
    } 

    public spIncrement() {
        this.rpIncrement(DoubleRegisterSelector.SP);
    }

    public spDecrement() {
       this.rpDecrement(DoubleRegisterSelector.SP);
    }

}



export { Multiplexer , RegisterSelector , DoubleRegisterSelector}