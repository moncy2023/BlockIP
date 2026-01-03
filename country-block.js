/**
 * Shopify 国家IP拦截系统
 * 版本: 1.0.0
 * 说明: 基于访问者IP地理位置拦截指定国家的访问
 */

(function () {
  'use strict';

  // ==================== 配置区域 ====================

  /**
   * 被拒绝访问的国家列表（使用ISO 3166-1 alpha-2国家代码）
   * 完整国家代码列表请参考: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
   * 
   * 常用国家代码示例:
   * CN - 中国
   * US - 美国
   * RU - 俄罗斯
   * KP - 朝鲜
   * JP - 日本
   * KR - 韩国
   * GB - 英国
   * DE - 德国
   * FR - 法国
   * IN - 印度
   */
  const BLOCKED_COUNTRIES = [
    'CN',  // 中国
    'RU',  // 俄罗斯
    'KP',
    'IN',//印度
    'VN',//越南
    'ID',//印度尼西亚
    'MY',//马来西亚
    'TH',//泰国
    'PH' //菲律宾
    // 在这里添加更多需要拦截的国家代码
  ];

  /**
   * 缓存时长（毫秒）
   * 默认: 3600000 (1小时)
   * 设置为0禁用缓存
   */
  const CACHE_DURATION = 86400000; /*24小时*/

  /**
   * 拦截页面配置
   */
  const BLOCK_PAGE_CONFIG = {
    title: '访问受限 / Access Restricted',
    messageZh: '抱歉，我们暂时无法为您所在的地区提供服务。',
    messageEn: 'Sorry, we are currently unable to provide services to your region.',
    showContactInfo: false,  // 是否显示联系信息
    contactEmail: 'support@example.com',  // 联系邮箱（如果showContactInfo为true）
    backgroundColor: '#f5f5f5',
    textColor: '#333333',
    accentColor: '#e74c3c'
  };

  // API配置
  const API_CONFIG = {
    primary: 'https://ipapi.co/json/',
    fallback: 'https://ip-api.com/json/',
  };

  // ==================== 核心功能 ====================

  /**
   * 从缓存中获取国家代码
   */
  function getCachedCountryCode() {
    try {
      const cached = localStorage.getItem('visitor_country_data');
      if (!cached) return null;

      const data = JSON.parse(cached);
      const now = Date.now();

      // 检查缓存是否过期
      if (CACHE_DURATION > 0 && now - data.timestamp < CACHE_DURATION) {
        console.log('[CountryBlock] 使用缓存的国家代码:', data.countryCode);
        return data.countryCode;
      }

      // 缓存过期，清除
      localStorage.removeItem('visitor_country_data');
      return null;
    } catch (error) {
      console.error('[CountryBlock] 读取缓存失败:', error);
      return null;
    }
  }

  /**
   * 保存国家代码到缓存
   */
  function cacheCountryCode(countryCode) {
    try {
      const data = {
        countryCode: countryCode,
        timestamp: Date.now()
      };
      localStorage.setItem('visitor_country_data', JSON.stringify(data));
      console.log('[CountryBlock] 国家代码已缓存:', countryCode);
    } catch (error) {
      console.error('[CountryBlock] 保存缓存失败:', error);
    }
  }

  /**
   * 使用主API获取访问者国家代码
   */
  async function fetchCountryCodePrimary() {
    const response = await fetch(API_CONFIG.primary, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    if (!data.country_code) {
      throw new Error('API响应中没有国家代码');
    }

    return data.country_code.toUpperCase();
  }

  /**
   * 使用备用API获取访问者国家代码
   */
  async function fetchCountryCodeFallback() {
    const response = await fetch(API_CONFIG.fallback, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`备用API请求失败: ${response.status}`);
    }

    const data = await response.json();
    if (!data.countryCode) {
      throw new Error('备用API响应中没有国家代码');
    }

    return data.countryCode.toUpperCase();
  }

  /**
   * 获取访问者国家代码（带重试机制）
   */
  async function getVisitorCountryCode() {
    // 首先检查缓存
    const cached = getCachedCountryCode();
    if (cached) {
      return cached;
    }

    console.log('[CountryBlock] 正在检测访问者国家...');

    try {
      // 尝试主API
      const countryCode = await fetchCountryCodePrimary();
      console.log('[CountryBlock] 检测到国家代码:', countryCode);
      cacheCountryCode(countryCode);
      return countryCode;
    } catch (primaryError) {
      console.warn('[CountryBlock] 主API失败，尝试备用API...', primaryError.message);

      try {
        // 尝试备用API
        const countryCode = await fetchCountryCodeFallback();
        console.log('[CountryBlock] 备用API检测到国家代码:', countryCode);
        cacheCountryCode(countryCode);
        return countryCode;
      } catch (fallbackError) {
        console.error('[CountryBlock] 所有API均失败:', fallbackError.message);
        throw new Error('无法获取国家信息');
      }
    }
  }

  /**
   * 检查国家是否在黑名单中
   */
  function isCountryBlocked(countryCode) {
    const normalizedCode = countryCode.toUpperCase();
    const normalizedBlocked = BLOCKED_COUNTRIES.map(c => c.toUpperCase());
    return normalizedBlocked.includes(normalizedCode);
  }

  /**
   * 显示拦截页面
   */
  function showBlockPage(countryCode) {
    console.log('[CountryBlock] 拦截访问，国家代码:', countryCode);

    // 创建拦截页面HTML
    const blockPageHTML = `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="robots" content="noindex, nofollow">
        <title>${BLOCK_PAGE_CONFIG.title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: ${BLOCK_PAGE_CONFIG.backgroundColor};
            color: ${BLOCK_PAGE_CONFIG.textColor};
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
          }
          
          .container {
            max-width: 600px;
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          
          .icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            background: ${BLOCK_PAGE_CONFIG.accentColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 40px;
          }
          
          h1 {
            font-size: 28px;
            margin-bottom: 16px;
            color: ${BLOCK_PAGE_CONFIG.textColor};
          }
          
          .message {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 12px;
            color: #666;
          }
          
          .country-info {
            display: inline-block;
            background: #f8f9fa;
            padding: 8px 16px;
            border-radius: 6px;
            margin-top: 20px;
            font-size: 14px;
            color: #666;
          }
          
          .contact-info {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid #e0e0e0;
            font-size: 14px;
            color: #666;
          }
          
          .contact-info a {
            color: ${BLOCK_PAGE_CONFIG.accentColor};
            text-decoration: none;
          }
          
          .contact-info a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">🚫</div>
          <h1>${BLOCK_PAGE_CONFIG.title}</h1>
          <p class="message">${BLOCK_PAGE_CONFIG.messageZh}</p>
          <p class="message">${BLOCK_PAGE_CONFIG.messageEn}</p>
          <div class="country-info">
            检测到的位置 / Detected Location: ${countryCode}
          </div>
          ${BLOCK_PAGE_CONFIG.showContactInfo ? `
            <div class="contact-info">
              如有疑问，请联系 / For inquiries, please contact:<br>
              <a href="mailto:${BLOCK_PAGE_CONFIG.contactEmail}">${BLOCK_PAGE_CONFIG.contactEmail}</a>
            </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;

    // 替换整个页面内容
    document.open();
    document.write(blockPageHTML);
    document.close();

    // 阻止页面的所有后续加载和脚本执行
    if (window.stop) {
      window.stop();
    }
  }

  /**
   * 主执行函数
   */
  async function checkAndBlock() {
    // 如果黑名单为空，不执行任何操作
    if (!BLOCKED_COUNTRIES || BLOCKED_COUNTRIES.length === 0) {
      console.log('[CountryBlock] 黑名单为空，允许所有访问');
      return;
    }

    try {
      const countryCode = await getVisitorCountryCode();

      if (isCountryBlocked(countryCode)) {
        showBlockPage(countryCode);
      } else {
        console.log('[CountryBlock] 允许访问，国家代码:', countryCode);
      }
    } catch (error) {
      console.error('[CountryBlock] 检测失败，默认允许访问:', error.message);
      // 发生错误时默认允许访问，避免误伤
    }
  }

  // ==================== 初始化 ====================

  // 页面加载时立即执行检查
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndBlock);
  } else {
    checkAndBlock();
  }

})();
