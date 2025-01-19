import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  DollarSign,
  Info,
  LogIn,
  HelpCircle,
  Code,
  BookOpen,
  UserCheck,
  Settings,
  Trophy,
  Briefcase,
  Menu, // Added for mobile menu
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import CompanyLogo from '@/assets/logo.jpg';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navigationItems = [
  { title: 'Home', icon: Home, url: '/' },
  { title: 'Coding Practice', icon: Code, url: '/coding' },
  { title: 'Resources', icon: BookOpen, url: '/resources' },
  { title: 'Interview Rounds', icon: UserCheck, url: '/interview-rounds' },
  { title: 'Coding Contest', icon: Trophy, url: '/hackathons' },
  { title: 'Community', icon: Users, url: '/community' },
  { title: 'Jobs', icon: Briefcase, url: '/jobs' },
  { title: 'Pricing', icon: DollarSign, url: '/pricing' },
  { title: 'About', icon: Info, url: '/about' },
  { title: 'FAQ', icon: HelpCircle, url: '/faq' },
  { title: 'Account Settings', icon: Settings, url: '/settings' },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [subQuestions, setSubQuestions] = useState<string[]>([]);
  const [userQuery, setUserQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Predefined questions and sub-questions
  const questions = [
    { title: 'How do I reset my password?', subQuestions: ['Forgotten Password', 'Account Locked', 'Change Password'] },
    { title: 'How do I update my profile?', subQuestions: ['Change Name', 'Change Email', 'Add Profile Picture'] },
    { title: 'How do I apply for a job?', subQuestions: ['Job Requirements', 'Application Process', 'Interview Tips'] },
    { title: 'How can I report a bug?', subQuestions: ['Bug Details', 'Steps to Reproduce', 'Submit Logs'] },
    { title: 'How can I contact support?', subQuestions: ['Email Support', 'Live Chat', 'Phone Support'] },
  ];

  const handleQuestionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedQuestionTitle = event.target.value;
    setSelectedQuestion(selectedQuestionTitle);
    const question = questions.find((q) => q.title === selectedQuestionTitle);
    setSubQuestions(question ? question.subQuestions : []);
  };

  const handleSubmitQuery = () => {
    console.log('User Query Submitted:', userQuery);
  };

  const handleContactSupport = () => {
    navigate('/contact');
  };

  // Mobile menu component
  const MobileMenu = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85%] sm:w-[350px] p-0">
        <div className="flex flex-col h-full bg-white dark:bg-gray-800">
          <div className="flex items-center p-4 space-x-3 border-b">
            <img src={CompanyLogo} alt="Company Logo" className="w-10 h-10 rounded-full" />
            <span className="text-xl font-extrabold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-green-400 to-purple-500">
              Sakshatkar
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4">
              {navigationItems.map((item) => (
                <Button
                  key={item.title}
                  variant="ghost"
                  className="w-full justify-start gap-2 mb-1"
                  onClick={() => {
                    navigate(item.url);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Button>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t">
            <Button
              onClick={() => setShowHelpModal(true)}
              className="w-full flex items-center justify-center gap-2"
              variant="outline"
            >
              <HelpCircle className="w-5 h-5" />
              Need Help?
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      <MobileMenu />
      <Sidebar className="hidden md:flex flex-col h-full bg-white dark:bg-gray-800">
        <SidebarContent className="flex flex-col flex-grow">
          <div className="flex items-center p-4 space-x-3">
            <img src={CompanyLogo} alt="Company Logo" className="w-12 h-12 rounded-full" />
            <span className="text-xl font-extrabold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-green-400 to-purple-500">
              Sakshatkar
            </span>
          </div>

          <hr className="border-gray-300 dark:border-gray-700 my-2" />

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton onClick={() => navigate(item.url)} className="flex items-center space-x-2">
                      <item.icon className="text-gray-500 dark:text-gray-300" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="flex-grow" />

          <div className="p-4">
            <Button
              onClick={() => setShowHelpModal(true)}
              className="w-full flex items-center justify-center space-x-2"
              variant="outline"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Need Help?</span>
            </Button>
          </div>
        </SidebarContent>
      </Sidebar>

      {showHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Need Help?</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHelpModal(false)}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select a Question</label>
                  <select
                    value={selectedQuestion}
                    onChange={handleQuestionChange}
                    className="w-full p-2 border rounded-md bg-transparent"
                  >
                    <option value="">--Select a Question--</option>
                    {questions.map((q) => (
                      <option key={q.title} value={q.title}>
                        {q.title}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedQuestion && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Select Sub-question</label>
                    <select className="w-full p-2 border rounded-md bg-transparent">
                      <option value="">--Select a Sub-question--</option>
                      {subQuestions.map((sub, index) => (
                        <option key={index} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">Your Query</label>
                  <textarea
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    className="w-full p-2 border rounded-md bg-transparent min-h-[100px]"
                    placeholder="Type your query here..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSubmitQuery} className="flex-1">
                    Submit
                  </Button>
                  <Button onClick={handleContactSupport} variant="outline" className="flex-1">
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
