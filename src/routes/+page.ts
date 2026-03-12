export const prerender = true;

export const load = () => {
	const modules = import.meta.glob("../posts/*.md", { eager: true });

	const posts = Object.entries(modules)
		.map(([path, module]: [string, any]) => ({
			slug: path.split("/").pop()!.replace(".md", ""),
			...module.metadata,
		}))
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.slice(0, 3);

	const statusRaw = import.meta.glob("../../status.txt", {
		eager: true,
		query: "?raw",
		import: "default",
	});
	const statusText = Object.values(statusRaw)[0] as string;
	const status = statusText
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);

	return { posts, status };
};
