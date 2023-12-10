
export class MemoryMap{
    memsize: number
    memorybuffer: ArrayBuffer
    mem: Uint8Array

    constructor(size: number){
        this.memsize = size;
        this.memorybuffer = new ArrayBuffer(this.memsize);
        this.mem = new Uint8Array(this.memorybuffer);
    }

    async loadBinaryResource(url: string){
        let byteArray = [];
        let req = await fetch(url);
        if (req.status != 200) return byteArray;

        return  new Uint8Array (await req.arrayBuffer());
    }

    async addROM(name: any, addr: number, size: number, url: string) {
        await this.loadBinaryResource(url).then((loadedRom)=>{
            for (let i = 0; i < size; i++) {
                this.mem[i + addr] = loadedRom[i];
            }
        });
    }

    read(addr: number) {
        return this.mem[addr]
    }

    write(addr: number, value: number) {
        if(addr < 0x8000){
            console.log(`NO RAM at address ${addr.toString(16)}`)
            return;
        }
        this.mem[addr] = value & 0x00FF;
    }
}