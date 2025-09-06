import fs from "fs";
import rl from 'readline';

const getArgumentValue = (key, args) => {
    const value = args.find((value) => value.startsWith(`--${key}=`))

    if (!value) {
        throw new Error(`Argument ${key} is required`)
    }

    return value.split('=')[1];
} 

(async () => {
    const args = process.argv.slice(2);

    const input = getArgumentValue('input', args)
    const output = getArgumentValue('output', args)
    const findValue = getArgumentValue('find', args)

    const readStream = fs.createReadStream(input);
    const writeStream = fs.createWriteStream(output)
    const readline = rl.createInterface(readStream);

    readStream.on('error', (error) => {
        console.error(`Произошла ошибка во время чтения: ${error.message}`)
    })

    writeStream.on('error', (error) => {
        console.error(`Произошла обшибка во время записи: ${error.message}`)
    })

    readline.on('close', () => {
        console.log('Чтение завершено')
        readStream.close();

        console.log('Запись завершена')
        writeStream.close();
    })
    
    for await (let line of readline) {
        if (line.toLocaleLowerCase().includes(findValue.toLocaleLowerCase())) {
            writeStream.write(`${line}\n`)
        }
    }
})()
