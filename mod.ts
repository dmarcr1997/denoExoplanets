import { join } from "https://deno.land/std/path/mod.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";
import { parse } from "https://deno.land/std@0.148.0/encoding/csv.ts";

async function loadPlanetsData() {
    const path = join("data", "kepler_exoplanets_nasa.csv");

    const file = await Deno.open(path);
    const bufReader = new BufReader(file);
    const options = {
        skipFirstRow: true,
        comment: "#",
    };
    const result = await parse(bufReader, options);
    Deno.close(file.rid);

    console.log("The Result: ", result);
    
}

loadPlanetsData()