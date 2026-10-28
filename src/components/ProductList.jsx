import { useEffect, useRef, useState, useCallback } from 'react';
import { Row, Col, Spin, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PRODUCTS } from '../data/products';

const PAGE_SIZE = 12;

const CATEGORY_EMOJI = {
  '数码配件': '🎧',
  '家居生活': '🏠',
  '食品生鲜': '🍎',
  '美妆个护': '💄',
  '服饰鞋包': '👟',
  '图书文娱': '📚',
};

function ProductCard({ product, onAdd, t }) {
  const emoji = CATEGORY_EMOJI[product.category] || '📦';
  const soldOut = product.stock === 0;
  const cardClass = soldOut ? 'product-card product-card--soldout' : 'product-card';

  return (
    <div className={cardClass}>
      <div
        className="product-card__image"
        style={{ background: `linear-gradient(135deg, ${product.color}18, ${product.color}44)` }}
      >
        {emoji}
        {soldOut && (
          <div className="soldout-mask">
            <span className="soldout-mask__text">{t('soldOut')}</span>
          </div>
        )}
      </div>

      <div className="product-card__info">
        <span className="product-card__price">¥{product.price.toFixed(2)}</span>
        <div className="product-card__name">{product.name}</div>
        <div className="product-card__meta">
          <Tag color={product.color} style={{ fontSize: 10, margin: 0 }}>{product.category}</Tag>
          {!soldOut && <span className="product-card__sales">{t('soldCount', { count: product.sales })}</span>}
        </div>
      </div>

      {!soldOut && (
        <button
          className="product-card__add-btn"
          onClick={(e) => { e.stopPropagation(); onAdd(product); }}
        >
          <PlusOutlined />
        </button>
      )}
    </div>
  );
}

export default function ProductList({ onAdd, t }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  const visibleProducts = PRODUCTS.slice(0, visibleCount);
  const hasMore = visibleCount < PRODUCTS.length;

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    setLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + PAGE_SIZE, PRODUCTS.length));
      setLoading(false);
    }, 400);
  }, [hasMore, loading]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  return (
    <>
      <Row gutter={[12, 12]}>
        {visibleProducts.map(p => (
          <Col key={p.id} xs={12} sm={8} md={6} lg={6} xl={4}>
            <ProductCard product={p} onAdd={onAdd} t={t} />
          </Col>
        ))}
      </Row>

      <div ref={sentinelRef} className="lazy-sentinel">
        {loading ? <Spin size="small" />
          : hasMore ? <span>{t('loadingMore')}</span>
          : <span>{t('noMore')}</span>}
      </div>
    </>
  );
}
