import { CPU } from "./CPU";
import { IExternalBus } from "./IO";
import { loadBin, loadHex, loadText } from "./loader";
import { byte, word } from "./types";

import readline from "readline/promises"

const memory = new Array<number>(0x1FFFF).fill(0);

const load = (content: string , address: number) => {
    content.match(/.{1,2}/g)?.forEach((b, i) => memory[i + address] = parseInt(b, 16));
}


const DEBUG = false; 

let buffer : byte[] = [];

const cassete : byte[] = loadText('./bin/cassete.bin')

const loadFile = () => {
    buffer = loadText('./bin/chess.bas')
}

const rl = readline.createInterface({
    input: process.stdin,
    // output: process.stdout,
    terminal: true
})

process.stdin.on('keypress', (c : string, k) => {

    if(c){
        let char = Buffer.from(c, "ascii")[0]
        if(char === 24 ){
            char = 3
        }
        buffer.push(char)
    }else {
        
        // console.log(k)

        if(k.name === 'end'){
            // loadFile();
        }
        if(k.name === 'delete'){
            // this.buffer.push(0x7F);
        }
    }
}); 


// loadHex('./bin/BDOS.hex', memory);
// loadHex('./bin/CPUDIAG.hex', memory);

loadBin('./bin/exbas.bin', memory);

const isEmpty = ()=> buffer.length === 0;

const externalBus: IExternalBus = {
    read : (port: word) => {
        let value = 0;

        switch (port ) {

            //basic 8k
            case 0:
                return 0x0
                value = isEmpty() ? 0x00  : 0XFF
                break;
            case 1:
                value = isEmpty() ? 0 : buffer.shift() as byte;
                break;

            case 0x13: 
                value = 0x0
             break;

            case 0x10:
                value = 0xff
                break;
                         
            case 0x11:
                value = 0xff
                break;

            // FOR BASIC 4K 3.2
            // case 0:
            //     // return 0x1
            //     value = this.isEmpty() ? 0x0f : 0xff
            //     break;
            // case 1:
            //     // return 0xff
            //     value =  this.isEmpty() ? 0 : this.buffer.shift() as byte;
            //     break;



            case 0x6:
                value =  cassete.length > 0 ?  0x0 : 0x0; 
                break;
            case 0x7:
                if(cassete.length > 0) {
                    value = cassete.shift() as number;
                } else {
                    value = 0;
                }
                break;

            

            case 0x13 : 
                value =  0x0; 
                break;
            case 251: 
                value =  isEmpty() ? 1 : 0xFF
                break;
            case 250: 
                value =  isEmpty() ? 0 : buffer.shift() as byte;
                break;


            // for 4k ff , for 8k 0
            case 0xFF: 
                value =  0xff;
                break;


            default:
                value =  0;
        }

        // if(this.DEBUG){
        //    console.log("read ", port.toString(16).toUpperCase().padStart(2,'0') , " << " + value )
        // }

        return value;
    },

    write : (port: word, value: byte) => {
        let char = String.fromCharCode( value & 0X7F )

        if(DEBUG){
            console.log(port.toString(16).toUpperCase().padStart(2,'0'), value.toString(16).toUpperCase().padStart(2,'0'))
            return
        }
        // this.data[this.addressBus.read()] = value;
        switch(port & 0X0F){
            case 1:
                process.stdout.write(char);
                break;

            // case 0X11:
            //     process.stdout.write(char);
            //     break;

            case 0x7:
                cassete.push(value);
    
            default:
                // process.stdout.write(char);

        }
    }
}


// loadHex('./bin/tinybasic2.hex', memory);

// load("AF3EAA27",0);

const cpu = new CPU(memory, externalBus);

const printMemory = (start: number, end: number) => {
    let content = "";
    memory
        .filter((m, i) => i >= start && i<=end )
        .forEach((m, i) => {
            if(i % 16  === 0){
                console.log(content);
                content = "";
            }
            content += m.toString(16).padStart(2, '0') + ' ';
        })
}


setInterval(()=> { cpu.runSteps(5000) }, 1)





