//@ts-nocheck
import { Image as ChakraImg } from '@chakra-ui/react';
import { cache } from 'react';
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

  // if (typeof window === 'undefined') {
  //   unstable_postpone('client only');
  // }

  await loadImage(src);
  return (
    <ChakraImg
      src={src}
      alt='blog image'
      width='100%'
      height='auto'
      objectFit='cover'
      objectPosition='center'
      htmlWidth='600'
      backgroundColor='black'
      htmlHeight='330'
      maxHeight='330px'
      // border='1px solid #232323'
      loading='lazy'
      onError={(e) => {
        const img = e.target as HTMLImageElement;

        img.src = 'https://placehold.co/600x400/000/FFF/webp?text=Image&font=roboto';
      }}
      {...props}
    />
  );
}
