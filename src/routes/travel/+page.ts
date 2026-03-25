import { geoGraticule, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import atlas from "visionscarto-world-atlas/world/50m.json";
import { travelData } from "$lib/data/travel";

export const prerender = true;

export function load() {
	const VW = 960;
	const VH = 540;

	const topo = atlas as any; // eslint-disable-line @typescript-eslint/no-explicit-any
	const land = feature(topo, topo.objects.land) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
	const countries = feature(topo, topo.objects.countries) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

	const projection = geoNaturalEarth1().fitSize([VW, VH], land);
	const path = geoPath(projection);

	const landPath = path(land)!;
	const graticulePath = path(geoGraticule().step([20, 20])())!;

	const visited = countries.features
		.map((f: any) => {
			// eslint-disable-line @typescript-eslint/no-explicit-any
			const a3 = f.properties?.a3 as string;
			const level = travelData[a3] ?? 0;
			if (level === 0) return null;
			return {
				d: path(f)!,
				name: f.properties.name as string,
				a3,
				level,
			};
		})
		.filter(Boolean) as {
		d: string;
		name: string;
		a3: string;
		level: number;
	}[];

	return { landPath, graticulePath, visited, VW, VH };
}
