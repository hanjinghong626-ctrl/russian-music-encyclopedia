'use client';
import Link from 'next/link';

const cyrMap = {
  '音阶调式与和声': 'Лад и гармония',
  '记谱法与乐理基础': 'Нотация',
  '节拍节奏与速度': 'Метр, ритм, темп',
  '曲式与体裁': 'Формы и жанры',
  '人声与声乐': 'Вокал',
  '力度与演奏法': 'Динамика и артикуляция',
  '键盘乐器': 'Клавишные инструменты',
  '弓弦与拨弦乐器': 'Струнные инструменты',
  '管乐器': 'Духовые инструменты',
  '打击乐器与民族乐器': 'Ударные и народные',
  '乐器部件与附件': 'Детали инструментов',
  '歌剧术语': 'Оперные термины',
  '音乐作品': 'Музыкальные произведения',
  '舞蹈体裁': 'Танцевальные жанры',
  '合唱重奏与乐团': 'Ансамбли и оркестры',
  '音乐机构与演出': 'Учреждения',
  '作曲家与音乐人物': 'Композиторы',
  '音乐风格与流派': 'Стили и направления',
  '俄罗斯声乐学派与民族音乐': 'Русская вокальная школа',
  '音乐教育与理论': 'Образование и теория',
};

// Group labels in Russian
const groupCyrMap = {
  '基础理论': 'Теория',
  '声乐': 'Вокал',
  '器乐': 'Инструменты',
  '大型体裁': 'Крупные жанры',
  '合奏与机构': 'Ансамбли',
  '历史与文化': 'История',
  '学术': 'Наука',
};

export default function CategoryGrid({ groups, categoryCounts }) {
  return (
    <section className="section" id="categories">
      <div className="section-inner">
        <header className="section-header">
          <span className="section-eyebrow">Index</span>
          <h2 className="section-title">分类索引</h2>
          <div className="section-rule" />
        </header>

        {groups.map((group, gi) => {
          const groupCyr = groupCyrMap[group.group] || '';
          return (
            <div key={gi} className="cat-group">
              <div className="cat-group-label">
                {group.group}
                {groupCyr && <span style={{ marginLeft: 10, opacity: 0.7 }}>{groupCyr}</span>}
              </div>
              <ul className="cat-list">
                {group.categories.map((catName, ci) => {
                  const count = categoryCounts[catName] || 0;
                  const cyr = cyrMap[catName] || '';
                  return (
                    <li key={catName}>
                      <Link href={`/browse?category=${encodeURIComponent(catName)}`} className="cat-item">
                        <span className="cat-num">{String(ci + 1).padStart(2, '0')}</span>
                        <span className="cat-name">{catName}</span>
                        {cyr && <span className="cat-name-cyr">{cyr}</span>}
                        <span className="cat-dots" />
                        <span className="cat-count">{count}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
