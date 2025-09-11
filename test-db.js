// test-db.js (直接接続テスト用)

const { PrismaClient } = require('@prisma/client');

// ▼▼▼ ここに、あなたの接続URLを直接貼り付けてください ▼▼▼

// ※ 必ずパスワードを正しいものに置き換えてください
// ※ URL全体をダブルクォーテーション「"」で囲ってください
const DATABASE_URL = "postgresql://postgres:kvVcNyyaxfuz0aiV@db.gttfhmrksunwbjkiaenm.supabase.co:5432/postgres"


// Prisma Clientを、ハードコードしたURLで初期化します
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

async function main() {
  console.log('データベースへの直接接続を試みています...');
  console.log('（.env ファイルは使用していません）');

  try {
    await prisma.$connect();
    console.log('✅ データベースへの接続に成功しました！');

    const postCount = await prisma.post.count();
    console.log(`📝 現在の投稿数: ${postCount}件`);

  } catch (error) {
    console.error('❌ データベース接続中にエラーが発生しました:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
    console.log('テストを終了し、接続を切断しました。');
  }
}

main();
