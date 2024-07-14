// import {describe, expect, test, beforeEach} from '@jest/globals';
import { CPU } from '../src/CPU';
import { opcodeCycles } from '../src/Disassembler';
import { RegisterSelector } from '../src/Multiplexer';



describe('Stack Tests', () => {
    

    let memory : number[];
    let cpu: CPU;

    
    beforeEach(() => {
        memory = new Array<number>(0xFFFF).fill(0);
        cpu = new CPU(memory)
    });


    test('test PUSH', () => {

        // let cpu = new CPU(memory)

        cpu.multiplexer.write(RegisterSelector.B, 0x12);
        cpu.multiplexer.write(RegisterSelector.C, 0x34);


        cpu.multiplexer.write(RegisterSelector.S, 0x20);
        cpu.multiplexer.write(RegisterSelector.P, 0x00);
    

        const opcode = 0xC5; // PUSH B

        memory[0] = opcode;

        cpu.runSteps(opcodeCycles[opcode]);

        expect(memory[0x1FFF]).toBe(0x12);
        expect(memory[0x1FFE]).toBe(0x34);


        expect(cpu.multiplexer.read(RegisterSelector.S)).toBe(0x1F);
        expect(cpu.multiplexer.read(RegisterSelector.P)).toBe(0xFE);

    });

    test('test POP', () => {

        // let cpu = new CPU(memory)

        cpu.multiplexer.write(RegisterSelector.B, 0x00);
        cpu.multiplexer.write(RegisterSelector.C, 0x00);


        cpu.multiplexer.write(RegisterSelector.S, 0x1F);
        cpu.multiplexer.write(RegisterSelector.P, 0xFE);

        memory[0x1FFF] = 0x12;
        memory[0x1FFE] = 0x34;
    
        const opcode = 0xC1; // POP B

        memory[0] = opcode;

        cpu.runSteps(opcodeCycles[opcode]);

        expect(memory[0x1FFF]).toBe(0x12);
        expect(memory[0x1FFE]).toBe(0x34);

        expect(cpu.multiplexer.read(RegisterSelector.B)).toBe(0x12);
        expect(cpu.multiplexer.read(RegisterSelector.C)).toBe(0x34);

        expect(cpu.multiplexer.read(RegisterSelector.S)).toBe(0x20);
        expect(cpu.multiplexer.read(RegisterSelector.P)).toBe(0x00);

    });


    test('test PUSH POP', () => {

        // let cpu = new CPU(memory)

        cpu.multiplexer.write(RegisterSelector.B, 0x12);
        cpu.multiplexer.write(RegisterSelector.C, 0x34);

        cpu.multiplexer.write(RegisterSelector.D, 0x00);
        cpu.multiplexer.write(RegisterSelector.E, 0x00);


        cpu.multiplexer.write(RegisterSelector.S, 0x20);
        cpu.multiplexer.write(RegisterSelector.P, 0x00);

        expect(cpu.multiplexer.read(RegisterSelector.D)).toBe(0x00);
        expect(cpu.multiplexer.read(RegisterSelector.E)).toBe(0x00);
    

        const opcode1 = 0xC5; // PUSH B
        const opcode2 = 0xD1  // POP  D

        memory[0] = opcode1;
        memory[1] = opcode2;

        cpu.runSteps(opcodeCycles[opcode1]);
        cpu.runSteps(opcodeCycles[opcode2]);


        expect(cpu.multiplexer.read(RegisterSelector.S)).toBe(0x20);
        expect(cpu.multiplexer.read(RegisterSelector.P)).toBe(0x00);

        
        expect(cpu.multiplexer.read(RegisterSelector.D)).toBe(0x12);
        expect(cpu.multiplexer.read(RegisterSelector.E)).toBe(0x34);

    });

});