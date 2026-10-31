import type { EditorialImage as ImageData } from "../../types/editorial";

export function EditorialImage({ image, className, sizes = "(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw" }: {
  image: ImageData; className?: string; sizes?: string;
}) {
  return <img className={className} src={image.src} srcSet={image.srcSet} sizes={image.srcSet ? sizes : undefined} width={image.width || undefined} height={image.height || undefined} alt={image.alt} loading="lazy" decoding="async" />;
}
