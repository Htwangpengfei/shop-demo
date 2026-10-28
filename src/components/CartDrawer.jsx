import { Drawer, List, Button, Empty, Popconfirm } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';

function QtyStepper({ value, onMinus, onPlus }) {
  return (
    <div className="qty-stepper">
      <Button
        type="text" size="small" icon={<MinusOutlined />}
        disabled={value <= 1}
        onClick={onMinus}
        className="qty-stepper__btn qty-stepper__btn--minus"
      />
      <span className="qty-stepper__value">{value}</span>
      <Button
        type="text" size="small" icon={<PlusOutlined />}
        onClick={onPlus}
        className="qty-stepper__btn qty-stepper__btn--plus"
      />
    </div>
  );
}

const CATEGORY_EMOJI = {
  '数码配件': '🎧', '家居生活': '🏠', '食品生鲜': '🍎',
  '美妆个护': '💄', '服饰鞋包': '👟', '图书文娱': '📚',
};

export default function CartDrawer({ open, onClose, cart, onChangeQty, onRemove, totalPrice, isMobile, t }) {
  return (
    <Drawer
      title={<span style={{ fontWeight: 600 }}>{t('cart')}</span>}
      placement="right"
      width={isMobile ? '100%' : 400}
      onClose={onClose}
      open={open}
      styles={{ header: { borderBottom: '1px solid #f0f0f0' } }}
      footer={
        <div className="cart-footer">
          <div className="cart-total-row">
            <span className="cart-total-label">{t('total')}:</span>
            <span className="cart-total-price">¥{totalPrice.toFixed(2)}</span>
          </div>
          <Button
            type="primary" size="large" block
            disabled={cart.length === 0}
            className="cart-checkout-btn"
            onClick={() => alert(t('orderSuccess', { price: totalPrice.toFixed(2) }))}
          >
            {t('checkout', { count: cart.length })}
          </Button>
        </div>
      }
    >
      <div className="cart-drawer-body">
        {cart.length === 0 ? (
          <Empty description={t('emptyCart')} style={{ marginTop: 100 }} />
        ) : (
          <List
            dataSource={cart}
            split={true}
            renderItem={item => (
              <List.Item
                key={item.id}
                style={{ padding: '12px 0' }}
                actions={[
                  <QtyStepper
                    key="qty"
                    value={item.qty}
                    onMinus={() => onChangeQty(item.id, item.qty - 1)}
                    onPlus={() => onChangeQty(item.id, item.qty + 1)}
                  />,
                  <Popconfirm key="del" title={t('confirmDelete')} onConfirm={() => onRemove(item.id)} okText={t('delete')} cancelText={t('cancel')}>
                    <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                  </Popconfirm>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div
                      className="cart-item-avatar"
                      style={{ background: `linear-gradient(135deg, ${item.color}18, ${item.color}44)` }}
                    >
                      {CATEGORY_EMOJI[item.category] || '📦'}
                    </div>
                  }
                  title={
                    <div>
                      <div style={{ fontSize: 13, color: '#333', marginBottom: 4 }}>{item.name}</div>
                      <span className="cart-item-price">¥{item.price.toFixed(2)}</span>
                    </div>
                  }
                  description={
                    <span className="cart-item-subtotal">
                      {t('subtotal', { price: (item.price * item.qty).toFixed(2) })}
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </Drawer>
  );
}
