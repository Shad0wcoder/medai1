import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import TrendingFeatures from "@/components/Trending";
import Chat from "@/components/Chat";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-10">
        <Chat />
      </div>
      <TrendingFeatures />
    </div>
  );
}
