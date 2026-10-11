import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const jobs = [
  ["پیمانکار", "peymankar"],
  ["مهندس عمران", "mohandes-omran"],
  ["معمار", "memar"],
  ["نقشه‌بردار", "nagheh-bardar"],
  ["کارگر ساختمانی", "kargar-sakhtemani"],
  ["بنا", "banna"],
  ["گچ‌کار", "gachkar"],
  ["نقاش", "naghash"],
  ["لوله‌کش", "looleh-kesh"],
  ["برق‌کار", "bargh-kar"],
  ["تاسیسات مکانیکی", "tasisat-mekaniki"],
  ["کولر‌ساز", "coolersaz"],
  ["پنجره‌ساز", "panjareh-saz"],
  ["درساز", "darsaz"],
  ["کابینت‌ساز", "kabinet-saz"],
  ["پارکت‌کار", "parket-kar"],
  ["سرامیک‌کار", "saramik-kar"],
  ["عایق‌کار", "ayegh-kar"],
  ["قیرگون‌کار", "qirgun-kar"],
  ["شیشه‌کار", "shisheh-kar"],
  ["آرماتوربند", "armaturband"],
  ["قالب‌بند", "qaleb-band"],
  ["بتن‌ریز", "beton-riz"],
  ["ماشین‌آلات سنگین", "mashin-alat-sangin"],
  ["خاکبرداری", "khak-bardari"],
  ["شعله‌پز", "shooleh-paz"],
  ["جوشکار", "joshkar"],
  ["آهنگر", "ahangar"],
  ["نجار", "najjar"],
  ["آبکار", "abkar"],
  ["چوب‌کار", "choob-kar"],
  ["سنگ‌کار", "sang-kar"],
  ["کاشی‌کار", "kashi-kar"],
  ["عایق‌کار رطوبتی", "ayegh-kar-rutubati"],
  ["سقف کاذوب", "saqf-kazhoob"],
  ["دیوارچین", "divar-chin"],
  ["مترور", "metror"],
  ["فورمان", "foreman"],
  ["انباردار", "anbardar"],
  ["راننده کامیون", "ranande-kamion"],
  ["باربر", "barbar"],
  ["تعمیرکار", "tamirkar"],
  ["نظافتچی ساختمانی", "nazafatchi-sakhtemani"],
  ["محافظ ساختمان", "mohafez-sakhteman"],
  ["مشاور املاک", "moshaver-emlak"],
  ["وکیل ملک", "vakil-molk"],
  ["زمین‌شناس", "zamin-shenas"],
  ["آزمایشگاه فنی", "azmayeshgah-fanni"],
  ["حمل و نقل مصالح", "haml-naql-masaleh"],
] as const;

async function main() {
  for (const [name, slug] of jobs) {
    await prisma.constructionJob.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
  }
  console.log(`Seeded ${jobs.length} construction jobs`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
