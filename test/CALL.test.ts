// import {describe, expect, test, beforeEach} from '@jest/globals';
import { FlagCondition } from '../src/ALU';
import { CPU } from '../src/CPU';
import { opcodeCycles } from '../src/Disassembler';
import { RegisterSelector } from '../src/Multiplexer';



describe('CALL / RET  Tests', () => {
    

    let memory : number[];
    let cpu: CPU;

    
    beforeEach(() => {
        memory = new Array<number>(0xFFFF).fill(0);
        cpu = new CPU(memory)
    });



    //(SP-1) <- PCh;(SP-2) <- PCl; SP <- SP - 2;PC <- address

    test('test CALL', () => {

        // let cpu = new CPU(memory)

        cpu.multiplexer.write(RegisterSelector.S, 0x20);
        cpu.multiplexer.write(RegisterSelector.P, 0x00);

        const opcode = 0xCD; // CALL

        memory[0] = opcode;
        memory[1] = 0x00;
        memory[2] = 0x10;

        cpu.runSteps(opcodeCycles[opcode] + 2); // JMP like instruction need 2 more clock cicles to complete its setup

        expect(cpu.addressBus.read()).toBe(0x1000);

        expect(cpu.multiplexer.PC).toBe(0x1000 + 1);

        expect(cpu.multiplexer.read(RegisterSelector.S)).toBe(0x1F);
        expect(cpu.multiplexer.read(RegisterSelector.P)).toBe(0xFE);

        expect(memory[0x1FFF]).toBe(0);
        expect(memory[0x1FFE]).toBe(3);

    });

    test('test CZ on condition met', () => {

        // let cpu = new CPU(memory)

        cpu.multiplexer.write(RegisterSelector.S, 0x20);
        cpu.multiplexer.write(RegisterSelector.P, 0x00);

        cpu.alu.setZeroFlag();

        const opcode = 0xCC; // CZ

        memory[0] = opcode;
        memory[1] = 0x00;
        memory[2] = 0x10;

        cpu.runSteps(17 + 2); // JMP like instruction need 2 more clock cicles to complete its setup

        expect(cpu.addressBus.read()).toBe(0x1000);

        expect(cpu.multiplexer.PC).toBe(0x1000 + 1);

        expect(cpu.multiplexer.read(RegisterSelector.S)).toBe(0x1F);
        expect(cpu.multiplexer.read(RegisterSelector.P)).toBe(0xFE);

        expect(memory[0x1FFF]).toBe(0);
        expect(memory[0x1FFE]).toBe(3);

    });


    test('test CZ on condition not met', () => {

        // let cpu = new CPU(memory)

        cpu.multiplexer.write(RegisterSelector.S, 0x20);
        cpu.multiplexer.write(RegisterSelector.P, 0x00);

        expect(cpu.alu.flagTest(FlagCondition.Z)).toBe(false);

        const opcode = 0xCC; // CZ

        memory[0] = opcode;
        memory[1] = 0x00;
        memory[2] = 0x10;

        cpu.runSteps(11); // JMP like instruction need 2 more clock cicles to complete its setup

        expect(cpu.addressBus.read()).toBe(0x0002);

        expect(cpu.multiplexer.PC).toBe(0x0003);

        expect(cpu.multiplexer.read(RegisterSelector.S)).toBe(0x20);
        expect(cpu.multiplexer.read(RegisterSelector.P)).toBe(0x00);

        expect(memory[0x1FFF]).toBe(0);
        expect(memory[0x1FFE]).toBe(0);

        expect(cpu.currentCycleIndex).toBe(0);
        expect(cpu.currentStateIndex).toBe(0);

    });

    test('test CALL RET', () => {

        // let cpu = new CPU(memory)

        cpu.multiplexer.write(RegisterSelector.S, 0x20);
        cpu.multiplexer.write(RegisterSelector.P, 0x00);

        const CALL = 0xCD; // CALL
        const RET = 0xC9; // RET

        memory[0] = CALL;
        memory[1] = 0x00;
        memory[2] = 0x10;

        memory[0x1000] = RET;


        cpu.runSteps(17); //for CALL
        cpu.runSteps(10); //for RET
        cpu.runSteps(2); // two more cuz ret is JMP like instruction and need 2 extra cycles for completion
        

        expect(cpu.addressBus.read()).toBe(0x0003);

        expect(cpu.multiplexer.PC).toBe(0x0004);

        expect(cpu.multiplexer.read(RegisterSelector.S)).toBe(0x20);
        expect(cpu.multiplexer.read(RegisterSelector.P)).toBe(0x00);

        expect(memory[0x1FFF]).toBe(0);
        expect(memory[0x1FFE]).toBe(3);

        expect(cpu.currentCycleIndex).toBe(0);
        expect(cpu.currentStateIndex).toBe(2);

    });

    test('test CALL RZ on condition met', () => {

        // let cpu = new CPU(memory)

        cpu.multiplexer.write(RegisterSelector.S, 0x20);
        cpu.multiplexer.write(RegisterSelector.P, 0x00);


        cpu.alu.setZeroFlag();


        expect(cpu.alu.flagTest(FlagCondition.Z)).toBe(true);

        const CALL = 0xCD; // CALL
        const RET = 0xC8; // RZ

        memory[0] = CALL;
        memory[1] = 0x00;
        memory[2] = 0x10;

        memory[0x1000] = RET;


        cpu.runSteps(17); //for CALL
        cpu.runSteps(11); //for RET
        cpu.runSteps(2); // two more cuz ret is JMP like instruction and need 2 extra cycles for completion
        

        expect(cpu.addressBus.read()).toBe(0x0003);

        expect(cpu.multiplexer.PC).toBe(0x0004);

        expect(cpu.multiplexer.read(RegisterSelector.S)).toBe(0x20);
        expect(cpu.multiplexer.read(RegisterSelector.P)).toBe(0x00);

        expect(memory[0x1FFF]).toBe(0);
        expect(memory[0x1FFE]).toBe(3);

        expect(cpu.currentCycleIndex).toBe(0);
        expect(cpu.currentStateIndex).toBe(2);

    });


    test('test CALL RZ on condition not met', () => {

        // let cpu = new CPU(memory)

        cpu.multiplexer.write(RegisterSelector.S, 0x20);
        cpu.multiplexer.write(RegisterSelector.P, 0x00);


        expect(cpu.alu.flagTest(FlagCondition.Z)).toBe(false);

        const CALL = 0xCD; // CALL
        const RET = 0xC8; // RZ

        memory[0] = CALL;
        memory[1] = 0x00;
        memory[2] = 0x10;

        memory[0x1000] = RET;


        cpu.runSteps(17); //for CALL
        cpu.runSteps(5); //for RET
        // cpu.runSteps(2); // two more cuz ret is JMP like instruction and need 2 extra cycles for completion

        expect(cpu.addressBus.read()).toBe(0x1000);

        expect(cpu.multiplexer.PC).toBe(0x1001);

        expect(cpu.multiplexer.read(RegisterSelector.S)).toBe(0x1F);
        expect(cpu.multiplexer.read(RegisterSelector.P)).toBe(0xFE);

        expect(memory[0x1FFF]).toBe(0);
        expect(memory[0x1FFE]).toBe(3);

        expect(cpu.currentCycleIndex).toBe(0);
        expect(cpu.currentStateIndex).toBe(0);

    });


});