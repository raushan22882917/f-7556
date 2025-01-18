import { useState, useEffect } from "react";
import { User, Users, UserCheck, Building, UserCog, Code, Star, Heart, ThumbsUp, BookOpen, FileText } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PracticeModeCard } from "@/components/PracticeModeCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const feedbacks = [
  {
    name: "John Doe",
    message: "Great platform for interview prep!",
    profileImage: "https://randomuser.me/api/portraits/men/10.jpg",
    icon: <Heart className="w-6 h-6 text-gradient" />,
  },
  {
    name: "Jane Smith",
    message: "Helps me a lot with coding interviews!",
    profileImage: "https://randomuser.me/api/portraits/women/10.jpg",
    icon: <Star className="w-6 h-6 text-gradient" />,
  },
  {
    name: "Alex Johnson",
    message: "Wonderful experience, would recommend to others.",
    profileImage: "https://randomuser.me/api/portraits/men/11.jpg",
    icon: <ThumbsUp className="w-6 h-6 text-gradient" />,
  },
  {
    name: "Emily Davis",
    message: "A fantastic resource for interview preparation!",
    profileImage: "https://randomuser.me/api/portraits/women/11.jpg",
    icon: <Heart className="w-6 h-6 text-gradient" />,
  },
  {
    name: "Michael Brown",
    message: "Loved the coding challenges and feedback system!",
    profileImage: "https://randomuser.me/api/portraits/men/12.jpg",
    icon: <Star className="w-6 h-6 text-gradient" />,
  },
  {
    name: "Sarah Lee",
    message: "A great platform for improving coding skills.",
    profileImage: "https://randomuser.me/api/portraits/women/12.jpg",
    icon: <ThumbsUp className="w-6 h-6 text-gradient" />,
  },
];

const practiceModes = [
  {
    title: "Solo Coding",
    description: "Enhance your coding skills independently with comprehensive feedback.",
    icon: User,
    route: "/self-practice",
    image: "https://www.yarddiant.com/images/how-to-practice-coding-every-day.jpg",
  },
  {
    title: "Collaborative Coding",
    description: "Work alongside peers to solve problems and learn collectively.",
    icon: Users,
    route: "/peer-practice",
    image: "https://www.codio.com/hubfs/Blog_EN_PICS/August%202021%20Blog%20-%20Collaborative%20Coding%20in%20Codio.png#keepProtocol",
  },
  {
    title: "Team Coding",
    description: "Join your organization's coding sessions to practice and collaborate.",
    icon: Building,
    route: "/team-coding",
    image: "https://savvytokyo.scdn3.secure.raxcdn.com/app/uploads/2023/10/LINE_ALBUM_1-Monday_231016_4.jpg",
  },
  {
    title: "AI-Assisted DevOps",
    description: "Practice DevOps concepts with the support of AI tools.",
    icon: Code,
    route: "/devops-practice",
    image: "https://www.amplework.com/wp-content/uploads/2022/07/DevOps-with-AI.png",
  },
  {
    title: "HR Round Simulation",
    description: "Prepare for HR interviews by practicing common questions and scenarios.",
    icon: UserCog,
    route: "/hr-interview",
    image: "https://media.gettyimages.com/id/1365436662/photo/successful-partnership.jpg?s=612x612&w=0&k=20&c=B1xspe9Q5WMsLc7Hc9clR8MWUL4bsK1MfUdDNVNR2Xg=",
  },
  {
    title: "Technical Round Simulation",
    description: "Sharpen your technical skills with simulated problem-solving sessions.",
    icon: Code,
    route: "/technical-round",
    image: "",
  },
];

const fetchUserCount = async () => {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error fetching user count:', error);
    throw error;
  }
  
  return count || 0;
};

export default function Index() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentText, setCurrentText] = useState("");
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);
  const textArray = ["Master Every Interview, Land Your Dream Job!"];

  const { data: userCount = 0, isLoading: isLoadingUserCount } = useQuery({
    queryKey: ['userCount'],
    queryFn: fetchUserCount,
  });

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < textArray[0].length) {
        setCurrentText(textArray[0].substring(0, index + 1));
        index++;
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeedbackIndex((prevIndex) => (prevIndex + 3) % feedbacks.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-1 container py-12">
        {!showWelcome && (
          <div className="space-y-12">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
              {practiceModes.map((mode) => (
                <PracticeModeCard key={mode.title} {...mode} />
              ))}
            </div>
          </div>
        )}

        {showWelcome && (
          <>
            <div className="flex flex-col md:flex-row items-center justify-between h-full space-y-6 md:space-y-0">
              <div className="md:w-1/2 text-left space-y-6">
                <h1 className="text-4xl font-bold text-gradient">
                  <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-transparent bg-clip-text">
                    {currentText}
                  </span>
                </h1>
                <p>
                  Welcome to our coding platform, where learning, practicing, and mastering coding skills come together to unlock your full potential! We offer comprehensive interview-related materials, including resources for HR rounds, technical rounds, and coding rounds to help you succeed.
                </p>

                <button
                  onClick={handleGetStarted}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition duration-300"
                >
                  Our Services
                </button>
              </div>
              <div className="relative md:w-1/2 ml-8 bg-transparent">
                <img
                  src="back.png"
                  alt="Welcome"
                  className="w-2/3 max-w-md rounded-lg shadow-lg animate-floating"
                />
              </div>

            </div>

            {/* Trusted Numbers Section */}
            <div className="py-12 bg-gray-100 dark:bg-gray-900 text-center">
              <h2 className="text-3xl font-bold mb-6 text-gradient">
                Why Trust Us?
              </h2>
              <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-12">
                <div className="text-center">
                  <p className="text-4xl font-bold text-purple-600">
                    {isLoadingUserCount ? "..." : `${userCount}+`}
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-400">Trusted Users</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-purple-600">200k+</p>
                  <p className="text-lg text-gray-600 dark:text-gray-400">Questions Solved</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-purple-600">1k+</p>
                  <p className="text-lg text-gray-600 dark:text-gray-400">Resources Available</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-purple-600">95%</p>
                  <p className="text-lg text-gray-600 dark:text-gray-400">User Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Showcase Section */}
            <div className="flex flex-col space-y-12">
              {/* Why Choose Us Section */}
              <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
                <div className="relative md:w-1/2">
                  <img
                    src="back_g.jpeg"
                    alt="Why Choose Us"
                    style={{
                      width: '400px',
                      height: '300px',
                      margin: '100px',
                      animation: 'moveUpDown 2s ease-in-out infinite',
                    }}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <div className="md:w-1/2 text-left space-y-6">
                  <h2 className="text-3xl font-bold text-gradient relative">
                    Why Choose Us?
                    <span className="absolute bottom-[-10px] left-0 w-full border-t-4 border-t-transparent border-b-4 border-b-purple-600"></span>
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Explore our platform to enhance your coding skills with practical exercises, interview preparation resources, and real-world challenges. Our user-focused design ensures a seamless and effective learning experience.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Comprehensive coding tutorials and resources</li>
                    <li>Expert guidance for HR, tech, and coding rounds</li>
                    <li>Interactive practice modes to sharpen your skills</li>
                  </ul>
                </div>
              </div>

              {/* What We Offer Section */}
              <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
                <div className="md:w-1/2 text-left space-y-6">
                  <h2 className="text-3xl font-bold text-gradient relative">
                    What We Offer
                    <span className="absolute bottom-[-10px] left-0 w-full border-t-4 border-t-transparent border-b-4 border-b-purple-600"></span>
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Take advantage of our carefully designed modules and tools that cater to every learning style. We offer the best resources to make coding accessible, fun, and engaging for all skill levels.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Customizable coding environments</li>
                    <li>Step-by-step interview preparation guides</li>
                    <li>Access to exclusive projects and challenges</li>
                  </ul>
                </div>

                <div className="relative md:w-1/2">
                  <img
                    src="oip.jpeg"
                    alt="What We Offer"
                    style={{
                      width: '300px',
                      height: '300px',
                      marginLeft: '150px',
                      animation: 'moveUpDown 2s ease-in-out infinite',
                    }}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>

            <style>
              {`
                @keyframes moveUpDown {
                  0%, 100% {
                    transform: translateY(0);
                  }
                  50% {
                    transform: translateY(-20px);
                  }
                }

                .text-gradient {
                  background: linear-gradient(to right, #6a11cb, #2575fc);
                  -webkit-background-clip: text;
                  color: transparent;
                }
              `}
            </style>
          </>
        )}

        {/* Testimonials Section */}
        {showWelcome && (
          <div className="mt-12 space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              {feedbacks.slice(currentFeedbackIndex, currentFeedbackIndex + 3).map((feedback, index) => (
                <div
                  key={index}
                  className="bg-transparent p-6 rounded-lg shadow-lg flex items-center space-x-4"
                >
                  <img
                    src={feedback.profileImage}
                    alt={feedback.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-sm text-gradient">{feedback.message}</p>
                    <p className="text-lg font-semibold text-gradient">{feedback.name}</p>
                  </div>
                  <div className="ml-auto">{feedback.icon}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #555;
          }

          @keyframes floating {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .animate-floating {
            animation: floating 4s ease-in-out infinite;
          }

          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          .animate-fade-in {
            animation: fadeIn 1s ease-in-out;
          }

          .text-gradient {
            background: linear-gradient(to right, #ff7c7c, #fbbf24, #8b5cf6);
            -webkit-background-clip: text;
            color: transparent;
          }
        `}
      </style>
    </div>
  );
}
