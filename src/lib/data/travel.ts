/**
 * Travel exploration levels and per-country data.
 * Uses ISO 3166-1 alpha-3 codes (matching visionscarto-world-atlas).
 *
 * Levels:
 *   1 = layover / transit
 *   2 = brief visit    (a few days)
 *   3 = explored       (weeks)
 *   4 = extended stay   (months+)
 *   5 = lived there
 */

export const levels = [
	{ id: 0, label: "unvisited", color: "transparent" },
	{ id: 1, label: "layover", color: "#081a26" },
	{ id: 2, label: "brief visit", color: "#0e3450" },
	{ id: 3, label: "explored", color: "#1c7ea5" },
	{ id: 4, label: "extended", color: "#1f88b5" },
	{ id: 5, label: "lived there", color: "#3eadd5" },
] as const;

export const travelData: Record<string, number> = {
	// 5 lived there
	RUS: 5,
	ISR: 5,
	CAN: 5,

	// 4 extended / explored thoroughly
	JPN: 4,
	UKR: 4,
	MNE: 4,

	// 3 explored (weeks, multiple cities)
	ITA: 3,
	VAT: 3,

	// 2 brief / barely remember
	AND: 2,
	GEO: 2,
	GRC: 2,
	GBR: 2,
	MKD: 2,
	BLR: 2,
	ESP: 2,
	SWE: 2,
	FIN: 2,
	DNK: 2,
	DEU: 2,
	AUT: 2,
	POL: 2,
	MDA: 2,
	ROU: 2,
	BGR: 2,
	HUN: 2,
	LTU: 2,
	LVA: 2,
	EGY: 2,
	BEL: 2,
	SVK: 2,

	// 1 layover
	CHN: 1,
	ISL: 1,
	TUR: 1,
};
