// import {describe, expect, test, beforeEach} from '@jest/globals';
import { FlagCondition } from '../src/ALU';
import { CPU } from '../src/CPU';
import { opcodeCycles } from '../src/Disassembler';
import { RegisterSelector } from '../src/Multiplexer';



describe('MATH Tests', () => {
    

    let memory : number[];
    let cpu: CPU;

    
    beforeEach(() => {
        memory = new Array<number>(0xFFFF).fill(0);
        cpu = new CPU(memory)
    });




    test('test SUI', () => {

        // let cpu = new CPU(memory)

        cpu.multiplexer.write(RegisterSelector.S, 0x20);
        cpu.multiplexer.write(RegisterSelector.P, 0x00);

        cpu.A = 0x0B;

        const opcode = 0xD6; // SUI

        memory[0] = opcode;
        memory[1] = 0x0C;

        memory[2] = opcode;
        memory[3] = 0x0F;

        cpu.runSteps(opcodeCycles[opcode]); // JMP like instruction need 2 more clock cicles to complete its setup

        cpu.runSteps(opcodeCycles[opcode] + 2); // JMP like instruction need 2 more clock cicles to complete its setup
        expect(cpu.A).toBe(0xF0)

    });



    test('test ACI', () => {

        // let cpu = new CPU(memory)

        cpu.multiplexer.write(RegisterSelector.S, 0x20);
        cpu.multiplexer.write(RegisterSelector.P, 0x00);

        cpu.A = 0xF5;

        cpu.alu.setCarryFlag();



        const opcode = 0xCE; // ACI

        memory[0] = opcode;
        memory[1] = 0x0A;

        memory[2] = opcode;
        memory[3] = 0x0A;

        cpu.runSteps(opcodeCycles[opcode]); // JMP like instruction need 2 more clock cicles to complete its setup

        cpu.runSteps(opcodeCycles[opcode] + 2); // JMP like instruction need 2 more clock cicles to complete its setup

        expect(cpu.A).toBe(0x0B)

    });


    test('test DAA', () => {

        // let cpu = new CPU(memory)
        const load = (content: string , address: number) => {
            content.match(/.{1,2}/g)?.forEach((b, i) => memory[i + address] = parseInt(b, 16));
        }
        

        cpu.A = 0x88;

        let code = '3E888727'

        load(code, 0);

        cpu.runSteps(opcodeCycles[0x3e]); 
        cpu.runSteps(opcodeCycles[0x87]); 
        cpu.runSteps(opcodeCycles[0x27]); 

        expect(cpu.A).toBe(0x76)

    });

});