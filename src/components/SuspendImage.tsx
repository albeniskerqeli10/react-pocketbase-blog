//@ts-nocheck
import { cache, unstable_postpone } from 'react';
import { preload } from 'react-dom';

const loadImage = cache((src: string) => {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.src = src;

    if (img.complete) {
      return resolve();
    } else {
      img.onload = () => resolve();
      img.onerror = reject;
    }
  });
});

type Props = React.ComponentPropsWithoutRef<'img'>;

export default async function SuspendableImage({ src, ...props }: Props) {
  preload(src, { as: 'image' });

  if (typeof window === 'undefined') {
    unstable_postpone('client only');
  }

  await loadImage(src);

  return <img src={src} {...props} />;
}
