import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h1: (props) => (
    <h1 className="text-2xl md:text-3xl font-extrabold text-primary text-center mb-6" {...props} />
  ),

  h2: (props) => <h2 className="text-2xl font-bold text-primary mt-10 mb-4" {...props} />,

  h3: (props) => <h3 className="text-xl font-bold text-primary mt-8 mb-3" {...props} />,

  h4: (props) => <h3 className="text-lg font-semibold text-primary mt-8 mb-3" {...props} />,

  p: (props) => <p className="text-base leading-7 text-medium-dark mt-4" {...props} />,

  strong: (props) => <strong className="text-off-black font-bold" {...props} />,

  ul: (props) => <ul className="list-disc pl-6 mt-4 text-medium-dark" {...props} />,

  ol: (props) => <ol className="list-decimal pl-6 mt-4 text-medium-dark" {...props} />,

  li: (props) => <li className="leading-7 text-medium-dark" {...props} />,

  a: (props) => <a className="text-primary underline" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
