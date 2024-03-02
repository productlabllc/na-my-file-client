import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

function MDContent({ content }: { content: string }) {
  return (
    <Markdown
      className="!m-0 markdown lg:d-text-body-md"
      //@ts-expect-error cannot read plugin
      rehypePlugins={[rehypeRaw]}
    >
      {content}
    </Markdown>
  );
}

export default MDContent;
