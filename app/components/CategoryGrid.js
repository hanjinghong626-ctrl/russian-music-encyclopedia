'use client';
import Link from 'next/link';

const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];

// Map category Chinese names to Cyrillic transliterations (for display flavor)
const cyrMap = {
  '作曲家': 'Композиторы',
  '音乐理论': 'Теория музыки',
  '乐器': 'Инструменты',
  '歌剧': 'Опера',
  '芭蕾': 'Балет',
  '体裁': 'Жанры',
  '声乐': 'Вокал',
  '指挥与管弦乐团': 'Дирижирование',
  '民间音乐': 'Народная музыка',
  '音乐教育': 'Образование',
  '音乐学': 'Музыкознание',
  '宗教音乐': 'Духовная музыка',
  '浪漫曲': 'Романс',
  '音阶调式与和声': 'Гармония',
  '记谱法与乐理基础': 'Нотация',
  '旋律与曲式': 'Форма',
  '节奏与节拍': 'Ритм',
  '音程与和弦': 'Интервалы',
  '音乐术语': 'Термины',
  '表演实践': 'Исполнение',
};

export default function CategoryGrid({ groups, categoryCounts }) {
  let globalIdx = 0;

  return (
    <section className="ency-section" id="categories">
      <div className="ency-container">
        <header className="ency-header">
          <span className="ency-eyebrow">Index</span>
          <h2 className="ency-heading">分类索引</h2>
          <div className="ency-heading-rule" />
        </header>

        <ul className="dict-index">
          {groups.map((group, gi) => (
            <li key={gi} className="dict-group">
              <div className="dict-group-label">
                <span className="dict-group-icon">{group.icon}</span>
                {group.group}
              </div>
              <ul className="dict-items">
                {group.categories.map(catName => {
                  const count = categoryCounts[catName] || 0;
                  const cyr = cyrMap[catName] || '';
                  globalIdx++;
                  return (
                    <li key={catName}>
                      <Link href={`/browse?category=${encodeURIComponent(catName)}`} className="dict-item">
                        <span className="dict-item-num">{romanNumerals[globalIdx - 1]}</span>
                        <span className="dict-item-name">{catName}</span>
                        {cyr && <span className="dict-item-name-cyr">{cyr}</span>}
                        <span className="dict-dots" />
                        <span className="dict-item-count">{count}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
