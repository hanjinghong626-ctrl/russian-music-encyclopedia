export async function generateMetadata({ params }) {
  const name = decodeURIComponent(params.name);
  return {
    title: `学习路径：${name}`,
    description: `${name}的系统性学习路径，从入门到高级。`,
    alternates: { canonical: `/path/${encodeURIComponent(name)}` },
  };
}

export default function PathLayout({ children }) {
  return children;
}
