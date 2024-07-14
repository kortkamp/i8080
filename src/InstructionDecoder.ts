import { CycleType, MachineCycle } from "./MachineCycle";
import { byte } from "./types";

enum Op {
    NOP, LXI_R_D16, STAX_R, INX_R,
    INR_R, DCR_R, INR_M, DCR_M,
    RLC, RRC, RAL, RAR,
    MVI_R_D8, 
    SHLD_A16, LHLD_A16, STA_A16, LDA_A16, DAA, 
    CMA, 

    STC,  
    DAD_R, // <<<
    CMC,
    LDAX_R,
    DCX_R, 
    MOV_R1_R2, MOV_R1_M, MOV_M_R2, ALU_OP_R, ALU_OP_M, MVI_M_D8,
    RET_COND, RET, POP_DR, PUSH_DR, JMP_COND, JMP, CALL_COND, CALL, 
    RST_N,  //<<<
    ALU_OP_I, DI, EI, OUT_D8, IN_D8, 
    POP_PSW, PUSH_PSW, PCHL, SPHL, XTHL, XCHG, HALT
}

const instructionName = {
    [Op.NOP] : "NOP",
    [Op.LXI_R_D16] : "LXI_R_D16",
    [Op.STAX_R] : "STAX_R",
    [Op.INX_R] : "INX_R",
    [Op.INR_R] : "INR_R",
    [Op.DCR_R] : "DCR_R",
    [Op.INR_M] : "INR_M",
    [Op.DCR_M] : "DCR_M",
    [Op.RLC] : "RLC",
    [Op.RRC] : "RRC",
    [Op.RAL] : "RAL",
    [Op.RAR] : "RAR",
    [Op.MVI_R_D8] : "MVI_R_D8",
    
    [Op.SHLD_A16] : "SHLD_A16",
    [Op.LHLD_A16] : "LHLD_A16",
    [Op.STA_A16] : "STA_A16",
    [Op.LDA_A16] : "LDA_A16",
    [Op.DAA] : "DAA",
    [Op.CMA] : "CMA",
    [Op.STC] : "STC",
    [Op.CMC] : "CMC",
    
    [Op.DAD_R] : "DAD_R",
    [Op.LDAX_R] : "LDAX_R",
    [Op.DCX_R] : "DCX_R",
    [Op.MOV_R1_R2] : "MOV_R1_R2",
    [Op.MOV_R1_M] : "MOV_R1_M",
    [Op.MOV_M_R2] : "MOV_M_R2",
    [Op.ALU_OP_R] : "ALU_OP_R",
    [Op.ALU_OP_M] : "ALU_OP_M",
    [Op.MVI_M_D8] : "MVI_M_D8",
    [Op.RET_COND] : "RET_COND",
    [Op.RET] : "RET",
    [Op.POP_DR] : "POP_DR",
    [Op.PUSH_DR] : "PUSH_DR",
    [Op.JMP_COND] : "JMP_COND",
    [Op.JMP] : "JMP",
    [Op.CALL_COND] : "CALL_COND",
    [Op.CALL] : "CALL",
    [Op.RST_N] : "RST_N",
    [Op.ALU_OP_I] : "ALU_OP_I",
    [Op.DI] : "DI",
    [Op.EI] : "EI",
    [Op.OUT_D8] : "OUT_D8",
    [Op.IN_D8] : "IN_D8",
    
    [Op.POP_PSW] : "POP_PSW",
    [Op.PUSH_PSW] : "PUSH_PSW",
    [Op.PCHL] : "PCHL",
    [Op.SPHL] : "SPHL",
    [Op.XTHL] : "XTHL",
    [Op.XCHG] : "XCHG",
    [Op.HALT] : "HALT",
}



enum Command {
    PC_OUT          ,//= 0b0000000000000000,
    HL_OUT          ,//= 0b0000000000000001,
    SP_OUT          ,//= 0b0000000000000010,
    WZ_OUT          ,//= 0b0000000000000011,
    RP_OUT          ,
    PC_INC          ,//= 0b0000000000010000,
    SP_INC          ,//= 0b0000000000010001,  
    SP_DEC          ,//= 0b0000000000010010,  
    RP_INC          ,
    WZ_INC,
    // ADD_LATCH_DEC   ,//= 0b0000000000100000,
    SSS_TMP         ,//= 0b0000000100000000,
    HL_SP,
    PC_HL,
    HLXDE,
    WZ_INC_PC       ,  
    
    PCH_DATA        ,
    PCL_DATA        ,
    RH_DATA         ,
    RL_DATA         ,
    FLAG_DATA       ,

    TMP_DDD         ,//= 0b0000001000000000,
    TMP_DATA        ,//= 0b0000010000000000,
    DATA_DDD        ,//= 0b0000000010000000,
    DATA_TMP        ,//= 0b0000100010000001,
    DATA_IR         ,//= 0b0000000010000010,
    DATA_L,
    DATA_H,

    L_DATA,
    H_DATA,
    DATA_FLAG,

    DATA_W          ,//= 0b0000000010000100,
    DATA_Z          ,//= 0b0000000010000011,
    DATA_RH,
    DATA_RL,
    DATA_A  	    ,//= 0b0000000011100000,

    A_DATA          ,//= 0b0000000011100001,  
    A_ACT           ,

    ALU_OP          ,
    ALU_A           ,
    RP_DEC          ,

    ALU_RLC,ALU_RRC,ALU_RAL, ALU_RAR,

    ALU_INC_DATA , ALU_DEC_DATA,



    JUDGE_COND      ,
    HALT            ,

    DDD_TMP_1_ACT,
    INR_DDD,
    DCR_DDD,
    INR_M,
    DCR_M,
    WZ_HL,

    CMA,
    CMC,
    STC,
    ZERO_W,
    RST_TMP_Z,
    DAA,

    RL_ACT, L_TMP, ALU_ADD_L,RH_ACT,H_TMP,ALU_ADC_H,


    X               ,//= 0b1000000000000000,
    NOT_IMP         ,
}
const opcodes = [
    Op.NOP, Op.LXI_R_D16, Op.STAX_R   , Op.INX_R, Op.INR_R, Op.DCR_R, Op.MVI_R_D8, Op.RLC,
    Op.NOP, Op.DAD_R    , Op.LDAX_R   , Op.DCX_R, Op.INR_R, Op.DCR_R, Op.MVI_R_D8, Op.RRC,
    Op.NOP, Op.LXI_R_D16, Op.STAX_R   , Op.INX_R, Op.INR_R, Op.DCR_R, Op.MVI_R_D8, Op.RAL,
    Op.NOP, Op.DAD_R    , Op.LDAX_R   , Op.DCX_R, Op.INR_R, Op.DCR_R, Op.MVI_R_D8, Op.RAR,

    Op.NOP, Op.LXI_R_D16, Op.SHLD_A16 , Op.INX_R, Op.INR_R, Op.DCR_R, Op.MVI_R_D8, Op.DAA,
    Op.NOP, Op.DAD_R    , Op.LHLD_A16 , Op.DCX_R, Op.INR_R, Op.DCR_R, Op.MVI_R_D8, Op.CMA,
    Op.NOP, Op.LXI_R_D16, Op.STA_A16  , Op.INX_R, Op.INR_M, Op.DCR_M, Op.MVI_M_D8, Op.STC,
    Op.NOP, Op.DAD_R    , Op.LDA_A16  , Op.DCX_R, Op.INR_R, Op.DCR_R, Op.MVI_R_D8, Op.CMC,

    Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_M, Op.MOV_R1_R2, 
    Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_M, Op.MOV_R1_R2, 
    Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_M, Op.MOV_R1_R2, 
    Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_M, Op.MOV_R1_R2, 
   
    Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_M, Op.MOV_R1_R2, 
    Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_M, Op.MOV_R1_R2, 
    Op.MOV_M_R2 , Op.MOV_M_R2 , Op.MOV_M_R2 , Op.MOV_M_R2 , Op.MOV_M_R2 , Op.MOV_M_R2 , Op.HALT    , Op.MOV_M_R2 , 
    Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_R2, Op.MOV_R1_M, Op.MOV_R1_R2, 

    Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_M, Op.ALU_OP_R, 
    Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_M, Op.ALU_OP_R, 
    Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_M, Op.ALU_OP_R, 
    Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_M, Op.ALU_OP_R, 
    
    Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_M, Op.ALU_OP_R, 
    Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_M, Op.ALU_OP_R, 
    Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_M, Op.ALU_OP_R, 
    Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_R, Op.ALU_OP_M, Op.ALU_OP_R, 


    Op.RET_COND, Op.POP_DR , Op.JMP_COND, Op.JMP    , Op.CALL_COND, Op.PUSH_DR  , Op.ALU_OP_I, Op.RST_N,
    Op.RET_COND, Op.RET    , Op.JMP_COND, Op.JMP    , Op.CALL_COND, Op.CALL     , Op.ALU_OP_I, Op.RST_N,
    Op.RET_COND, Op.POP_DR , Op.JMP_COND, Op.OUT_D8 , Op.CALL_COND, Op.PUSH_DR  , Op.ALU_OP_I, Op.RST_N,
    Op.RET_COND, Op.RET    , Op.JMP_COND, Op.IN_D8  , Op.CALL_COND, Op.CALL     , Op.ALU_OP_I, Op.RST_N,
    
    Op.RET_COND, Op.POP_DR , Op.JMP_COND, Op.XTHL   , Op.CALL_COND, Op.PUSH_DR  , Op.ALU_OP_I, Op.RST_N,
    Op.RET_COND, Op.PCHL   , Op.JMP_COND, Op.XCHG   , Op.CALL_COND, Op.CALL     , Op.ALU_OP_I, Op.RST_N,
    Op.RET_COND, Op.POP_PSW, Op.JMP_COND, Op.DI     , Op.CALL_COND, Op.PUSH_PSW , Op.ALU_OP_I, Op.RST_N,
    Op.RET_COND, Op.SPHL   , Op.JMP_COND, Op.EI     , Op.CALL_COND, Op.CALL     , Op.ALU_OP_I, Op.RST_N,
]

const rpTableWZ = [
     ,0, , , , , , ,
     , , , , , , , ,
     ,0, , , , , , ,
     , , , , , , , ,
     ,0,1, , , , , ,
     , ,1, , , , , ,
     ,0,1, , , , , ,
     , ,1, , , , , ,

     , , , , , , , ,
     , , , , , , , ,
     , , , , , , , ,
     , , , , , , , ,
     , , , , , , , ,
     , , , , , , , ,
     , , , , , , , ,
     , , , , , , , ,

     , , , , , , , ,
     , , , , , , , ,
     , , , , , , , ,
     , , , , , , , ,
     , , , , , , , ,
     , , , , , , , ,
     , , , , , , , ,
     , , , , , , , ,

    1,0,1,1,1,0, , ,
    1,1,1,1,1,1, , ,
    1,0,1, ,1,0, , ,
    1,1,1, ,1,1, , ,
    1,0,1,1,1,0, , ,
    1, ,1, ,1, , , ,
    1, ,1, ,1,0, , ,
    1, ,1, ,1, , , ,
]

const MemReadTypes = {
    imediate : [Command.PC_OUT, Command.PC_INC ],
    referenced : [Command.HL_OUT,  ],
}

const decodeTable: Record<Op, MachineCycle[]> = {
    [Op.MOV_R1_R2]: [
        MachineCycle.create(CycleType.FETCH, [Command.SSS_TMP, Command.TMP_DDD])
    ],
    [Op.MOV_R1_M]: [
        MachineCycle.create(CycleType.FETCH, [Command.X]),
        new MachineCycle(CycleType.MEM_READ, [Command.HL_OUT, Command.X, Command.DATA_DDD])
    ],
    [Op.MOV_M_R2]: [
        MachineCycle.create(CycleType.FETCH, [Command.SSS_TMP]),
        new MachineCycle(CycleType.MEM_WRITE, [Command.HL_OUT, Command.X ,Command.TMP_DATA])
    ],
    [Op.SPHL] : [
        MachineCycle.create(CycleType.FETCH, [Command.X, Command.HL_SP]),
    ],
    [Op.MVI_R_D8]: [
        MachineCycle.create(CycleType.FETCH, [Command.X]),
        new MachineCycle(CycleType.MEM_READ, [Command.PC_OUT, Command.PC_INC, Command.DATA_DDD])
    ],
    [Op.MVI_M_D8] : [
        MachineCycle.create(CycleType.FETCH),
        new MachineCycle(CycleType.MEM_READ, [Command.PC_OUT, Command.PC_INC, Command.DATA_TMP]),
        new MachineCycle(CycleType.MEM_WRITE, [Command.HL_OUT, Command.TMP_DATA]),
    ],
    [Op.LXI_R_D16] : [
        MachineCycle.create(CycleType.FETCH, [Command.X]),
        MachineCycle.create(CycleType.MEM_READ, [] ,'l' ), 
        MachineCycle.create(CycleType.MEM_READ, [] ,'h' ), 
    ],

    [Op.LDA_A16] : [
        MachineCycle.create(CycleType.FETCH),
        MachineCycle.create(CycleType.MEM_READ, [] ,'l' ), 
        MachineCycle.create(CycleType.MEM_READ, [] ,'h' ), 
        new MachineCycle(CycleType.MEM_READ, [Command.WZ_OUT, Command.X, Command.DATA_A])
    ],
    [Op.STA_A16] : [
        MachineCycle.create(CycleType.FETCH),
        MachineCycle.create(CycleType.MEM_READ, [] ,'l' ), 
        MachineCycle.create(CycleType.MEM_READ, [] ,'h' ), 
        new MachineCycle(CycleType.MEM_READ, [Command.WZ_OUT, Command.X, Command.A_DATA])
    ],
    [Op.LHLD_A16] : [
        MachineCycle.create(CycleType.FETCH),
        MachineCycle.create(CycleType.MEM_READ, [] ,'l' ), 
        MachineCycle.create(CycleType.MEM_READ, [] ,'h' ), 
        new MachineCycle(CycleType.MEM_READ, [Command.WZ_OUT, Command.WZ_INC, Command.DATA_L]),
        new MachineCycle(CycleType.MEM_READ, [Command.WZ_OUT, Command.X, Command.DATA_H]),
    ],
    [Op.SHLD_A16] : [
        MachineCycle.create(CycleType.FETCH, [Command.X]),
        new MachineCycle(CycleType.MEM_READ, [Command.PC_OUT, Command.PC_INC, Command.DATA_RL]),
        new MachineCycle(CycleType.MEM_READ, [Command.PC_OUT, Command.PC_INC, Command.DATA_RH]),
        new MachineCycle(CycleType.MEM_WRITE, [Command.WZ_OUT, Command.WZ_INC, Command.L_DATA]),
        new MachineCycle(CycleType.MEM_WRITE, [Command.WZ_OUT, Command.X, Command.H_DATA]),

    ],
    [Op.LDAX_R] : [
        MachineCycle.create(CycleType.FETCH, [Command.X]),
        new MachineCycle(CycleType.MEM_READ, [Command.RP_OUT, Command.DATA_A])
    ],
    [Op.STAX_R] : [
        MachineCycle.create(CycleType.FETCH, [Command.X]),
        new MachineCycle(CycleType.MEM_WRITE, [Command.RP_OUT, Command.A_DATA])
    ],
    [Op.XCHG] : [
        MachineCycle.create(CycleType.FETCH, [Command.HLXDE]),
    ],
    [Op.ALU_OP_R] : [
        MachineCycle.create(CycleType.FETCH, [Command.ALU_OP]),
    ],
    [Op.ALU_OP_M] : [
        MachineCycle.create(CycleType.FETCH, [Command.A_ACT]),
        new MachineCycle(CycleType.MEM_READ, [Command.HL_OUT, Command.DATA_TMP, Command.ALU_A])
    ],
    [Op.ALU_OP_I] : [
        MachineCycle.create(CycleType.FETCH, [Command.A_ACT]),
        new MachineCycle(CycleType.MEM_READ, [Command.PC_OUT, Command.PC_INC, Command.DATA_TMP])
    ],

    

    [Op.INX_R] : [
        MachineCycle.create(CycleType.FETCH, [Command.X, Command.RP_INC]),
    ],

    [Op.DCX_R] : [
        MachineCycle.create(CycleType.FETCH, [Command.X, Command.RP_DEC]),
    ],


    [Op.JMP]   : [
        MachineCycle.create(CycleType.FETCH, [Command.X]),
        MachineCycle.create(CycleType.MEM_READ, [] ,'l' ), 
        MachineCycle.create(CycleType.MEM_READ, [] ,'h' ), 
    ],

    [Op.JMP_COND] : [
        MachineCycle.create(CycleType.FETCH, [ Command.JUDGE_COND]),
        MachineCycle.create(CycleType.MEM_READ, [] ,'l' ), 
        MachineCycle.create(CycleType.MEM_READ, [] ,'h' ), 
    ],
    
    [Op.CALL]: [
        MachineCycle.create(CycleType.FETCH, [Command.X, Command.SP_DEC]),
        MachineCycle.create(CycleType.MEM_READ, [] ,'l' ), 
        MachineCycle.create(CycleType.MEM_READ, [] ,'h' ), 
        new MachineCycle(CycleType.STACK_WRITE, [Command.SP_OUT, Command.SP_DEC, Command.PCH_DATA]),
        new MachineCycle(CycleType.STACK_WRITE, [Command.SP_OUT, Command.X ,Command.PCL_DATA]),
    ],

    [Op.CALL_COND]: [
        MachineCycle.create(CycleType.FETCH, [Command.X, Command.JUDGE_COND]),
        MachineCycle.create(CycleType.MEM_READ, [] ,'l' ), 
        MachineCycle.create(CycleType.MEM_READ, [] ,'h' ), 
        new MachineCycle(CycleType.STACK_WRITE, [Command.SP_OUT, Command.SP_DEC, Command.PCH_DATA]),
        new MachineCycle(CycleType.STACK_WRITE, [Command.SP_OUT, Command.X,  Command.PCL_DATA]),
    ],

    [Op.RET]   : [
        MachineCycle.create(CycleType.FETCH, [Command.X]),
        new MachineCycle(CycleType.STACK_READ, [Command.SP_OUT, Command.SP_INC, Command.DATA_Z]),
        new MachineCycle(CycleType.STACK_READ, [Command.SP_OUT, Command.SP_INC, Command.DATA_W]),
    ],

    [Op.RET_COND]   : [
        MachineCycle.create(CycleType.FETCH, [Command.X, Command.JUDGE_COND]),
        new MachineCycle(CycleType.STACK_READ, [Command.SP_OUT, Command.SP_INC, Command.DATA_Z]),
        new MachineCycle(CycleType.STACK_READ, [Command.SP_OUT, Command.SP_INC, Command.DATA_W]),
    ],

    [Op.PCHL]   : [
        MachineCycle.create(CycleType.FETCH, [Command.PC_HL]),
    ],

    [Op.PUSH_DR]   : [
        MachineCycle.create(CycleType.FETCH, [Command.SP_DEC]),
        new MachineCycle(CycleType.STACK_WRITE, [Command.SP_OUT, Command.SP_DEC, Command.RH_DATA]),
        new MachineCycle(CycleType.STACK_WRITE, [Command.SP_OUT, Command.X, Command.RL_DATA]),
    ],
    [Op.PUSH_PSW]   : [
        MachineCycle.create(CycleType.FETCH, [Command.SP_DEC]),
        new MachineCycle(CycleType.STACK_WRITE, [Command.SP_OUT, Command.SP_DEC, Command.A_DATA]),
        new MachineCycle(CycleType.STACK_WRITE, [Command.SP_OUT, Command.X, Command.FLAG_DATA]),
    ],

    [Op.POP_DR]   : [
        MachineCycle.create(CycleType.FETCH, [Command.X]),
        MachineCycle.create(CycleType.STACK_READ, [], 'l'),
        MachineCycle.create(CycleType.STACK_READ, [], 'h')
    ],

    [Op.POP_PSW]   : [
        MachineCycle.create(CycleType.FETCH, [Command.X]),
        new MachineCycle(CycleType.STACK_READ, [Command.SP_OUT, Command.SP_INC, Command.DATA_FLAG]),
        new MachineCycle(CycleType.STACK_READ, [Command.SP_OUT, Command.SP_INC, Command.DATA_A]),
    ],



    //	H <-> (SP+1); L <-> (SP)

    [Op.XTHL] : [
        MachineCycle.create(CycleType.FETCH, [Command.X]),
        new MachineCycle(CycleType.STACK_READ, [Command.SP_OUT, Command.SP_INC, Command.DATA_Z]),
        new MachineCycle(CycleType.STACK_READ, [Command.SP_OUT, Command.X, Command.DATA_W]),
        new MachineCycle(CycleType.STACK_WRITE, [Command.SP_OUT, Command.SP_DEC, Command.H_DATA]),
        new MachineCycle(CycleType.STACK_WRITE, [Command.SP_OUT, Command.X, Command.L_DATA, Command.X , Command.WZ_HL]),


    ],

    [Op.IN_D8] : [
        MachineCycle.create(CycleType.FETCH, [Command.X]),
        new MachineCycle(CycleType.MEM_READ, [Command.PC_OUT, Command.PC_INC, Command.DATA_Z]),
        MachineCycle.create(CycleType.INPUT_READ),
    ],

    [Op.OUT_D8] : [
        MachineCycle.create(CycleType.FETCH, [Command.X]),
        new MachineCycle(CycleType.MEM_READ, [Command.PC_OUT, Command.PC_INC, Command.DATA_Z]),
        MachineCycle.create(CycleType.OUTPUT_WRITE),
    ],

    [Op.EI] : [
        MachineCycle.create(CycleType.FETCH, [Command.X]),
    ],

    [Op.DI] : [
        MachineCycle.create(CycleType.FETCH, [Command.X]),
    ],

    [Op.DAA] : [
        MachineCycle.create(CycleType.FETCH, [Command.DAA]),
    ],

    [Op.CMA] : [
        MachineCycle.create(CycleType.FETCH, [Command.CMA]),
    ],


    [Op.HALT] : [
        MachineCycle.create(CycleType.FETCH, [Command.X]),
        new MachineCycle(CycleType.MEM_READ, [Command.HALT])
    ],


    [Op.INR_R] : [
        MachineCycle.create(CycleType.FETCH, [Command.DDD_TMP_1_ACT, Command.INR_DDD]),
    ],

    [Op.DCR_R] : [
        MachineCycle.create(CycleType.FETCH, [Command.DDD_TMP_1_ACT, Command.DCR_DDD]),
    ],

    
    [Op.INR_M] : [
        MachineCycle.create(CycleType.FETCH, [Command.X]),
        new MachineCycle(CycleType.MEM_READ, [Command.HL_OUT,Command.DATA_TMP]),
        new MachineCycle(CycleType.MEM_WRITE, [Command.HL_OUT,Command.ALU_INC_DATA]),
    ],

    [Op.DCR_M] : [
        MachineCycle.create(CycleType.FETCH, [Command.X]),
        new MachineCycle(CycleType.MEM_READ, [Command.HL_OUT,Command.DATA_TMP]),
        new MachineCycle(CycleType.MEM_WRITE, [Command.HL_OUT,Command.ALU_DEC_DATA]),
    ],

    [Op.RLC] : [
        MachineCycle.create(CycleType.FETCH, [Command.ALU_RLC]),
    ],

    
    [Op.RRC] : [
        MachineCycle.create(CycleType.FETCH, [Command.ALU_RRC]),
    ],
    
        
    [Op.RAL] : [
        MachineCycle.create(CycleType.FETCH, [Command.ALU_RAL]),
    ],

        
    [Op.RAR] : [
        MachineCycle.create(CycleType.FETCH, [Command.ALU_RAR]),
    ],

    [Op.CMC] : [
        MachineCycle.create(CycleType.FETCH, [Command.CMC]),
    ],

    [Op.STC] : [
        MachineCycle.create(CycleType.FETCH, [Command.STC]),
    ],

    [Op.DAD_R] : [
        MachineCycle.create(CycleType.FETCH, [Command.X]),
        new MachineCycle(CycleType.INTERNAL, [Command.RL_ACT,Command.L_TMP, Command.ALU_ADD_L]),
        new MachineCycle(CycleType.INTERNAL, [Command.RH_ACT,Command.H_TMP, Command.ALU_ADC_H]),
    ],

    [Op.RST_N] : [
        MachineCycle.create(CycleType.FETCH, [Command.ZERO_W, Command.SP_DEC]),
        new MachineCycle(CycleType.STACK_WRITE, [Command.SP_OUT,Command.SP_DEC,Command.PCH_DATA]),
        new MachineCycle(CycleType.STACK_WRITE, [Command.SP_OUT,Command.RST_TMP_Z,Command.PCL_DATA]),

    ],
    
    
    
    [Op.NOP]: [MachineCycle.create(CycleType.FETCH, [Command.X])],
} //as Record<Op, MachineCycle[]>;


class InstructionDecoder {

    private testMaskedValue(instruction : byte, value: byte, mask: byte): boolean {
        if((value & mask) != value){
            throw new Error("Value cannot exceed mask bits!");
        }
        return ( instruction & mask ) === value;
    }
    private testOctal2(instruction : byte, value: byte): boolean {
        return this.testMaskedValue(instruction,value, 0b11000000);
    }
    private testOctal1(instruction : byte, value: byte): boolean {
        return this.testMaskedValue(instruction,value, 0b00111000);
    }
    private testOctal0(instruction : byte, value: byte): boolean {
        return this.testMaskedValue(instruction,value, 0b00000111);
    }

    public decode(instruction : byte): MachineCycle[] {
        // const isMemRead = this.testOctal0(instruction, 0b00000110);
        return decodeTable[opcodes[instruction]]
    }
}


export { InstructionDecoder , Command , rpTableWZ, instructionName, opcodes, Op}