import { useMemo, useState, useEffect } from 'react';
import { Layout, Button, Badge, message, Select } from 'antd';
import { ShoppingCartOutlined, UpOutlined, GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import useDevice from './hooks/useDevice';
import CartDrawer from './components/CartDrawer';
import ProductList from './components/ProductList';

const { Header, Content } = Layout;

export default function App() {
  const { isMobile } = useDevice();
  const { t, i18n } = useTranslation();
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('locale', lng);
  };

  const addToCart = (product) => {
    if (product.stock === 0) {
      message.warning(t('outOfStock'));
      return;
    }
    setCart(prev => {
      const found = prev.find(item => item.id === product.id);
      if (found) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    message.success(`${t('added')}: ${product.name}`);
  };

  const changeQty = (id, qty) => {
    if (qty < 1) return;
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty } : item));
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((s, i) => s + i.qty * i.price, 0), [cart]);
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout className={`app-layout ${isMobile ? 'is-mobile' : 'is-pc'}`}>
      <Header className="app-header">
        <div className="app-header-left">
          <span className="app-logo">{t('appName')}</span>
        </div>
        <div className="app-header-right">
          <Select
            size="small"
            value={i18n.language}
            onChange={changeLang}
            className="lang-switch"
            suffixIcon={<GlobalOutlined style={{ color: '#fff', fontSize: 13 }} />}
            options={[
              { value: 'en', label: 'EN' },
              { value: 'zh', label: '中文' },
            ]}
          />
          <Badge count={totalCount} size="small" color="#ffd161" offset={[-2, 2]}>
            <Button
              type="text"
              className="app-cart-btn"
              icon={<ShoppingCartOutlined className="app-cart-btn-icon" />}
              onClick={() => setCartOpen(true)}
            >
              <span className="app-cart-btn-text">{t('cart')}</span>
            </Button>
          </Badge>
        </div>
      </Header>

      <Content className="app-content">
        <ProductList onAdd={addToCart} t={t} />
      </Content>

      {isMobile && (
        <div className="mobile-cart-bar" onClick={() => setCartOpen(true)}>
          <Badge count={totalCount} size="small" color="#ffd161" offset={[0, 0]}>
            <ShoppingCartOutlined style={{ fontSize: 22, color: '#fff' }} />
          </Badge>
          <span className="mobile-cart-bar__text">{t('cart')}</span>
        </div>
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onChangeQty={changeQty}
        onRemove={removeItem}
        totalPrice={totalPrice}
        isMobile={isMobile}
        t={t}
      />

      {showBackTop && (
        <button className="back-top-btn" onClick={scrollToTop} aria-label={t('backToTop')}>
          <UpOutlined />
        </button>
      )}
    </Layout>
  );
}
