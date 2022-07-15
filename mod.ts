import { join } from "https://deno.land/std/path/mod.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";
import { parse } from "https://deno.land/std@0.148.0/encoding/csv.ts";
import * as _ from "https://deno.land/x/lodash@4.17.15-es/lodash.js";
interface Planet {
    [ key : string ] : string 
}

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
    const planets = (result as Array<Planet>).filter(planet =>{
        const planetRadius = Number(planet["koi_prad"]);
        const starsMass = Number(planet["koi_smass"]);
        const starRadius = Number(planet["koi_srad"]);
        return planet["koi_disposition"] === "CONFIRMED" 
            && planetRadius > 0.5 && planetRadius < 1.5 
            && starsMass > 0.78 && starsMass < 1.04
            && starRadius > 0.99 && starsMass < 1.01;
    });
    
    return planets.map(planet => {
        return _.pick(planet, [
            "koi_prad",
            "koi_smass",
            "koi_srad",
            "kepler_name",
            "koi_count",
            "koi_steff",
            "koi_period"
        ])
    });    
}

const newEarths = await loadPlanetsData();
for (const planet of newEarths) {
    console.log(planet);
}
console.log(`${newEarths.length} habitable planets found`)

const longestOrbitalPeriod = Math.max(...newEarths.map(p => p["koi_period"]))
const shortestOrbitalPeriod = Math.min(...newEarths.map(p => p["koi_period"]))

console.log("Max Orbital Period: " + longestOrbitalPeriod)
console.log("Min Orbital Period: " + shortestOrbitalPeriod)