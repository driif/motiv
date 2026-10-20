import { LikeButton } from '@driif/motiv';
import { useState } from 'react';

export function LikeButtonDemo() {
  const [liked, setLiked] = useState(false);
  return <LikeButton liked={liked} count={128 + (liked ? 1 : 0)} onToggle={setLiked} />;
}
