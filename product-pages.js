/* Product work is supplied by the portfolio content file. */
(() => {
  const responsibilities = [
    '产品调研',
    '详情页模块搭建',
    '文案内容',
    '寻找风格参考',
    '沟通各方搭建详情页',
    '整体视觉优化'
  ];

  function render(items, { esc, url, image, achievements }) {
    const projects = Array.isArray(items) ? items : [];
    const metrics = [
      ['ctr', '新网页平均点击率'],
      ['retention', '留存率'],
      ['browseTime', '浏览时间'],
      ['bounce', '跳出率']
    ].filter(([key]) => typeof achievements?.[key] === 'string' && achievements[key].trim());
    const results = metrics.length ? `<div class="product-results reveal"><h3>整体优化成果</h3><dl>${metrics.map(([key, label]) => `<div class="product-result${key === 'browseTime' ? ' product-result-time' : ''}"><dt>${esc(label)}</dt><dd>${esc(achievements[key])}</dd></div>`).join('')}</dl></div>` : '';
    const cards = projects.map((item, index) => {
      const source = url(item.url);
      let host = '';
      try { host = new URL(source).hostname.replace(/^www\./, ''); } catch {}
      const cover = url(item.cover);
      const roles = Array.isArray(item.roles)
        ? item.roles.filter(role => typeof role === 'string' && role.trim()).slice(0, 6)
        : [];
      return `<button type="button" class="product-card reveal" data-kind="products" data-id="${esc(item.id)}" aria-label="查看${esc(item.title)}${item.subtitle ? `：${esc(item.subtitle)}` : ''}详情页项目">
        <div class="product-cover${cover ? ' product-cover-has-image' : ''}">
          <div class="product-browser-strip" aria-hidden="true"><span class="product-browser-dots"><i></i><i></i><i></i></span><span class="product-source">${esc(host || 'PRODUCT PAGE')}</span><span class="product-index">${String(index + 1).padStart(2, '0')}</span></div>
          <div class="product-cover-content">${cover ? image(item.cover, `${item.title}详情页预览`) : `<span class="product-cover-label">PRODUCT EXPERIENCE</span><span class="product-cover-title">${esc(item.title)}</span>`}</div>
          <span class="product-view">查看项目 <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 16 16 4M5 4h11v11" stroke="currentColor" stroke-width="1.25"/></svg></span>
        </div>
        <div class="product-meta"><div><h3>${esc(item.title)}</h3>${item.subtitle ? `<p>${esc(item.subtitle)}</p>` : ''}</div><span class="product-meta-arrow" aria-hidden="true">↗</span></div>
        ${roles.length ? `<ul class="product-role-tags" aria-label="项目职责">${roles.map(role => `<li>${esc(role)}</li>`).join('')}</ul>` : ''}
      </button>`;
    }).join('');

    return `<section class="section product-section" id="products" aria-labelledby="product-section-title">
      <span class="section-number reveal">03 / PRODUCT EXPERIENCE</span>
      <div class="section-title product-heading reveal"><h2 id="product-section-title">产品详情页<em>Product Pages.</em></h2>${projects.length ? `<span class="count">${String(projects.length).padStart(2, '0')} PROJECTS</span>` : ''}</div>
      <div class="product-responsibilities reveal"><p class="product-company">华宝新能<span>我的职责</span></p><ul aria-label="详情页工作职责">${responsibilities.map((role, index) => `<li><span aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>${esc(role)}</li>`).join('')}</ul></div>
      ${results}
      ${projects.length ? `<div class="product-grid">${cards}</div>` : '<p class="product-empty reveal">作品整理中</p>'}
    </section>`;
  }

  window.PortfolioProductPages = { render };
})();
