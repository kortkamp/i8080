// import {describe, expect, test, beforeEach} from '@jest/globals';
import { ALU, ALUOperation, FlagCondition } from '../src/ALU';
import { byte } from '../src/types';

describe('ALU Tests', () => {
    
    let alu = new ALU();
    let act : byte;
    let tmp : byte;

    beforeEach(() => {
        alu = new ALU();
    });

    test('Store Load Flags', () => {
        const flags = 0b10000011;

        alu.setFlags(flags);

        expect(alu.getFlags()).toBe(flags);
    })
  
    test('test ADD', () => {
    
        const act = 3;
        const tmp = 2;

        const result = alu.operate(act, tmp, ALUOperation.ADD)
        expect(result).toBe(5);
    });

    test('test ADC', () => {
        const act = 3;
        const tmp = 2;
        alu.setFlags(0b00000010);

        expect(alu.operate(act, tmp, ALUOperation.ADC)).toBe(5);

        alu.setFlags(0b00000011);
        expect(alu.operate(act, tmp, ALUOperation.ADC)).toBe(6);
    });

    test('test SUB', () => {
        const act = 3;
        const tmp = 2;

        expect(alu.operate(act, tmp, ALUOperation.SUB)).toBe(1);

    });

    test('test SUB', () => {
        const act = 3;
        const tmp = 5;

        expect(alu.operate(act, tmp, ALUOperation.SUB)).toBe(((~2) & 0xff)  + 1);

    });

    test('test ADC', () => {
        const act = 3;
        const tmp = 2;
        alu.setFlags(0b00000010);

        expect(alu.operate(act, tmp, ALUOperation.SBB)).toBe(1);

        alu.setFlags(0b00000011);
        expect(alu.operate(act, tmp, ALUOperation.SBB)).toBe(0);
    });

    
    test('test ANA', () => {
        expect(alu.operate(0b11110000, 0b00110011, ALUOperation.ANA)).toBe( 0b00110000);
    });

    test('test ORA', () => {
        expect(alu.operate(0b11110000, 0b00110011, ALUOperation.ORA)).toBe( 0b11110011);
    });

    test('test XRA', () => {
        expect(alu.operate(0b11110000, 0b00110011, ALUOperation.XRA)).toBe( 0b11000011);
    });

    test('test CMP', () => {
        expect(alu.operate(10, 10, ALUOperation.CMP)).toBe(0);
    });


    test('test set Carry flag', () => {
  
        expect(alu.operate(128, 0, ALUOperation.ADD)).toBe(128);
        // console.log(alu.getFlags())

        expect(alu.flagTest(FlagCondition.C)).toBe(false);
        expect(alu.flagTest(FlagCondition.NC)).toBe(true);

        
        expect(alu.operate(128, 129, ALUOperation.ADD)).toBe(1);

        // console.log(alu.getFlags())

        expect(alu.flagTest(FlagCondition.C)).toBe(true);
        expect(alu.flagTest(FlagCondition.NC)).toBe(false);

    });

    test('test set Zero flag', () => {
        const act = 0;
        const tmp = 0;

        alu.operate(act, tmp, ALUOperation.ADD);

        expect(alu.flagTest(FlagCondition.NZ)).toBe(false);
        expect(alu.flagTest(FlagCondition.Z)).toBe(true);

        alu.operate(0, 1, ALUOperation.ADD);

        expect(alu.flagTest(FlagCondition.NZ)).toBe(true);
        expect(alu.flagTest(FlagCondition.Z)).toBe(false);
    });

    test('test set Negative flag', () => {

        alu.operate(10, 5, ALUOperation.SUB);

        expect(alu.flagTest(FlagCondition.M)).toBe(false);
        expect(alu.flagTest(FlagCondition.P)).toBe(true);

        alu.operate(5, 10, ALUOperation.SUB);

        expect(alu.flagTest(FlagCondition.M)).toBe(true);
        expect(alu.flagTest(FlagCondition.P)).toBe(false);
    });



    test('test flags for CMP', () => {

        alu.operate(10, 5, ALUOperation.SUB);

        expect(alu.flagTest(FlagCondition.Z)).toBe(false);
        expect(alu.flagTest(FlagCondition.M)).toBe(false);

        
        alu.operate(5, 10, ALUOperation.SUB);

        expect(alu.flagTest(FlagCondition.Z)).toBe(false);
        expect(alu.flagTest(FlagCondition.M)).toBe(true);

        alu.operate(5, 5, ALUOperation.SUB);

        expect(alu.flagTest(FlagCondition.Z)).toBe(true);
        expect(alu.flagTest(FlagCondition.M)).toBe(false);
    });





    test('test Increment', () => {
        
        alu.setFlags(0b00000010);

        expect(alu.increment(10)).toBe(11);

        expect(alu.flagTest(FlagCondition.C)).toBe(false);

        expect(alu.increment(255)).toBe(0);

        expect(alu.flagTest(FlagCondition.C)).toBe(false);
        expect(alu.flagTest(FlagCondition.Z)).toBe(true);

    });

    test('test Decrement', () => {
        
        alu.setFlags(0b00000010);

        expect(alu.decrement(10)).toBe(9);

        expect(alu.flagTest(FlagCondition.C)).toBe(false);

        expect(alu.decrement(1)).toBe(0);

        expect(alu.flagTest(FlagCondition.C)).toBe(false);
        expect(alu.flagTest(FlagCondition.Z)).toBe(true);

    });



    test('test Set Carry', () => {
        
        alu.setFlags(0b00000010);

        expect(alu.flagTest(FlagCondition.C)).toBe(false);

        alu.setCarryFlag();

        expect(alu.flagTest(FlagCondition.C)).toBe(true);

    });

    
    test('test Invert Carry', () => {
        
        alu.setFlags(0b00000010);

        expect(alu.flagTest(FlagCondition.C)).toBe(false);

        alu.complementCarryFlag();

        expect(alu.flagTest(FlagCondition.C)).toBe(true);

        alu.complementCarryFlag();

        expect(alu.flagTest(FlagCondition.C)).toBe(false);

    });


    test('test RAR', () => {
        
        expect(alu.flagTest(FlagCondition.C)).toBe(false);

        expect(alu.rar(0b10011001)).toBe(0b01001100);

        expect(alu.flagTest(FlagCondition.C)).toBe(true);

        expect(alu.rar(0b01001100)).toBe(0b10100110);
    });


    test('test RRC', () => {
        
        expect(alu.rrc(0b10011001)).toBe(0b11001100);

        expect(alu.flagTest(FlagCondition.C)).toBe(true);

    });

    test('test RLC', () => {
        
        expect(alu.rlc(0b10011001)).toBe(0b00110011);

        expect(alu.flagTest(FlagCondition.C)).toBe(true);

    });

    test('test RAL', () => {

        expect(alu.flagTest(FlagCondition.C)).toBe(false);
        
        expect(alu.ral(0b10011001)).toBe(0b00110010);

        expect(alu.flagTest(FlagCondition.C)).toBe(true);

        expect(alu.ral(0b00110010)).toBe(0b01100101);

        expect(alu.flagTest(FlagCondition.C)).toBe(false);



    });



});
