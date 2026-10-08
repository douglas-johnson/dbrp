import {useMemo} from 'react';
import {getExcerpt} from '../text.utilities';
import {Post} from './types';
import Heading, {HeadingLevel} from '~/components/heading/Heading';
import {Link} from 'react-router';

export default function PostPreview({
  headingLevel = 3,
  post,
  TagName,
}: {
  headingLevel: HeadingLevel;
  post: Post;
  TagName: 'article' | 'li';
}): React.ReactNode {
  const excerpt = useMemo(() => getExcerpt(post.content), [post.content]);
  const patreonUrl = `https://patreon.com${post.url}`;
  return (
    <TagName className="dbrp-post-preview">
      <div className="rhythm">
        <Heading
          headingLevel={headingLevel}
          style={{fontSize: 'var(--font-size-step-1)'}}
        >
          <Link to={patreonUrl}>{post.title}</Link>
        </Heading>
        <p style={{fontSize: 'var(--font-size-step-n-2)'}}>
          <time>{new Date(post.pubdate).toLocaleDateString()}</time>
        </p>
        <p style={{fontSize: 'var(--font-size-step-n-1)'}}>{excerpt}</p>
      </div>
    </TagName>
  );
}
