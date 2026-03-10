export const prerender = true;

export const load = () => {
	const modules = import.meta.glob("../../posts/*.md", { eager: true });

	const posts = Object.entries(modules)
		.map(([path, module]: [string, any]) => ({
			slug: path.split("/").pop()!.replace(".md", ""),
			...module.metadata,
		}))
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return { posts };
};
