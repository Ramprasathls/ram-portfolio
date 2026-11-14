type Project = {
  title: string;
  description: string;
  image: string;
  codeUrl: string;
  liveUrl: string;
  badge?: string;
};

// Mock data until real projects are ready.
const projects: Project[] = [
  {
    title: 'Prompt Playground',
    description:
      'A side-by-side sandbox for comparing prompts and model outputs.',
    image: 'https://avatar.vercel.sh/lab1',
    codeUrl: 'https://github.com/ramprasathls',
    liveUrl: '#',
    badge: 'Featured'
  },
  {
    title: 'RAG Notes',
    description:
      'Chat with my course notes using retrieval-augmented generation.',
    image: 'https://avatar.vercel.sh/lab2',
    codeUrl: 'https://github.com/ramprasathls',
    liveUrl: '#'
  },
  {
    title: 'Agent To-Do',
    description:
      'A small agent that turns messy notes into a prioritised task list.',
    image: 'https://avatar.vercel.sh/lab3',
    codeUrl: 'https://github.com/ramprasathls',
    liveUrl: '#',
    badge: 'New'
  },
  {
    title: 'Vision Sorter',
    description:
      'Upload a folder of photos and let a vision model tag and group them.',
    image: 'https://avatar.vercel.sh/lab4',
    codeUrl: 'https://github.com/ramprasathls',
    liveUrl: '#'
  },
  {
    title: 'Voice Journal',
    description:
      'Speak a daily entry and get a transcript, summary, and mood trend.',
    image: 'https://avatar.vercel.sh/lab5',
    codeUrl: 'https://github.com/ramprasathls',
    liveUrl: '#'
  },
  {
    title: 'Eval Dashboard',
    description:
      'Track how prompt changes affect accuracy across a fixed test set.',
    image: 'https://avatar.vercel.sh/lab6',
    codeUrl: 'https://github.com/ramprasathls',
    liveUrl: '#'
  }
];

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

// Adapted from shadcn's card-image example, without the ui/* dependencies.
export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pb-4 shadow-sm">
      <div className="relative">
        <img
          src={project.image}
          alt={`${project.title} cover`}
          className="aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug">{project.title}</h3>
          {project.badge && (
            <span className="shrink-0 rounded-md bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-zinc-300">
              {project.badge}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          {project.description}
        </p>
      </div>
      <div className="flex gap-2 px-4">
        <a
          href={project.codeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-gray-200 dark:border-zinc-700 px-3 py-1.5 text-sm font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <GitHubIcon />
          Code
        </a>
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center rounded-md bg-gray-900 dark:bg-zinc-100 px-3 py-1.5 text-sm font-medium text-white dark:text-zinc-900 hover:bg-gray-700 dark:hover:bg-zinc-300 transition-colors"
        >
          Live Site
        </a>
      </div>
    </div>
  );
}

export function ProjectGrid() {
  return (
    <div className="wide [--wide-width:48rem] grid grid-cols-1 gap-4 sm:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.title} project={project} />
      ))}
    </div>
  );
}
