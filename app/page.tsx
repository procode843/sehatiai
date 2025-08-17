"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  MessageSquare,
  Mic,
  Shield,
  Zap,
  Users,
  Heart,
  Brain,
  Activity,
  Target,
  Eye,
  Lightbulb,
  Award,
  CheckCircle,
  Star,
  Hospital,
  Database,
  Headphones,
  Play,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    setIsVisible(true);

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    }, observerOptions);

    const scrollElements = document.querySelectorAll(".scroll-reveal");
    scrollElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/");
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <header className="fixed h-[13vh] top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {" "}
              <a href="#">
                <Image
                  src="/images/sehati-logo.png"
                  alt="صحتي"
                  width={50}
                  height={50}
                  className="rounded-lg"
                />
              </a>
              <div>
                <h1 className="text-2xl font-bold text-gradient">صحتي</h1>
                <p className="text-sm text-teal-600">أسرع طريق لصحتك</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#vision"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                الرؤية
              </a>
              <a
                href="#features"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                المميزات
              </a>
              <a
                href="#technology"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                التقنية
              </a>
              {session ? (
                <>
                  <Link href="/search">
                    <Button className="bg-teal-600 hover:bg-teal-700">
                      لوحة التحكم
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => authClient.signOut()}
                  >
                    تسجيل الخروج
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    ابدأ الآن
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      <section className="min-h-[100vh-13vh] pb-12 pt-28 flex items-center justify-center hero-gradient ">
        <div className="container mx-auto px-4 text-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            <Badge className="mb-6 bg-teal-100 text-teal-800 text-lg px-6 py-2">
              منصة ذكية مدعومة بالذكاء الاصطناعي
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              <span className="block">صحتك، مدعومة</span>
              <span className="text-gradient block">بالذكاء الاصطناعي</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto">
              منصة صحتي تجمع بين الخبرة الطبية والتقنيات الذكية لتمنحك رعاية
              صحية متكاملة في أي وقت وأي مكان
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-xl px-12 py-6"
            >
              <MessageSquare className="ml-3 h-6 w-6" />
              ابدأ بوصف الأعراض
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-teal-600 text-teal-600 hover:bg-teal-50 text-xl px-12 py-6 bg-transparent"
            >
              <Mic className="ml-3 h-6 w-6" />
              سجل رسالة صوتية
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gradient mb-2">
                  ٣ ثوانٍ
                </div>
                <div className="text-gray-600">متوسط وقت التوجيه</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gradient mb-2">٩٥٪</div>
                <div className="text-gray-600">دقة التوجيه للتخصص</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gradient mb-2">
                  ٢٤/٧
                </div>
                <div className="text-gray-600">متاح على مدار الساعة</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gradient mb-2">
                  ١٠٠٪
                </div>
                <div className="text-gray-600">آمن ومحمي</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section id="vision" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              رؤيتنا ومهمتنا
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نسعى لتحويل تجربة الرعاية الصحية من خلال الذكاء الاصطناعي
              والابتكار التقني
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-0 shadow-lg hover-lift scroll-reveal">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center ml-4">
                    <Eye className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">رؤيتنا</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  أن نكون المنصة الرائدة في المنطقة لتوجيه المرضى إلى أفضل رعاية
                  صحية مناسبة لحالتهم، مدعومة بأحدث تقنيات الذكاء الاصطناعي
                  والتعلم الآلي.
                </p>
                <div className="flex items-center text-teal-600 font-semibold">
                  <Target className="h-5 w-5 ml-2" />
                  هدفنا: تقليل وقت اتخاذ القرار الطبي إلى أقل من ٣ ثوانٍ
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover-lift scroll-reveal">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center ml-4">
                    <Lightbulb className="h-6 w-6 text-cyan-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">مهمتنا</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  تمكين المرضى من اتخاذ قرارات صحية مدروسة من خلال توفير توجيه
                  ذكي وسريع ودقيق إلى أفضل المستشفيات والأطباء المتخصصين في
                  منطقتهم.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-cyan-600">
                    <CheckCircle className="h-4 w-4 ml-2" />
                    <span>تحليل الأعراض بدقة عالية</span>
                  </div>
                  <div className="flex items-center text-cyan-600">
                    <CheckCircle className="h-4 w-4 ml-2" />
                    <span>توجيه فوري للتخصص المناسب</span>
                  </div>
                  <div className="flex items-center text-cyan-600">
                    <CheckCircle className="h-4 w-4 ml-2" />
                    <span>ربط المرضى بأفضل مقدمي الرعاية</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              لماذا تختار صحتي؟
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              منصة متطورة تجمع بين الذكاء الاصطناعي وخبرة الأطباء لتوفير أفضل
              رعاية صحية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "ذكاء اصطناعي متقدم",
                description:
                  "تحليل دقيق للأعراض باللغة العربية مع فهم اللهجات المحلية المختلفة",
                color: "teal",
              },
              {
                icon: MapPin,
                title: "أقرب المستشفيات",
                description:
                  "عرض المستشفيات والعيادات الأقرب إليك مع معلومات التقييم والمسافة",
                color: "blue",
              },
              {
                icon: Zap,
                title: "استجابة فورية",
                description:
                  "احصل على التوجيه المناسب في أقل من ٣ ثوانٍ مع خيارات الحجز المباشر",
                color: "green",
              },
              {
                icon: Mic,
                title: "تسجيل صوتي ذكي",
                description:
                  "سجل أعراضك بصوتك باللغة العربية مع إمكانية المراجعة والتعديل",
                color: "purple",
              },
              {
                icon: Shield,
                title: "أمان متقدم",
                description:
                  "حماية كاملة لبياناتك الصحية مع التشفير المتقدم وسياسة خصوصية صارمة",
                color: "red",
              },
              {
                icon: Users,
                title: "مراجعة طبية",
                description:
                  "جميع التوصيات تخضع لمراجعة الأطباء المتخصصين لضمان الدقة والأمان",
                color: "orange",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover-lift scroll-reveal"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 bg-${feature.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <feature.icon
                      className={`h-8 w-8 text-${feature.color}-600`}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-20 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl font-bold mb-6">
              التقنية والذكاء الاصطناعي
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              نستخدم أحدث تقنيات الذكاء الاصطناعي والتعلم الآلي لتحليل الأعراض
              وتوجيه المرضى
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="scroll-reveal">
              <h3 className="text-3xl font-bold mb-8 text-gradient">
                معمارية الذكاء الاصطناعي
              </h3>
              <div className="space-y-6">
                {[
                  {
                    icon: Database,
                    title: "معالجة اللغة الطبيعية",
                    description: "تحليل النصوص العربية وفهم السياق الطبي",
                  },
                  {
                    icon: Brain,
                    title: "التعلم الآلي",
                    description: "نماذج متقدمة لتصنيف الأعراض وتحديد التخصص",
                  },
                  {
                    icon: Activity,
                    title: "تقييم الخطورة",
                    description: "تحديد مستوى الإلحاح والخطورة للحالة الصحية",
                  },
                  {
                    icon: MapPin,
                    title: "الترتيب الذكي",
                    description:
                      "ترتيب المستشفيات حسب التخصص والمسافة والتقييم",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-white/10 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-teal-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-0 bg-white/10 scroll-reveal">
              <CardContent className="p-8">
                <h4 className="text-2xl font-bold mb-6 text-center text-white">
                  مؤشرات الأداء
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-400 mb-2">
                      ٩٩.٩٪
                    </div>
                    <div className="text-gray-300">وقت التشغيل</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">
                      ٩٥٪
                    </div>
                    <div className="text-gray-300">دقة التشخيص</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400 mb-2">
                      ٢.٨ث
                    </div>
                    <div className="text-gray-300">متوسط الاستجابة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      ٤.٨/٥
                    </div>
                    <div className="text-gray-300">رضا المستخدمين</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 bg-teal-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              كيف يعمل صحتي؟
            </h2>
            <p className="text-xl text-gray-600">
              رحلة بسيطة من الأعراض إلى أفضل رعاية صحية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "١",
                title: "صف أعراضك",
                description:
                  "اكتب أو سجل أعراضك باللغة العربية. منصتنا تفهم اللهجات المختلفة وتحلل المعلومات بدقة",
                icon: MessageSquare,
                color: "teal",
              },
              {
                number: "٢",
                title: "التحليل الذكي",
                description:
                  "الذكاء الاصطناعي يحلل حالتك ويحدد مستوى الخطورة والتخصص المناسب في ثوانٍ معدودة",
                icon: Brain,
                color: "blue",
              },
              {
                number: "٣",
                title: "أفضل الخيارات",
                description:
                  "احصل على قائمة بأفضل المستشفيات والأطباء القريبين منك مع التقييمات والمسافات",
                icon: Hospital,
                color: "green",
              },
              {
                number: "٤",
                title: "احجز واتصل",
                description:
                  "اختر الخيار الأنسب واحجز موعدك مباشرة أو اتصل بالمستشفى فوراً",
                icon: Phone,
                color: "purple",
              },
            ].map((step, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover-lift scroll-reveal"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-12 h-12 bg-${step.color}-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4`}
                  >
                    {step.number}
                  </div>
                  <div
                    className={`w-16 h-16 bg-${step.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <step.icon className={`h-8 w-8 text-${step.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Notice */}
      <section className="py-16 px-4 bg-red-50 border-y-2 border-red-200">
        <div className="container mx-auto max-w-4xl text-center scroll-reveal">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-red-800 mb-4">تنبيه مهم</h2>
          <p className="text-lg text-red-700 leading-relaxed max-w-3xl mx-auto mb-6">
            صحتي هي أداة مساعدة لاتخاذ القرار وليست بديلاً عن التشخيص الطبي
            المهني. في حالات الطوارئ، اتصل فوراً بخدمات الطوارئ أو توجه إلى أقرب
            مستشفى.
          </p>
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-lg px-8 py-4"
          >
            <Phone className="ml-3 h-5 w-5" />
            اتصال طوارئ: ٩٩٧
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 teal-gradient text-white">
        <div className="container mx-auto max-w-4xl text-center scroll-reveal">
          <h2 className="text-4xl font-bold mb-6">ابدأ رحلتك نحو صحة أفضل</h2>
          <p className="text-xl mb-8 opacity-90">
            انضم إلى آلاف المستخدمين الذين يثقون في صحتي للحصول على أفضل رعاية
            صحية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              size="lg"
              className="bg-white text-teal-600 hover:bg-gray-100 text-lg px-8 py-4"
            >
              <MessageSquare className="ml-3 h-5 w-5" />
              ابدأ الآن مجاناً
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent"
            >
              <Play className="ml-3 h-5 w-5" />
              شاهد العرض التوضيحي
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <Star className="h-6 w-6 mx-auto mb-2" />
              <div className="font-semibold">تقييم ٤.٨/٥</div>
              <div className="text-white/80 text-sm">من المستخدمين</div>
            </div>
            <div className="text-center">
              <Users className="h-6 w-6 mx-auto mb-2" />
              <div className="font-semibold">+١,٠٠٠ مستخدم</div>
              <div className="text-white/80 text-sm">يثقون بنا</div>
            </div>
            <div className="text-center">
              <Award className="h-6 w-6 mx-auto mb-2" />
              <div className="font-semibold">معتمد طبياً</div>
              <div className="text-white/80 text-sm">وآمن تماماً</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Image
                  src="/images/sehati-logo 2.png"
                  alt="صحتي"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <div>
                  <h3 className="text-2xl font-bold text-gradient">صحتي</h3>
                  <p className="text-gray-400">أسرع طريق لصحتك</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                منصة ذكية مدعومة بالذكاء الاصطناعي لتوجيهك إلى أفضل الرعاية
                الصحية المناسبة لحالتك. نجمع بين التقنية المتطورة والخبرة الطبية
                لخدمتك على مدار الساعة.
              </p>
            </div>

            <main>
              {/* باقي الصفحة هنا */}

              {/* الفوتر */}
              <footer className="mt-10 p-6 border-t border-gray-700">
                <h4 className="text-lg font-semibold mb-4 text-gradient">
                  روابط مهمة
                </h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link
                      href="/terms"
                      className="hover:text-white transition-colors"
                    >
                      الشروط والأحكام
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="hover:text-white transition-colors"
                    >
                      سياسة الخصوصية
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/disclaimer"
                      className="hover:text-white transition-colors"
                    >
                      إخلاء المسؤولية
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="hover:text-white transition-colors"
                    >
                      اتصل بنا
                    </Link>
                  </li>
                </ul>
              </footer>
            </main>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-gradient">
                الدعم
              </h4>
              <ul className="space-y-2 text-gray-400">
                {[
                  "مركز المساعدة",
                  "الأسئلة الشائعة",
                  "تقرير مشكلة",
                  "اقتراحات",
                ].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-3 bg-white/5 rounded-lg">
                <div className="flex items-center mb-1">
                  <Headphones className="h-4 w-4 text-teal-400 ml-2" />
                  <span className="font-semibold text-sm">دعم ٢٤/٧</span>
                </div>
                <p className="text-xs text-gray-400">
                  نحن هنا لمساعدتك في أي وقت
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; ٢٠٢٥ صحتي. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
