export type Region = |"Africa" | "Americas" | "Asia" |"Europe"| "Oceania" | "Antarctic"

export interface Country{
    names: {
        common: string;
    };
    flag: {
        url_svg: string;
    };
    population: number;
    region: Region;
}