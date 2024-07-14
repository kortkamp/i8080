
import fs from "node:fs";



const loadHex = (file: string, memory : number[]) => {
    try {
        const data = fs.readFileSync(file, 'utf8') as string;
        data.split('\n')
            .filter(line  => line !== '')
            .forEach((line, index) => {
            if(line.charAt(0) !== ':'){
                console.log(" line" , line)
                throw new Error(`Line ${index} does not matches Hex format`)
            }
            const data = line.substring(1).match(/.{1,2}/g)?.map((b, i) => parseInt(b, 16)) as number[];

            const bytesCount = data[0];
            const address = data[1] * 256 + data[2];
            const recordType = data[3];
            const checkSum = data.slice(-1)[0];

            for(let i = 0 ; i < bytesCount; i += 1){
                memory[address + i] = data[4 + i];
            }

            // console.log("line ----------------------- ")

            // console.log("bytesCount ", bytesCount)
            // console.log("address ", address)
            // console.log("recordType ", recordType)
            // console.log("checkSum ", checkSum)


        })
      } catch (err) {
        console.error(err);
      }
};


const loadBin = (file: string, memory : number[]) => {

    try {
        const data = fs.readFileSync(file) as any as number[];


        data.forEach((b, index) => memory[index] = b )

      } catch (err) {
        console.error(err);
      }
};

const writeBin = (file: string, content : number[]) => {
    fs.writeFile(file, Buffer.from(content) , (e) => {}  )
}

const loadText = (file: string) :  number[] => {

    const data = fs.readFileSync(file) as any as number[];

    // console.log(data.length);

    const a : number[] =  []

    data.forEach(e => a.push(e))

    return a ;
};


export { loadHex, loadBin , loadText, writeBin}
