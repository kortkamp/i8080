// import {describe, expect, test, beforeEach} from '@jest/globals';
import { CPU } from '../src/CPU';
import { opcodeCycles } from '../src/Disassembler';
import { RegisterSelector } from '../src/Multiplexer';



describe('ALU Tests', () => {
    

    let memory : number[];
    let cpu: CPU;

    
    beforeEach(() => {
        memory = new Array<number>(0xFFFF).fill(0);
        cpu = new CPU(memory)
    });


    test('test MVI A, FFh', () => {

        // let cpu = new CPU(memory)
    
        cpu.A = 0;

        const opcode = 0x3E; // MVI A 

        memory[0] = opcode;
        memory[1] = 0xFF;

        cpu.runSteps(opcodeCycles[opcode]);

        expect(cpu.A).toBe(0xFF);

        expect(cpu.currentCycleIndex).toBe(0);
        expect(cpu.currentStateIndex).toBe(0);
    });

    test('test MVI B, FFh', () => {

        // let cpu = new CPU(memory)
    
        cpu.multiplexer.write(RegisterSelector.B, 0);

        const opcode = 0x06; // MVI B

        memory[0] = opcode;
        memory[1] = 0xF1;

        cpu.runSteps(opcodeCycles[opcode]);

        expect(cpu.multiplexer.read(RegisterSelector.B)).toBe(0xF1);

        expect(cpu.currentCycleIndex).toBe(0);
        expect(cpu.currentStateIndex).toBe(0);
    });


    test('test MOV r1, r2', () => {

        // let cpu = new CPU(memory)
    
        cpu.multiplexer.write(RegisterSelector.B, 0);
        cpu.multiplexer.write(RegisterSelector.D, 0xDD);

        const opcode = 0o102; // MOV B, D
        memory[0] = opcode;

        expect(cpu.multiplexer.read(RegisterSelector.B)).toBe(0x0);

        cpu.runSteps(opcodeCycles[opcode]);

        expect(cpu.multiplexer.read(RegisterSelector.B)).toBe(0xDD);

        expect(cpu.currentCycleIndex).toBe(0);
        expect(cpu.currentStateIndex).toBe(0);
    });


    test('test MOV M, r2', () => {

        // let cpu = new CPU(memory)

        const expectedValue = 11;
        const opcode = 0x70; // MOV M, B
    
        memory[0x00] = opcode;
        memory[0x10] = 0x00;

        cpu.multiplexer.write(RegisterSelector.B, expectedValue);

        cpu.multiplexer.write(RegisterSelector.H, 0x00);
        cpu.multiplexer.write(RegisterSelector.L, 0x10);
        
        cpu.runSteps(opcodeCycles[opcode]);

        expect(cpu.multiplexer.read(RegisterSelector.H)).toBe(0x00);
        expect(cpu.multiplexer.read(RegisterSelector.L)).toBe(0x10);
        expect(cpu.multiplexer.read(RegisterSelector.B)).toBe(expectedValue);


        expect( memory[0x10]).toBe(expectedValue);



        expect(cpu.currentCycleIndex).toBe(0);
        expect(cpu.currentStateIndex).toBe(0);
    });

    test('test MOV r1, M', () => {

        // let cpu = new CPU(memory)

        const expectedValue = 11;
        const opcode = 0o106; // MOV B, M
    
        memory[0x00] = opcode;
        memory[0x10] = expectedValue;

        cpu.multiplexer.write(RegisterSelector.B, 0);

        cpu.multiplexer.write(RegisterSelector.H, 0x00);
        cpu.multiplexer.write(RegisterSelector.L, 0x10);
        
        cpu.runSteps(opcodeCycles[opcode]);

        expect(cpu.multiplexer.read(RegisterSelector.H)).toBe(0x00);
        expect(cpu.multiplexer.read(RegisterSelector.L)).toBe(0x10);
        expect(cpu.multiplexer.read(RegisterSelector.B)).toBe(expectedValue);


        expect(memory[0x10]).toBe(expectedValue);



        expect(cpu.currentCycleIndex).toBe(0);
        expect(cpu.currentStateIndex).toBe(0);
    });


    test('test MOV A, r2', () => {

        // let cpu = new CPU(memory)

        const expectedValue = 11;

        cpu.multiplexer.write(RegisterSelector.C, expectedValue);
        const opcode = 0o171; // MOV A, C

        memory[0] = opcode;

        expect(cpu.A).toBe(0);

        cpu.runSteps(opcodeCycles[opcode]);

        expect(cpu.A).toBe(expectedValue);
    
      
    });

    test('test MOV r1, A', () => {

        // let cpu = new CPU(memory)

        const expectedValue = 11;

        cpu.A = expectedValue;

        cpu.multiplexer.write(RegisterSelector.D, 0);

        const opcode = 0o127; // MOV D, A

        memory[0] = opcode;

        expect(cpu.multiplexer.read(RegisterSelector.D)).toBe(0);

        cpu.runSteps(opcodeCycles[opcode]);

        expect(cpu.A).toBe(expectedValue);

        expect(cpu.multiplexer.read(RegisterSelector.D)).toBe(expectedValue);

    });

});