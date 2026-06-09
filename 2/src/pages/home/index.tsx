import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-gradient-to-b from-[#4E54C8] to-[#A8C0FF] p-[32px] max-md:p-[20px]">
      <div className="flex items-center justify-between">
        <div className="text-[26px] text-white font-bold max-md:text-[22px]">
          {t("common.appName")}
        </div>
        <button
          onClick={() => navigate("/admin/orders")}
          className="rounded-lg bg-white/20 px-4 py-2 text-sm text-white hover:bg-white/30 transition-colors"
        >
          Admin
        </button>
      </div>
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-8">
        <div className="text-center space-y-3">
          <div className="text-center text-[48px] font-bold text-white max-md:text-[26px]">
            {t("home.hero.title")}
          </div>
          <div className="text-center text-[24px] text-white/80 max-md:text-[16px]">
            {t("home.hero.subtitle")}
          </div>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="rounded-2xl bg-white px-10 py-4 text-lg font-bold text-[#4E54C8] shadow-xl hover:scale-105 transition-transform active:scale-95"
        >
          Get Started →
        </button>
      </div>
    </div>
  );
};

export default Index;
