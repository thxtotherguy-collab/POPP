import catalogData from './ebaraCatalog.json';

export const PLACEHOLDER_IMAGE = '/images/pumps/placeholder.svg';

export function resolveProductImage(image) {
  if (typeof image !== 'string' || !image.trim()) {
    return PLACEHOLDER_IMAGE;
  }

  const normalizedPath = image.trim().replace(/\\/g, '/');
  const filename = normalizedPath.split('/').pop();

  if (!filename) {
    return PLACEHOLDER_IMAGE;
  }

  let decodedFilename = filename;
  try {
    decodedFilename = decodeURIComponent(filename);
  } catch {
    decodedFilename = filename;
  }

  return `/images/pumps/${encodeURIComponent(decodedFilename)}`;
}

export function handleProductImageError(event) {
  const imageElement = event.currentTarget;
  if (!imageElement) return;

  const currentSource = imageElement.getAttribute('src') || '';
  if (
    currentSource.endsWith(PLACEHOLDER_IMAGE) ||
    imageElement.dataset.fallbackApplied === 'true'
  ) {
    return;
  }

  imageElement.dataset.fallbackApplied = 'true';
  imageElement.src = PLACEHOLDER_IMAGE;
}

export function toStoreProduct(product) {
  if (!product) return null;

  const imagePath = resolveProductImage(product.image);
  const specs = {
    ...(product.power_kw > 0 && { power: `${product.power_kw} kW` }),
    series: product.series,
  };

  return {
    ...product,
    slug: product.id,
    category_slug: product.category,
    short_description: product.description,
    images: [imagePath],
    image_path: imagePath,
    in_stock: true,
    specs,
    tags: [product.series, product.category].filter(Boolean),
  };
}

export const catalogProducts = catalogData.map(toStoreProduct);

export function findCatalogProduct(identifier) {
  return catalogProducts.find(
    (product) => product.id === identifier || product.slug === identifier
  ) || null;
}

export function getRelatedCatalogProducts(product, limit = 4) {
  if (!product) return [];

  return catalogProducts
    .filter((candidate) =>
      candidate.id !== product.id && candidate.category === product.category
    )
    .slice(0, limit);
}
