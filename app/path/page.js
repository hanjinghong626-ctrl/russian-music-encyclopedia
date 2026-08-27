import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../home.css';

const GROUPS = [
  {
    "group": "基础理论",
    "icon": "🎵",
    "paths": [
      {
        "name": "音阶调式与和声",
        "b": 93,
        "i": 86,
        "a": 79,
        "t": 258,
        "idx": 0
      },
      {
        "name": "记谱法与乐理基础",
        "b": 49,
        "i": 16,
        "a": 3,
        "t": 68,
        "idx": 1
      },
      {
        "name": "节拍节奏与速度",
        "b": 54,
        "i": 33,
        "a": 8,
        "t": 95,
        "idx": 2
      },
      {
        "name": "曲式与体裁",
        "b": 86,
        "i": 81,
        "a": 27,
        "t": 194,
        "idx": 3
      }
    ]
  },
  {
    "group": "声乐",
    "icon": "🎤",
    "paths": [
      {
        "name": "人声与声乐",
        "b": 139,
        "i": 1,
        "a": 4,
        "t": 144,
        "idx": 0
      },
      {
        "name": "力度与演奏法",
        "b": 104,
        "i": 22,
        "a": 7,
        "t": 133,
        "idx": 1
      }
    ]
  },
  {
    "group": "器乐",
    "icon": "🎹",
    "paths": [
      {
        "name": "键盘乐器",
        "b": 16,
        "i": 1,
        "a": 2,
        "t": 19,
        "idx": 0
      },
      {
        "name": "弓弦与拨弦乐器",
        "b": 20,
        "i": 0,
        "a": 3,
        "t": 23,
        "idx": 1
      },
      {
        "name": "管乐器",
        "b": 21,
        "i": 2,
        "a": 7,
        "t": 30,
        "idx": 2
      },
      {
        "name": "打击乐器与民族乐器",
        "b": 19,
        "i": 1,
        "a": 1,
        "t": 21,
        "idx": 3
      },
      {
        "name": "乐器部件与附件",
        "b": 36,
        "i": 2,
        "a": 6,
        "t": 44,
        "idx": 4
      }
    ]
  },
  {
    "group": "大型体裁",
    "icon": "🎭",
    "paths": [
      {
        "name": "歌剧术语",
        "b": 75,
        "i": 1,
        "a": 4,
        "t": 80,
        "idx": 0
      },
      {
        "name": "音乐作品",
        "b": 67,
        "i": 8,
        "a": 22,
        "t": 97,
        "idx": 1
      },
      {
        "name": "舞蹈体裁",
        "b": 39,
        "i": 1,
        "a": 2,
        "t": 42,
        "idx": 2
      }
    ]
  },
  {
    "group": "合奏与机构",
    "icon": "🎻",
    "paths": [
      {
        "name": "合唱重奏与乐团",
        "b": 132,
        "i": 5,
        "a": 8,
        "t": 145,
        "idx": 0
      },
      {
        "name": "音乐机构与演出",
        "b": 19,
        "i": 1,
        "a": 0,
        "t": 20,
        "idx": 1
      }
    ]
  },
  {
    "group": "历史与文化",
    "icon": "📜",
    "paths": [
      {
        "name": "作曲家与音乐人物",
        "b": 0,
        "i": 0,
        "a": 28,
        "t": 28,
        "idx": 0
      },
      {
        "name": "音乐风格与流派",
        "b": 35,
        "i": 0,
        "a": 2,
        "t": 37,
        "idx": 1
      },
      {
        "name": "俄罗斯声乐学派与民族音乐",
        "b": 46,
        "i": 0,
        "a": 0,
        "t": 46,
        "idx": 2
      }
    ]
  },
  {
    "group": "学术",
    "icon": "📚",
    "paths": [
      {
        "name": "音乐教育与理论",
        "b": 123,
        "i": 14,
        "a": 4,
        "t": 141,
        "idx": 0
      }
    ]
  }
];

const PATH_COUNT = 20;
const TOTAL_ENTRIES = 1665;

export default function PathIndexPage() {
  return (
    <>
      <Navbar />
      <main className="pi-page">
        <div className="pi-header">
          <span className="pi-eyebrow">Curriculum</span>
          <h1 className="pi-title">学习路径</h1>
          <p className="pi-cyr">Учебные пути</p>
          <div className="pi-rule" />
          <p className="pi-desc">
            系统化的音乐术语学习路线。每条路径按入门、进阶、高级三个阶段编排，从基础概念到专业术语循序渐进。
          </p>
          <div className="pi-stats">
            <div className="pi-stat">
              <span className="pi-stat-num">{PATH_COUNT}</span>
              <span className="pi-stat-label">学习路径</span>
            </div>
            <div className="pi-stat">
              <span className="pi-stat-num">{TOTAL_ENTRIES}</span>
              <span className="pi-stat-label">词条总量</span>
            </div>
            <div className="pi-stat">
              <span className="pi-stat-num">{GROUPS.length}</span>
              <span className="pi-stat-label">知识领域</span>
            </div>
          </div>
        </div>

        {GROUPS.map(function(g) {
          var groupTotal = g.paths.reduce(function(s, p) { return s + p.t; }, 0);
          return (
            <section key={g.group} className="pi-group">
              <div className="pi-group-header">
                <span className="pi-group-icon">{g.icon}</span>
                <div>
                  <h2 className="pi-group-title">{g.group}</h2>
                  <p className="pi-group-meta">{g.paths.length} 条路径 · {groupTotal} 个词条</p>
                </div>
              </div>
              <div className="pi-group-paths">
                {g.paths.map(function(p) {
                  var bPct = p.t > 0 ? (p.b / p.t * 100) : 0;
                  var iPct = p.t > 0 ? (p.i / p.t * 100) : 0;
                  var aPct = p.t > 0 ? (p.a / p.t * 100) : 0;
                  return (
                    <Link key={p.name} href={"/path/" + encodeURIComponent(p.name)} className="pi-path-card">
                      <div className="pi-path-top">
                        <span className="pi-path-num">{String(p.idx + 1).padStart(2, "0")}</span>
                        <span className="pi-path-name">{p.name}</span>
                      </div>
                      <div className="pi-path-bars">
                        <div className="pi-path-bar-row">
                          <span className="pi-path-bar-label">入门 {p.b}</span>
                          <div className="pi-path-bar-track">
                            <div className="pi-path-bar-fill pi-bar-beginner" style={{ width: bPct + "%" }} />
                          </div>
                        </div>
                        <div className="pi-path-bar-row">
                          <span className="pi-path-bar-label">进阶 {p.i}</span>
                          <div className="pi-path-bar-track">
                            <div className="pi-path-bar-fill pi-bar-intermediate" style={{ width: iPct + "%" }} />
                          </div>
                        </div>
                        <div className="pi-path-bar-row">
                          <span className="pi-path-bar-label">高级 {p.a}</span>
                          <div className="pi-path-bar-track">
                            <div className="pi-path-bar-fill pi-bar-advanced" style={{ width: aPct + "%" }} />
                          </div>
                        </div>
                      </div>
                      <span className="pi-path-total">{p.t} 词条</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </>
  );
}
