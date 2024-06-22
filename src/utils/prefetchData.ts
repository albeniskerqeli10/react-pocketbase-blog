export function prefetchBlog(id: string) {
  // let isCached = false;
  // const prefetchLinks = document.querySelectorAll('[rel="prefetch"]');
  const prefetchLink = document.createElement('link');
  prefetchLink.rel = 'prefetch';
  prefetchLink.href = `${
    import.meta.env.POCKETBASE_URL
  }/api/collections/blogs/records/${id}?expand=user%2C%20comments(blog).user%2C%20tags`;
  console.log(prefetchLink.outerHTML);
  // const imgLn = document.createElement('link');
  // imgLn.rel = 'preload';
  // imgLn.href = image;
  // imgLn.as = 'image';
  // imgLn.crossOrigin = 'anonymous';
  const headTag = document.getElementsByTagName('head')[0].innerHTML;
  if (!headTag.includes(prefetchLink.href)) {
    return document.head.appendChild(prefetchLink);
  }
}
