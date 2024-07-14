import { byte, word } from "./types";

function disasm(program: byte[], PC: word) {
    const opcode = program[PC];
    let opbytes = 1;


    switch (opcode) {
        case 0x00: {
            return log(PC, opcode, "NOP")
            break;
        }
        case 0x01: {
            return log(PC, opcode, "LXI B, 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]))
            opbytes = 3;
            break;
        }
        case 0x02: {
            return log(PC, opcode, "STAX B")
            break;
        }
        case 0x03: {
            return log(PC, opcode, "INX B")
            break;
        }
        case 0x04: {
            return log(PC, opcode, "INR B")
            break;
        }
        case 0x05: {
            return log(PC, opcode, "DCR B")
            break;
        }
        case 0x06: {
            return log(PC, opcode, "MVI B, 0x" + hexToString(program[PC + 1]))
            opbytes = 2;
            break;
        }
        case 0x07: {
            return log(PC, opcode, "RLC")
            break;
        }
        case 0x08: {
            return log(PC, opcode, "NOP")
            break;
        }
        case 0x09: {
            return log(PC, opcode, "DAD B");
            break;
        }
        case 0x0A: {
            return log(PC, opcode, "LDAX B");
            break;
        }
        case 0x0B: {
            return log(PC, opcode, "DCX B")
            break;
        }
        case 0x0C: {
            return log(PC, opcode, "INR C");
            break;
        }
        case 0x0D: {
            return log(PC, opcode, "DCR C");
            break;
        }
        case 0x0E: {
            return log(PC, opcode, "MVI C, 0x" + hexToString(program[PC + 1]))
            opbytes = 2;
            break;
        }
        case 0x0F: {
            return log(PC, opcode, "RRC");
            break;
        }

        case 0x10: {
            return log(PC, opcode, "NOP")
            break;
        }
        case 0x11: {
            return log(PC, opcode, "LXI D, 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]))
            opbytes = 3;
            break;
        }
        case 0x12: {
            return log(PC, opcode, "STAX D")
            break;
        }
        case 0x13: {
            return log(PC, opcode, "INX D")
            break;
        }
        case 0x14: {
            return log(PC, opcode, "INR D")
            break;
        }
        case 0x15: {
            return log(PC, opcode, "DCR D")
            break;
        }
        case 0x16: {
            return log(PC, opcode, "MVI D, 0x" + hexToString(program[PC + 1]))
            opbytes = 2;
            break;
        }
        case 0x17: {
            return log(PC, opcode, "RAL")
            break;
        }
        case 0x18: {
            return log(PC, opcode, "NOP")
            break;
        }
        case 0x19: {
            return log(PC, opcode, "DAD D");
            break;
        }
        case 0x1A: {
            return log(PC, opcode, "LDAX D");
            break;
        }
        case 0x1B: {
            return log(PC, opcode, "DCX D")
            break;
        }
        case 0x1C: {
            return log(PC, opcode, "INR E");
            break;
        }
        case 0x1D: {
            return log(PC, opcode, "DCR E");
            break;
        }
        case 0x1E: {
            return log(PC, opcode, "MVI E, 0x" + hexToString(program[PC + 1]))
            opbytes = 2;
            break;
        }
        case 0x1F: {
            return log(PC, opcode, "RAR");
            break;
        }


        case 0x20: {
            return log(PC, opcode, "NOP")
            break;
        }
        case 0x21: {
            return log(PC, opcode, "LXI H, 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]))
            opbytes = 3;
            break;
        }
        case 0x22: {
            return log(PC, opcode, "SHLD, 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]))
            opbytes = 3;
            break;
        }
        case 0x23: {
            return log(PC, opcode, "INX H")
            break;
        }
        case 0x24: {
            return log(PC, opcode, "INR H")
            break;
        }
        case 0x25: {
            return log(PC, opcode, "DCR H")
            break;
        }
        case 0x26: {
            return log(PC, opcode, "MVI H, 0x" + hexToString(program[PC + 1]))
            opbytes = 2;
            break;
        }
        case 0x27: {
            return log(PC, opcode, "DAA")
            break;
        }
        case 0x28: {
            return log(PC, opcode, "NOP")
            break;
        }
        case 0x29: {
            return log(PC, opcode, "DAD H");
            break;
        }
        case 0x2A: {
            return log(PC, opcode, "LHLD 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]))
            opbytes = 3;
            break;
        }
        case 0x2B: {
            return log(PC, opcode, "DCX H")
            break;
        }
        case 0x2C: {
            return log(PC, opcode, "INR L");
            break;
        }
        case 0x2D: {
            return log(PC, opcode, "DCR L");
            break;
        }
        case 0x2E: {
            return log(PC, opcode, "MVI L, 0x" + hexToString(program[PC + 1]))
            opbytes = 2;
            break;
        }
        case 0x2F: {
            return log(PC, opcode, "CMA");
            break;
        }
        case 0x30: {
            return log(PC, opcode, "NOP");
            break;
        }
        case 0x31: {
            return log(PC, opcode, "LXI SP, 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]))
            opbytes = 3;
            break;
        }
        case 0x32: {
            return log(PC, opcode, "STA 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]))
            opbytes = 3;
            break;
        }
        case 0x33: {
            return log(PC, opcode, "INX SP");
            break;
        }
        case 0x34: {
            return log(PC, opcode, "INR M");
            break;
        }
        case 0x35: {
            return log(PC, opcode, "DRC M");
            break;
        }
        case 0x36: {
            return log(PC, opcode, "MVI M, 0x" + hexToString(program[PC + 1]));
            opbytes = 2;
            break;
        }
        case 0x37: {
            return log(PC, opcode, "STC");
            break;
        }
        case 0x38: {
            return log(PC, opcode, "NOP");
            break;
        }
        case 0x39: {
            return log(PC, opcode, "DAD SP");
            break;
        }
        case 0x3A: {
            return log(PC, opcode, "LDA 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }
        case 0x3B: {
            return log(PC, opcode, "DCX SP")
            break;
        }
        case 0x3C: {
            return log(PC, opcode, "INR A")
            break;
        }
        case 0x3D: {
            return log(PC, opcode, "DCR A")
            break;
        }
        case 0x3E: {
            return log(PC, opcode, "MVI A, 0x" + hexToString(program[PC + 1]))
            opbytes = 2;
            break;
        }
        case 0x3F: {
            return log(PC, opcode, "CMC")
            break;
        }



        case 0x40: {
            return log(PC, opcode, "MOV B,B")
            break;
        }
        case 0x41: {
            return log(PC, opcode, "MOV B,C")
            break;
        }
        case 0x42: {
            return log(PC, opcode, "MOV B,D")
            break;
        }
        case 0x43: {
            return log(PC, opcode, "MOV B,E")
            break;
        }
        case 0x44: {
            return log(PC, opcode, "MOV B,H")
            break;
        }
        case 0x45: {
            return log(PC, opcode, "MOV B,L")
            break;
        }
        case 0x46: {
            return log(PC, opcode, "MOV B,M")
            break;
        }
        case 0x47: {
            return log(PC, opcode, "MOV B,A")
            break;
        }
        case 0x48: {
            return log(PC, opcode, "MOV C,B")
            break;
        }
        case 0x49: {
            return log(PC, opcode, "MOV C,C")
            break;
        }
        case 0x4A: {
            return log(PC, opcode, "MOV C,D")
            break;
        }
        case 0x4B: {
            return log(PC, opcode, "MOV C,E")
            break;
        }
        case 0x4C: {
            return log(PC, opcode, "MOV C,H")
            break;
        }
        case 0x4D: {
            return log(PC, opcode, "MOV C,L")
            break;
        }
        case 0x4E: {
            return log(PC, opcode, "MOV C,M")
            break;
        }
        case 0x4F: {
            return log(PC, opcode, "MOV C,A")
            break;
        }




        case 0x50: {
            return log(PC, opcode, "MOV D,B")
            break;
        }
        case 0x51: {
            return log(PC, opcode, "MOV D,C")
            break;
        }
        case 0x52: {
            return log(PC, opcode, "MOV D,D")
            break;
        }
        case 0x53: {
            return log(PC, opcode, "MOV D,E")
            break;
        }
        case 0x54: {
            return log(PC, opcode, "MOV D,H")
            break;
        }
        case 0x55: {
            return log(PC, opcode, "MOV D,L")
            break;
        }
        case 0x56: {
            return log(PC, opcode, "MOV D,M")
            break;
        }
        case 0x57: {
            return log(PC, opcode, "MOV D,A")
            break;
        }
        case 0x58: {
            return log(PC, opcode, "MOV D,B")
            break;
        }
        case 0x59: {
            return log(PC, opcode, "MOV D,C")
            break;
        }
        case 0x5A: {
            return log(PC, opcode, "MOV D,D")
            break;
        }
        case 0x5B: {
            return log(PC, opcode, "MOV E,E")
            break;
        }
        case 0x5C: {
            return log(PC, opcode, "MOV E,H")
            break;
        }
        case 0x5D: {
            return log(PC, opcode, "MOV E,L")
            break;
        }
        case 0x5E: {
            return log(PC, opcode, "MOV E,M")
            break;
        }
        case 0x5F: {
            return log(PC, opcode, "MOV E,A")
            break;
        }


        case 0x60: {
            return log(PC, opcode, "MOV H,B")
            break;
        }
        case 0x61: {
            return log(PC, opcode, "MOV H,C")
            break;
        }
        case 0x62: {
            return log(PC, opcode, "MOV H,D")
            break;
        }
        case 0x63: {
            return log(PC, opcode, "MOV H,E")
            break;
        }
        case 0x64: {
            return log(PC, opcode, "MOV H,H")
            break;
        }
        case 0x65: {
            return log(PC, opcode, "MOV H,L")
            break;
        }
        case 0x66: {
            return log(PC, opcode, "MOV H,M")
            break;
        }
        case 0x67: {
            return log(PC, opcode, "MOV H,A")
            break;
        }
        case 0x68: {
            return log(PC, opcode, "MOV L,B")
            break;
        }
        case 0x69: {
            return log(PC, opcode, "MOV L,C")
            break;
        }
        case 0x6A: {
            return log(PC, opcode, "MOV L,D")
            break;
        }
        case 0x6B: {
            return log(PC, opcode, "MOV L,E")
            break;
        }
        case 0x6C: {
            return log(PC, opcode, "MOV L,H")
            break;
        }
        case 0x6D: {
            return log(PC, opcode, "MOV L,L")
            break;
        }
        case 0x6E: {
            return log(PC, opcode, "MOV L,M")
            break;
        }
        case 0x6F: {
            return log(PC, opcode, "MOV L,A")
            break;
        }


        case 0x70: {
            return log(PC, opcode, "MOV M,B")
            break;
        }
        case 0x71: {
            return log(PC, opcode, "MOV M,C")
            break;
        }
        case 0x72: {
            return log(PC, opcode, "MOV M,D")
            break;
        }
        case 0x73: {
            return log(PC, opcode, "MOV M,E")
            break;
        }
        case 0x74: {
            return log(PC, opcode, "MOV M,H")
            break;
        }
        case 0x75: {
            return log(PC, opcode, "MOV M,L")
            break;
        }
        case 0x76: {
            return log(PC, opcode, "HALT")
            break;
        }
        case 0x77: {
            return log(PC, opcode, "MOV M,A")
            break;
        }
        case 0x78: {
            return log(PC, opcode, "MOV A,B")
            break;
        }
        case 0x79: {
            return log(PC, opcode, "MOV A,C")
            break;
        }
        case 0x7A: {
            return log(PC, opcode, "MOV A,D")
            break;
        }
        case 0x7B: {
            return log(PC, opcode, "MOV A,E")
            break;
        }
        case 0x7C: {
            return log(PC, opcode, "MOV A,H")
            break;
        }
        case 0x7D: {
            return log(PC, opcode, "MOV A,L")
            break;
        }
        case 0x7E: {
            return log(PC, opcode, "MOV A,M")
            break;
        }
        case 0x7F: {
            return log(PC, opcode, "MOV A,A")
            break;
        }


        case 0x80: {
            return log(PC, opcode, "ADD B")
            break;
        }
        case 0x81: {
            return log(PC, opcode, "ADD C")
            break;
        }
        case 0x82: {
            return log(PC, opcode, "ADD D")
            break;
        }
        case 0x83: {
            return log(PC, opcode, "ADD E")
            break;
        }
        case 0x84: {
            return log(PC, opcode, "ADD H")
            break;
        }
        case 0x85: {
            return log(PC, opcode, "ADD L")
            break;
        }
        case 0x86: {
            return log(PC, opcode, "ADD M")
            break;
        }
        case 0x87: {
            return log(PC, opcode, "ADD A")
            break;
        }
        case 0x88: {
            return log(PC, opcode, "ADC B")
            break;
        }
        case 0x89: {
            return log(PC, opcode, "ADC C")
            break;
        }
        case 0x8A: {
            return log(PC, opcode, "ADC D")
            break;
        }
        case 0x8B: {
            return log(PC, opcode, "ADC E")
            break;
        }
        case 0x8C: {
            return log(PC, opcode, "ADC H")
            break;
        }
        case 0x8D: {
            return log(PC, opcode, "ADC L")
            break;
        }
        case 0x8E: {
            return log(PC, opcode, "ADC M")
            break;
        }
        case 0x8F: {
            return log(PC, opcode, "ADC A")
            break;
        }



        case 0x90: {
            return log(PC, opcode, "SUB B")
            break;
        }
        case 0x91: {
            return log(PC, opcode, "SUB C")
            break;
        }
        case 0x92: {
            return log(PC, opcode, "SUB D")
            break;
        }
        case 0x93: {
            return log(PC, opcode, "SUB E")
            break;
        }
        case 0x94: {
            return log(PC, opcode, "SUB H")
            break;
        }
        case 0x95: {
            return log(PC, opcode, "SUB L")
            break;
        }
        case 0x96: {
            return log(PC, opcode, "SUB M")
            break;
        }
        case 0x97: {
            return log(PC, opcode, "SUB A")
            break;
        }
        case 0x98: {
            return log(PC, opcode, "SBB B")
            break;
        }
        case 0x99: {
            return log(PC, opcode, "SBB C")
            break;
        }
        case 0x9A: {
            return log(PC, opcode, "SBB D")
            break;
        }
        case 0x9B: {
            return log(PC, opcode, "SBB E")
            break;
        }
        case 0x9C: {
            return log(PC, opcode, "SBB H")
            break;
        }
        case 0x9D: {
            return log(PC, opcode, "SBB L")
            break;
        }
        case 0x9E: {
            return log(PC, opcode, "SBB M")
            break;
        }
        case 0x9F: {
            return log(PC, opcode, "SBB A")
            break;
        }


        case 0xA0: {
            return log(PC, opcode, "ANA B")
            break;
        }
        case 0xA1: {
            return log(PC, opcode, "ANA C")
            break;
        }
        case 0xA2: {
            return log(PC, opcode, "ANA D")
            break;
        }
        case 0xA3: {
            return log(PC, opcode, "ANA E")
            break;
        }
        case 0xA4: {
            return log(PC, opcode, "ANA H")
            break;
        }
        case 0xA5: {
            return log(PC, opcode, "ANA L")
            break;
        }
        case 0xA6: {
            return log(PC, opcode, "ANA M")
            break;
        }
        case 0xA7: {
            return log(PC, opcode, "ANA A")
            break;
        }
        case 0xA8: {
            return log(PC, opcode, "XRA B")
            break;
        }
        case 0xA9: {
            return log(PC, opcode, "XRA C")
            break;
        }
        case 0xAA: {
            return log(PC, opcode, "XRA D")
            break;
        }
        case 0xAB: {
            return log(PC, opcode, "XRA E")
            break;
        }
        case 0xAC: {
            return log(PC, opcode, "XRA H")
            break;
        }
        case 0xAD: {
            return log(PC, opcode, "XRA L")
            break;
        }
        case 0xAE: {
            return log(PC, opcode, "XRA M")
            break;
        }
        case 0xAF: {
            return log(PC, opcode, "XRA A")
            break;
        }


        case 0xB0: {
            return log(PC, opcode, "ORA B")
            break;
        }
        case 0xB1: {
            return log(PC, opcode, "ORA C")
            break;
        }
        case 0xB2: {
            return log(PC, opcode, "ORA D")
            break;
        }
        case 0xB3: {
            return log(PC, opcode, "ORA E")
            break;
        }
        case 0xB4: {
            return log(PC, opcode, "ORA H")
            break;
        }
        case 0xB5: {
            return log(PC, opcode, "ORA L")
            break;
        }
        case 0xB6: {
            return log(PC, opcode, "ORA M")
            break;
        }
        case 0xB7: {
            return log(PC, opcode, "ORA A")
            break;
        }
        case 0xB8: {
            return log(PC, opcode, "CMP B")
            break;
        }
        case 0xB9: {
            return log(PC, opcode, "CMP C")
            break;
        }
        case 0xBA: {
            return log(PC, opcode, "CMP D")
            break;
        }
        case 0xBB: {
            return log(PC, opcode, "CMP E")
            break;
        }
        case 0xBC: {
            return log(PC, opcode, "CMP H")
            break;
        }
        case 0xBD: {
            return log(PC, opcode, "CMP L")
            break;
        }
        case 0xBE: {
            return log(PC, opcode, "CMP M")
            break;
        }
        case 0xBF: {
            return log(PC, opcode, "CMP A")
            break;
        }

        case 0xC0: {
            return log(PC, opcode, "RNZ")
            break;
        }
        case 0xC1: {
            return log(PC, opcode, "POP")
            break;
        }
        case 0xC2: {
            return log(PC, opcode, "JNZ 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }
        case 0xC3: {
            return log(PC, opcode, "JMP 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }
        case 0xC4: {
            return log(PC, opcode, "CNZ 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }
        case 0xC5: {
            return log(PC, opcode, "PUSH B")
            break;
        }
        case 0xC6: {
            return log(PC, opcode, "ADI 0x" + hexToString(program[PC + 1]))
            opbytes = 2;
            break;
        }
        case 0xc7: {
            return log(PC, opcode, "RST 0")
            break;
        }
        case 0xc8: {
            return log(PC, opcode, "RZ")
            break;
        }
        case 0xc9: {
            return log(PC, opcode, "RET")
            break;
        }
        case 0xcA: {
            return log(PC, opcode, "JZ 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }
        case 0xcB: {
            return log(PC, opcode, "JMP 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }
        case 0xcC: {
            return log(PC, opcode, "CZ 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }

        case 0xcD: {
            return log(PC, opcode, "CALL 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }

        case 0xcE: {
            return log(PC, opcode, "ACI 0x" + hexToString(program[PC + 1]))
            opbytes = 2;
            break;
        }
        case 0xcF: {
            return log(PC, opcode, "RST 1")
            break;
        }

        case 0xd0: {
            return log(PC, opcode, "RNC")
            break;
        }
        case 0xd1: {
            return log(PC, opcode, "POP D")
            break;
        }
        case 0xd2: {
            return log(PC, opcode, "JNC 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }
        case 0xd3: {
            return log(PC, opcode, "OUT 0x" + hexToString(program[PC + 1]))
            opbytes = 2;
            break;
        }
        case 0xd4: {
            return log(PC, opcode, "CNC 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }
        case 0xd5: {
            return log(PC, opcode, "PUSH D")
            break;
        }
        case 0xd6: {
            return log(PC, opcode, "SUI 0x" + hexToString(program[PC + 1]))
            opbytes = 2;
            break;
        }
        case 0xd7: {
            return log(PC, opcode, "RST 2")
            break;
        }
        case 0xd8: {
            return log(PC, opcode, "RC")
            break;
        }
        case 0xd9: {
            return log(PC, opcode, "RET")
            break;
        }
        case 0xdA: {
            return log(PC, opcode, "JC 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }

        case 0xdB: {
            return log(PC, opcode, "IN 0x" + hexToString(program[PC + 1]))
            opbytes = 2;
            break;
        }
        case 0xdC: {
            return log(PC, opcode, "CC 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }
        case 0xdD: {
            return log(PC, opcode, "CALL 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }
        case 0xdE: {
            return log(PC, opcode, "SBI 0x" + hexToString(program[PC + 1]))
            opbytes = 2;
            break;
        }
        case 0xdF: {
            return log(PC, opcode, "RST 3")
            break;
        }


        case 0xE0: {
            return log(PC, opcode, "RPO")
            break;
        }
        case 0xE1: {
            return log(PC, opcode, "POP H")
            break;
        }
        case 0xE2: {
            return log(PC, opcode, "JPO 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }
        case 0xE3: {
            return log(PC, opcode, "XTHL")
            break;
        }

        case 0xE4: {
            return log(PC, opcode, "CPO 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }
        case 0xE5: {
            return log(PC, opcode, "PUSH H")
            break;
        }
        case 0xE6: {
            return log(PC, opcode, "ANI 0x" + hexToString(program[PC + 1]))
            opbytes = 2;
            break;
        }
        case 0xE7: {
            return log(PC, opcode, "RST 4")
            break;
        }
        case 0xE8: {
            return log(PC, opcode, "RPE")
            break;
        }
        case 0xE9: {
            return log(PC, opcode, "PCHL")
            break;
        }
        case 0xEA: {
            return log(PC, opcode, "JPE 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }
        case 0xEB: {
            return log(PC, opcode, "XCHG")
            break;
        }
        case 0xEC: {
            return log(PC, opcode, "CPE 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }
        case 0xED: {
            return log(PC, opcode, "CALL 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }
        case 0xEE: {
            return log(PC, opcode, "XRI 0x" + hexToString(program[PC + 1]))
            opbytes = 2;
            break;
        }
        case 0xEF: {
            return log(PC, opcode, "RST 5")
            break;
        }


        case 0xF0: {
            return log(PC, opcode, "RP")
            break;
        }
        case 0xF1: {
            return log(PC, opcode, "POP PSW")
            break;
        }
        case 0xF2: {
            return log(PC, opcode, "JP 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }
        case 0xF3: {
            return log(PC, opcode, "DI")
            break;
        }
        case 0xF4: {
            return log(PC, opcode, "CP 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }
        case 0xF5: {
            return log(PC, opcode, "PUSH PSW")
            break;
        }
        case 0xF6: {
            return log(PC, opcode, "ORI 0x" + hexToString(program[PC + 1]))
            opbytes = 2;
            break;
        }
        case 0xF7: {
            return log(PC, opcode, "RST 6")
            break;
        }
        case 0xF8: {
            return log(PC, opcode, "RM")
            break;
        }
        case 0xF9: {
            return log(PC, opcode, "SPHL")
            break;
        }
        case 0xFA: {
            return log(PC, opcode, "JM 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }
        case 0xFB: {
            return log(PC, opcode, "EI")
            break;
        }
        case 0xFC: {
            return log(PC, opcode, "CM 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }
        case 0xFD: {
            return log(PC, opcode, "CALL 0x" + hexToString(program[PC + 2] << 8 | program[PC + 1]));
            opbytes = 3;
            break;
        }
        case 0xFE: {
            return log(PC, opcode, "CPI 0x" + hexToString(program[PC + 1]))
            opbytes = 2;
            break;
        }
        case 0xFF: {
            return log(PC, opcode, "RST 7")
            break;
        }

        default: {
            return log(PC, opcode, "UNKNOWN INSTRUCTION")
            break;
        }
    }

    // return opbytes;
}

function log(PC: word, opcode: byte, args: string) {
    if(opcode == undefined){
        console.log(PC)
    }
    return ("0x" + hexToString(PC).padStart(4, '0') + " 0x" + hexToString(opcode).padStart(2, '0') + " " + args);
}

function hexToString(opcode: byte) {
    return opcode.toString(16).toUpperCase();
}



const opcodeCycles = [
    4, 10,7, 5, 5, 5, 7, 4, 4, 10,7, 5, 5, 5, 7, 4, // 00..0f
    4, 10,7, 5, 5, 5, 7, 4, 4, 10,7, 5, 5, 5, 7, 4, // 00..1f
    4, 10,16,5, 5, 5, 7, 4, 4, 10,16,5, 5, 5, 7, 4, // 20..2f
    4, 10,13,5, 10,10,10,4, 4, 10,13,5, 5, 5, 7, 4, // 30..3f
    5, 5, 5, 5, 5, 5, 7, 5, 5, 5, 5, 5, 5, 5, 7, 5, // 40..4f
    5, 5, 5, 5, 5, 5, 7, 5, 5, 5, 5, 5, 5, 5, 7, 5, // 50..5f
    5, 5, 5, 5, 5, 5, 7, 5, 5, 5, 5, 5, 5, 5, 7, 5, // 60..6f
    7, 7, 7, 7, 7, 7, 7, 7, 5, 5, 5, 5, 5, 5, 7, 5, // 70..7f
    
    4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, // 80..8f
    4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, // 90..9f
    4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, // a0..af
    4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, // b0..bf
    5,10,10,10,11,11, 7,11, 5,10,10,10,11,17, 7,11, // c0..cf
    5,10,10,10,11,11, 7,11, 5,10,10,10,11,17, 7,11, // d0..df
    5,10,10,18,11,11, 7,11, 5, 5,10, 5,11,17, 7,11, // e0..ef
    5,10,10, 4,11,11, 7,11, 5, 5,10, 4,11,17, 7,11, // f0..ff
];


export {disasm, opcodeCycles}