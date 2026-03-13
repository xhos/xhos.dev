export const projects = [
	{
		name: "nix",
		description: "nixos configs for ~5 hosts + homelab",
		repo: "https://github.com/xhos/nix",
		lang: "nix",
		details:
			"declarative configs for my desktop, laptop, server and a few other hosts. managed with flakes, home-manager for user env, and a bunch of custom modules.",
		screenshots: [
			"https://i.pinimg.com/736x/f2/35/62/f23562b25c29df7fb81a2f5a5c2d502e.jpg",
			"https://i.pinimg.com/1200x/59/b9/52/59b95228fc531150dff6e5a9fd57473d.jpg",
			"https://i.pinimg.com/736x/f7/92/8d/f7928de705cfabe9c8edf52f59c132d9.jpg",
		],
	},
	{
		name: "null",
		description:
			"way too complex of a finance tracker im making for my personal use",
		repo: "https://github.com/xhos/null-core",
		lang: "go",
		details:
			"a personal finance tracker with transaction ingestion, category rules, and a tui. probably overkill but that's the point.",
		screenshots: [] as string[],
	},
	{
		name: "yawn",
		description: "a minimalistic yet good-looking TUI greeter",
		repo: "https://github.com/xhos/yawn",
		lang: "go",
		details:
			"a login greeter for wayland/tty that stays out of your way. just a username, password, and session picker.",
		screenshots: [] as string[],
	},
];

export const langColor: Record<string, string> = {
	nix: "#7ebae4",
	go: "#00add8",
	typescript: "#3178c6",
	python: "#3572a5",
};
