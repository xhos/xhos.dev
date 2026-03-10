import { error } from "@sveltejs/kit";

const posts = import.meta.glob("../../../posts/*.md");

export const entries = () => {
	return Object.keys(posts).map((path) => ({
		slug: path.split("/").pop()!.replace(".md", ""),
	}));
};

export const load = async ({ params }) => {
	const postPath = `../../../posts/${params.slug}.md`;

	if (!(postPath in posts)) {
		error(404, "Post not found");
	}

	const post = (await posts[postPath]()) as any;

	return {
		content: post.default,
		meta: post.metadata,
	};
};
