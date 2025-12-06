import { useRef, useEffect, useState } from "react";
import {
  Camera,
  X,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MapPin,
  Compass,
  User,
  Home as HomeIcon,
  PlusSquare,
} from "lucide-react";

const CameraView = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Kamera hatası:", err);
        alert("Kameraya erişilemedi.");
      }
    };
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) onCapture(blob);
      },
      "image/jpeg",
      0.95
    );
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 text-white active:scale-90"
      >
        <X size={30} strokeWidth={2.5} />
      </button>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={captureImage}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1.5 active:scale-95"
        style={{ width: "68px", height: "68px" }}
      >
        <div className="w-full h-full border-[3px] border-black rounded-full"></div>
      </button>
    </div>
  );
};

const Post = ({ post, onLike, onSave, onClick }) => {
  return (
    <div className="bg-white border-b-8 border-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
            <MapPin size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">CoğrafyaKeşif</p>
            <p className="text-xs text-gray-500 truncate">{post.location}</p>
          </div>
        </div>
        <button className="text-gray-700 p-1 active:scale-90">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="6" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="18" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Image */}
      <img
        src={post.imageUrl}
        alt={post.name}
        className="w-full aspect-square object-cover cursor-pointer active:opacity-95"
        onClick={onClick}
      />

      {/* Actions */}
      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => onLike(post.id)}
              className="active:scale-90 transition-transform"
            >
              <Heart
                size={26}
                strokeWidth={2}
                className={
                  post.liked ? "text-red-500 fill-red-500" : "text-gray-900"
                }
              />
            </button>
            <button className="active:scale-90 transition-transform">
              <MessageCircle
                size={26}
                strokeWidth={2}
                className="text-gray-900"
              />
            </button>
            <button className="active:scale-90 transition-transform">
              <Send size={26} strokeWidth={2} className="text-gray-900" />
            </button>
          </div>
          <button
            onClick={() => onSave(post.id)}
            className="active:scale-90 transition-transform"
          >
            <Bookmark
              size={26}
              strokeWidth={2}
              className={
                post.saved ? "text-gray-900 fill-gray-900" : "text-gray-900"
              }
            />
          </button>
        </div>

        {/* Likes */}
        <p className="font-semibold text-sm mb-1.5">
          {post.likes.toLocaleString("tr-TR")} beğeni
        </p>

        {/* Caption */}
        <div className="text-sm mb-1.5">
          <span className="font-semibold">CoğrafyaKeşif</span>{" "}
          <span className="text-gray-900">{post.caption}</span>
        </div>

        {/* Type tag */}
        <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
          #{post.type}
        </span>

        {/* Time */}
        <p className="text-gray-400 text-xs mt-2">{post.timeAgo}</p>
      </div>
    </div>
  );
};

const PostDetail = ({ post, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-black px-3 py-3 flex items-center border-b border-gray-800 z-10">
        <button onClick={onClose} className="text-white active:scale-90">
          <X size={26} strokeWidth={2.5} />
        </button>
        <h2 className="text-white font-semibold ml-3 text-base">Detaylar</h2>
      </div>

      {/* Image */}
      <img
        src={post.imageUrl}
        alt={post.name}
        className="w-full aspect-square object-cover"
      />

      {/* Content */}
      <div className="bg-black text-white p-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
            <MapPin size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm">CoğrafyaKeşif</p>
            <p className="text-xs text-gray-400 truncate">{post.location}</p>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-3">{post.name}</h3>

        <div className="mb-4">
          <span className="inline-block bg-blue-500 text-white text-sm px-3.5 py-1.5 rounded-full font-medium">
            {post.type}
          </span>
        </div>

        <div className="space-y-4 text-gray-300">
          <div>
            <h4 className="text-white font-semibold mb-2 text-sm flex items-center gap-1.5">
              <span>📖</span> Açıklama
            </h4>
            <p className="text-sm leading-relaxed">{post.description}</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2 text-sm flex items-center gap-1.5">
              <span>💡</span> Bilgi Notları
            </h4>
            <div className="space-y-2">
              {post.facts.map((fact, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900 p-2.5 rounded-lg text-sm leading-relaxed"
                >
                  <span className="text-blue-400 mr-1.5">•</span>
                  {fact}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExplorePage = ({ posts, onPostClick }) => {
  return (
    <div className="grid grid-cols-3 gap-0.5 bg-gray-200">
      {posts.map((post, idx) => (
        <div
          key={idx}
          className="aspect-square relative cursor-pointer bg-white active:opacity-90"
          onClick={() => onPostClick(post)}
        >
          <img
            src={post.imageUrl}
            alt={post.name}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

const ProfilePage = ({ savedPosts, onPostClick }) => {
  return (
    <div className="bg-white min-h-screen">
      {/* Profile Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={36} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-base truncate">Benim Profilim</h2>
            <p className="text-gray-600 text-sm">Coğrafya Kaşifi</p>
          </div>
        </div>

        <div className="flex justify-around text-center py-3 border-y border-gray-200">
          <div>
            <p className="font-bold text-base">{savedPosts.length}</p>
            <p className="text-gray-600 text-xs">gönderi</p>
          </div>
          <div>
            <p className="font-bold text-base">245</p>
            <p className="text-gray-600 text-xs">takipçi</p>
          </div>
          <div>
            <p className="font-bold text-base">180</p>
            <p className="text-gray-600 text-xs">takip</p>
          </div>
        </div>
      </div>

      {/* Saved Posts Grid */}
      <div className="grid grid-cols-3 gap-0.5 bg-gray-200">
        {savedPosts.length === 0 ? (
          <div className="col-span-3 text-center py-12 bg-white">
            <Bookmark size={56} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 text-sm font-medium">
              Henüz kayıtlı gönderi yok
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Beğendiğin gönderileri kaydet!
            </p>
          </div>
        ) : (
          savedPosts.map((post, idx) => (
            <div
              key={idx}
              className="aspect-square relative cursor-pointer bg-white active:opacity-90"
              onClick={() => onPostClick(post)}
            >
              <img
                src={post.imageUrl}
                alt={post.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Home = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [showCamera, setShowCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const identifyGeography = async (imageBlob) => {
    setShowCamera(false);
    setIsProcessing(true);

    try {
      // TODO: Backend endpoint'inizi buraya ekleyin
      const formData = new FormData();
      formData.append("image", imageBlob, "capture.jpg");

      // Backend çağrısı
      // const response = await fetch('BACKEND_URL/identify', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newPost = {
        id: Date.now(),
        name: "Dağ Silsilesi",
        type: "Dağ",
        caption:
          "Muhteşem dağ manzarası! Bu dağlar tektonik hareketlerle oluşmuş.",
        description:
          "Dağ silsilesi, birbirine bağlı yüksek tepelerin oluşturduğu doğal yapılardır. Tektonik hareketler ve volkanik faaliyetler sonucu milyonlarca yıl içinde oluşmuştur.",
        facts: [
          "Dünya kara yüzeyinin yaklaşık %24'ünü dağlar kaplar",
          "Everest Dağı, 8.849 metre ile dünyanın en yüksek dağıdır",
          "Dağlar, hava durumunu etkiler ve çeşitli ekosistemlere ev sahipliği yapar",
          "Milyarlarca insan için önemli tatlı su kaynağıdırlar",
        ],
        location: "Türkiye",
        imageUrl: URL.createObjectURL(imageBlob),
        likes: Math.floor(Math.random() * 500) + 100,
        comments: Math.floor(Math.random() * 50) + 5,
        timeAgo: "Az önce",
        liked: false,
        saved: false,
      };

      setPosts((prev) => [newPost, ...prev]);
      setActiveTab("home");
    } catch (error) {
      console.error("Tanımlama başarısız:", error);
      alert("Coğrafi özellik tanımlanamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleSave = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, saved: !post.saved } : post
      )
    );
  };

  const savedPosts = posts.filter((post) => post.saved);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between px-4 py-2.5">
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "cursive" }}
          >
            CoğrafyaKeşif
          </h1>
          <div className="flex items-center gap-4">
            <button className="active:scale-90 transition-transform">
              <Heart size={26} strokeWidth={2} />
            </button>
            <button className="active:scale-90 transition-transform">
              <Send size={26} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pb-14">
        {isProcessing && (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-blue-500 border-t-transparent mb-3"></div>
            <p className="text-gray-700 font-medium text-sm">
              Analiz ediliyor...
            </p>
          </div>
        )}

        {activeTab === "home" && !isProcessing && (
          <div>
            {posts.length === 0 ? (
              <div className="text-center py-16 px-5">
                <Camera
                  size={70}
                  className="text-gray-300 mx-auto mb-4"
                  strokeWidth={1.5}
                />
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Keşfetmeye Başla!
                </h2>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  Etrafındaki coğrafi özellikleri fotoğrafla ve keşfet
                </p>
                <button
                  onClick={() => setShowCamera(true)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold active:scale-95 transition-transform text-sm"
                >
                  İlk Fotoğrafını Çek
                </button>
              </div>
            ) : (
              posts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onSave={handleSave}
                  onClick={() => setSelectedPost(post)}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "explore" && (
          <ExplorePage posts={posts} onPostClick={setSelectedPost} />
        )}

        {activeTab === "profile" && (
          <ProfilePage savedPosts={savedPosts} onPostClick={setSelectedPost} />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-bottom">
        <div className="flex justify-around items-center h-14">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex-1 flex justify-center items-center h-full active:bg-gray-50 ${
              activeTab === "home" ? "text-black" : "text-gray-400"
            }`}
          >
            <HomeIcon size={27} strokeWidth={activeTab === "home" ? 2.5 : 2} />
          </button>
          <button
            onClick={() => setActiveTab("explore")}
            className={`flex-1 flex justify-center items-center h-full active:bg-gray-50 ${
              activeTab === "explore" ? "text-black" : "text-gray-400"
            }`}
          >
            <Compass
              size={27}
              strokeWidth={activeTab === "explore" ? 2.5 : 2}
            />
          </button>
          <button
            onClick={() => setShowCamera(true)}
            className="flex-1 flex justify-center items-center h-full active:bg-gray-50 text-gray-700"
          >
            <PlusSquare size={27} strokeWidth={2} />
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 flex justify-center items-center h-full active:bg-gray-50 ${
              activeTab === "profile" ? "text-black" : "text-gray-400"
            }`}
          >
            <User size={27} strokeWidth={activeTab === "profile" ? 2.5 : 2} />
          </button>
        </div>
      </div>

      {/* Camera View */}
      {showCamera && (
        <CameraView
          onCapture={identifyGeography}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Post Detail */}
      {selectedPost && (
        <PostDetail post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
};

export default Home;
