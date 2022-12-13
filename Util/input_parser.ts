import fs from "fs";
import path from "path";


export function parseLines(dir_name: string, file_name: string): string[]{
    return fs
        .readFileSync(path.join(dir_name, file_name), 'utf8')
        .toString()
        .trim()
        .split('\n');
}
