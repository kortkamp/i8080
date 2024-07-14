// import {describe, expect, test, beforeEach} from '@jest/globals';
import { FlagCondition } from '../src/ALU';
import { CPU } from '../src/CPU';
import { opcodeCycles } from '../src/Disassembler';
import { RegisterSelector } from '../src/Multiplexer';



describe('Jump Tests', () => {
    

    let memory : number[];
    let cpu: CPU;

    
    beforeEach(() => {
        memory = new Array<number>(0xFFFF).fill(0);
        cpu = new CPU(memory)
    });


    test('test JMP', () => {

        // let cpu = new CPU(memory)

        const opcode = 0xC3; // JMP

        memory[0] = opcode;
        memory[1] = 0x00;
        memory[2] = 0x10;


        cpu.runSteps(opcodeCycles[opcode] + 2); // JMP like instruction need 2 more clock cicles to complete its setup

        expect(cpu.multiplexer.PC).toBe(0x1000 + 1);


    });


    test('test JZ condition not met', () => {

        const opcode = 0xCA; // JZ

        // cpu.alu.setZeroFlag();

        memory[0] = opcode;
        memory[1] = 0x00;
        memory[2] = 0x10;

        expect(cpu.alu.flagTest(FlagCondition.Z)).toBe(false);


        cpu.runSteps(opcodeCycles[opcode] + 2); // JMP like instruction need 2 more clock cicles to complete its setup


        expect(cpu.addressBus.read()).toBe(0x0003);

        expect(cpu.multiplexer.PC).toBe(0x0004);
    });

    test('test JZ condition met', () => {

        const opcode = 0xCA; // JZ

        expect(cpu.alu.flagTest(FlagCondition.Z)).toBe(false);


        cpu.alu.setZeroFlag();

        expect(cpu.alu.flagTest(FlagCondition.Z)).toBe(true);


        memory[0] = opcode;
        memory[1] = 0x00;
        memory[2] = 0x10;

        cpu.runSteps(opcodeCycles[opcode] + 2); // JMP like instruction need 2 more clock cicles to complete its setup

        expect(cpu.addressBus.read()).toBe(0x1000);

        expect(cpu.multiplexer.PC).toBe(0x1000 + 1);
    });
});