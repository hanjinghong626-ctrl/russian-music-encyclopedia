'use client';
import Link from 'next/link';

const cyrMap = {
  '作曲家': 'Композиторы', '音乐理论': 'Теория музыки', '乐器': 'Инструменты',
  '歌剧': 'Опера', '芭蕾': 'Балет', '体裁': 'Жанры', '声乐': 'Вокал',
  '指挥与管弦乐团': 'Дирижирование', '民间音乐': 'Народная музыка',
  '音乐教育': 'Образование', '音乐学': 'Музыкознание', '宗教音乐': 'Духовная музыка',
  '浪漫曲': 'Романс', '音阶调式与和声': 'Гармония', '记谱法与乐理基础': 'Нотация',
  '旋律与曲式': 'Форма', '节奏与节拍': 'Ритм', '音程与和弦': 'Интервалы',
  '音乐术语': 'Термины', '表演实践': 'Исполнение'
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

        {groups.map((group, gi) => (
          <div key={gi} className="cat-group">
            <div className="cat-group-label">
              <span className="cat-icon">{group.icon}</span>
              {group.group}
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
        ))}
      </div>
    </section>
  );
}
