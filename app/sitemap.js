export default function sitemap() {
  const baseUrl = 'https://russian-music-encyclopedia.vercel.app';
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    { url: `${baseUrl}/path/${encodeURIComponent("记谱法与乐理基础")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/path/${encodeURIComponent("节拍节奏与速度")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/path/${encodeURIComponent("音阶调式与和声")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/path/${encodeURIComponent("曲式与体裁")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/path/${encodeURIComponent("力度与演奏法")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/path/${encodeURIComponent("键盘乐器")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/path/${encodeURIComponent("弓弦与拨弦乐器")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/path/${encodeURIComponent("管乐器")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/path/${encodeURIComponent("打击乐器与民族乐器")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/path/${encodeURIComponent("乐器部件与附件")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/path/${encodeURIComponent("人声与声乐")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/path/${encodeURIComponent("音乐教育与理论")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/path/${encodeURIComponent("歌剧术语")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/path/${encodeURIComponent("合唱重奏与乐团")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/path/${encodeURIComponent("作曲家与音乐人物")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/path/${encodeURIComponent("音乐作品")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/path/${encodeURIComponent("舞蹈体裁")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/path/${encodeURIComponent("音乐风格与流派")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/path/${encodeURIComponent("俄罗斯声乐学派与民族音乐")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/path/${encodeURIComponent("音乐机构与演出")}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 }
  ];
}
