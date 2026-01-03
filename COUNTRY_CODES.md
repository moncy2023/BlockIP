# 国家代码快速配置示例

## 常见配置场景

### 场景1: 拦截中国和俄罗斯
```javascript
const BLOCKED_COUNTRIES = [
  'CN',  // 中国
  'RU',  // 俄罗斯
];
```

### 场景2: 拦截所有东亚国家
```javascript
const BLOCKED_COUNTRIES = [
  'CN',  // 中国
  'JP',  // 日本
  'KR',  // 韩国
  'KP',  // 朝鲜
  'TW',  // 台湾
  'HK',  // 香港
  'MO',  // 澳门
];
```

### 场景3: 拦截高风险地区
```javascript
const BLOCKED_COUNTRIES = [
  'CN',  // 中国
  'RU',  // 俄罗斯
  'KP',  // 朝鲜
  'IR',  // 伊朗
  'SY',  // 叙利亚
  'CU',  // 古巴
  'VE',  // 委内瑞拉
];
```

### 场景4: 仅允许特定国家访问（反向思维）
如果您想只允许某些国家访问，需要列出所有其他国家。这种情况建议使用白名单模式。

要实现白名单模式，请修改代码中的 `isCountryBlocked` 函数：

```javascript
/**
 * 检查国家是否在白名单中（修改为白名单模式）
 */
function isCountryBlocked(countryCode) {
  // 白名单国家列表
  const ALLOWED_COUNTRIES = [
    'US',  // 美国
    'GB',  // 英国
    'CA',  // 加拿大
    'AU',  // 澳大利亚
  ];
  
  const normalizedCode = countryCode.toUpperCase();
  const normalizedAllowed = ALLOWED_COUNTRIES.map(c => c.toUpperCase());
  
  // 如果不在白名单中，则拦截
  return !normalizedAllowed.includes(normalizedCode);
}
```

## 完整国家代码列表（按地区分类）

### 东亚
- CN - 中国
- JP - 日本
- KR - 韩国
- KP - 朝鲜
- MN - 蒙古

### 东南亚
- TH - 泰国
- VN - 越南
- MY - 马来西亚
- SG - 新加坡
- ID - 印度尼西亚
- PH - 菲律宾
- MM - 缅甸
- KH - 柬埔寨
- LA - 老挝
- BN - 文莱
- TL - 东帝汶

### 南亚
- IN - 印度
- PK - 巴基斯坦
- BD - 孟加拉国
- LK - 斯里兰卡
- NP - 尼泊尔
- BT - 不丹
- MV - 马尔代夫

### 中亚
- KZ - 哈萨克斯坦
- UZ - 乌兹别克斯坦
- TM - 土库曼斯坦
- KG - 吉尔吉斯斯坦
- TJ - 塔吉克斯坦

### 西亚/中东
- TR - 土耳其
- IR - 伊朗
- IQ - 伊拉克
- SA - 沙特阿拉伯
- AE - 阿联酋
- IL - 以色列
- SY - 叙利亚
- JO - 约旦
- LB - 黎巴嫩
- YE - 也门
- OM - 阿曼
- KW - 科威特
- QA - 卡塔尔
- BH - 巴林

### 欧洲（西欧）
- GB - 英国
- FR - 法国
- DE - 德国
- IT - 意大利
- ES - 西班牙
- PT - 葡萄牙
- NL - 荷兰
- BE - 比利时
- CH - 瑞士
- AT - 奥地利
- IE - 爱尔兰
- LU - 卢森堡

### 欧洲（北欧）
- SE - 瑞典
- NO - 挪威
- DK - 丹麦
- FI - 芬兰
- IS - 冰岛

### 欧洲（东欧）
- RU - 俄罗斯
- UA - 乌克兰
- PL - 波兰
- CZ - 捷克
- SK - 斯洛伐克
- HU - 匈牙利
- RO - 罗马尼亚
- BG - 保加利亚
- BY - 白俄罗斯

### 欧洲（南欧）
- GR - 希腊
- HR - 克罗地亚
- SI - 斯洛文尼亚
- RS - 塞尔维亚
- BA - 波黑
- MK - 北马其顿
- AL - 阿尔巴尼亚
- ME - 黑山

### 北美洲
- US - 美国
- CA - 加拿大
- MX - 墨西哥

### 中美洲
- GT - 危地马拉
- HN - 洪都拉斯
- SV - 萨尔瓦多
- NI - 尼加拉瓜
- CR - 哥斯达黎加
- PA - 巴拿马
- BZ - 伯利兹

### 南美洲
- BR - 巴西
- AR - 阿根廷
- CL - 智利
- CO - 哥伦比亚
- PE - 秘鲁
- VE - 委内瑞拉
- EC - 厄瓜多尔
- BO - 玻利维亚
- PY - 巴拉圭
- UY - 乌拉圭
- GY - 圭亚那
- SR - 苏里南

### 加勒比海
- CU - 古巴
- JM - 牙买加
- HT - 海地
- DO - 多米尼加
- TT - 特立尼达和多巴哥
- BS - 巴哈马

### 非洲（北非）
- EG - 埃及
- LY - 利比亚
- TN - 突尼斯
- DZ - 阿尔及利亚
- MA - 摩洛哥
- SD - 苏丹

### 非洲（西非）
- NG - 尼日利亚
- GH - 加纳
- CI - 科特迪瓦
- SN - 塞内加尔
- ML - 马里
- NE - 尼日尔
- BF - 布基纳法索

### 非洲（东非）
- KE - 肯尼亚
- TZ - 坦桑尼亚
- UG - 乌干达
- ET - 埃塞俄比亚
- SO - 索马里
- RW - 卢旺达

### 非洲（南非）
- ZA - 南非
- ZW - 津巴布韦
- MZ - 莫桑比克
- BW - 博茨瓦纳
- NA - 纳米比亚
- ZM - 赞比亚

### 大洋洲
- AU - 澳大利亚
- NZ - 新西兰
- FJ - 斐济
- PG - 巴布亚新几内亚
- NC - 新喀里多尼亚
- PF - 法属波利尼西亚

## 配置技巧

### 1. 使用注释保持清晰
```javascript
const BLOCKED_COUNTRIES = [
  'CN',  // 中国
  'RU',  // 俄罗斯
  // 其他国家...
];
```

### 2. 按地区分组
```javascript
const BLOCKED_COUNTRIES = [
  // 东亚
  'CN', 'JP', 'KR',
  
  // 东南亚
  'TH', 'VN', 'MY',
  
  // 欧洲
  'RU', 'UA',
];
```

### 3. 定期检查和更新
- 根据实际业务需求调整黑名单
- 定期检查被拦截的访问日志
- 根据数据分析优化配置

## 注意事项

⚠️ **国家代码必须使用ISO 3166-1 alpha-2标准**（两个字母的代码）

⚠️ **代码区分大小写**，建议统一使用大写

⚠️ **特殊地区代码**：
- HK - 香港（单独代码）
- MO - 澳门（单独代码）
- TW - 台湾（单独代码）

⚠️ **测试建议**：在正式上线前，使用VPN测试配置是否生效
