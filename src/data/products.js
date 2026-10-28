import dayjs from 'dayjs';

// 生成 100 条模拟商品数据，用于演示长列表懒加载
const CATEGORIES = ['数码配件', '家居生活', '食品生鲜', '美妆个护', '服饰鞋包', '图书文娱'];
const NAMES = [
  '无线蓝牙耳机', '便携充电宝', '机械键盘', '人体工学椅', '智能保温杯',
  '香薰蜡烛', '有机咖啡豆', '氨基酸洁面乳', '纯棉T恤', '降噪头戴耳机',
  '桌面加湿器', '乳胶枕', '牛排套餐', '防晒霜SPF50', '帆布鞋',
  '机器学习入门', '数据线三合', '护眼台灯', '空气炸锅', '保湿面霜',
];

const COLORS = ['#f56a00', '#7265e6', '#00a2ae', '#eb2f96', '#52c41a', '#1890ff'];

function generateProducts(count = 100) {
  const list = [];
  for (let i = 1; i <= count; i++) {
    const name = NAMES[i % NAMES.length];
    // 随机让约 15% 的商品售罄
    const outOfStock = i % 7 === 0;
    list.push({
      id: i,
      name: `${name} #${i}`,
      category: CATEGORIES[i % CATEGORIES.length],
      price: Number((Math.random() * 400 + 19).toFixed(2)),
      color: COLORS[i % COLORS.length],
      date: dayjs().subtract(i, 'day').format('YYYY-MM-DD'),
      sales: Math.floor(Math.random() * 9999),
      stock: outOfStock ? 0 : Math.floor(Math.random() * 200) + 10,
    });
  }
  return list;
}

export const PRODUCTS = generateProducts(100);
