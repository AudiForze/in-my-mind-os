const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
	basePath: isGitHubPages ? "/in-my-mind-os" : "",
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
