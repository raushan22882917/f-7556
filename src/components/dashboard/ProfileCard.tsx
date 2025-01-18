import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { FaUser, FaEnvelope, FaUniversity, FaInfoCircle, FaFile } from 'react-icons/fa';

interface Profile {
  name?: string;
  email?: string;
  college?: string;
  profile_image_url?: string;
  bio?: string;
  resume_url?: string;
  level?: string;
  open_to_work?: boolean;
}

interface ProfileCardProps {
  profile: Profile | null;
  onProfileUpdate: () => Promise<void>;
}

export function ProfileCard({ profile, onProfileUpdate }: ProfileCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    college: profile?.college || '',
    bio: profile?.bio || '',
    level: profile?.level || '',
  });

  const [openToWork, setOpenToWork] = useState(profile?.open_to_work || false);

  const uploadProfileImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const userId = user?.id;
      const filePath = `${userId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });
      
      await onProfileUpdate();
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const uploadResume = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingResume(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select a file to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      
      if (!['pdf', 'doc', 'docx'].includes(fileExt || '')) {
        throw new Error('Only PDF and DOC files are allowed.');
      }

      const userId = user?.id;
      const filePath = `${userId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ resume_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Resume uploaded successfully",
      });
      
      await onProfileUpdate();
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload resume",
        variant: "destructive",
      });
    } finally {
      setUploadingResume(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (formData.bio && formData.bio.length > 200) {
        toast({
          title: "Error",
          description: "Bio must be less than 200 characters",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          open_to_work: openToWork,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      await onProfileUpdate();
      setEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="md:col-span-1 relative">

      <div className="flex items-center justify-between space-x-4 mt-4 ml-4 mr-4">
        {/* Level Input */}
        <div className="flex flex-col flex-grow">
          <label className="text-sm font-medium text-gray-600"></label>
          <Input
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            placeholder="Your skill level (Beginner, Intermediate, Advanced)"
            className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
          />
        </div>
        
        {/* "Open to Work" Button */}
        <Button
          variant={openToWork ? 'secondary' : 'outline'}
          onClick={() => setOpenToWork(!openToWork)}
          className={`ml-4 flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${openToWork ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'}`}
        >
          {openToWork ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6h9m-9 6h9m-9 6h9M3 6h.01M3 12h.01M3 18h.01"
                />
              </svg>
              <span>Not Open to Work</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Open to Work</span>
            </>
          )}
        </Button>
      </div>




      
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-24 h-24">
              <img
                src={profile?.profile_image_url || '/placeholder.svg'}
                alt="Profile"
                className="rounded-full w-full h-full object-cover"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={uploadProfileImage}
                disabled={uploading}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <Button
              variant="outline"
              disabled={uploading}
              onClick={() => {
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                if (fileInput) fileInput.click();
              }}
            >
              {uploading ? 'Uploading...' : 'Change Photo'}
            </Button>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Your email"
                  type="email"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">College</label>
                <Input
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="Your college"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Bio (max 200 characters)</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                  className="h-24"
                  maxLength={200}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.bio?.length || 0}/200 characters
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Level</label>
                <Input
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  placeholder="Your skill level (Beginner, Intermediate, Advanced)"
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleUpdateProfile}>Save Changes</Button>
                <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium flex items-center space-x-2">
                  <FaUser className="text-gray-500" />
                  <span>Name</span>
                </label>
                <p className="text-lg">{profile?.name || 'Not set'}</p>
                <hr className="my-4 border-t border-gray-300" />
              </div>

              <div>
                <label className="text-sm font-medium flex items-center space-x-2">
                  <FaEnvelope className="text-gray-500" />
                  <span>Email</span>
                </label>
                <p className="text-lg">{profile?.email || user?.email}</p>
                <hr className="my-4 border-t border-gray-300" />
              </div>

              <div>
                <label className="text-sm font-medium flex items-center space-x-2">
                  <FaUniversity className="text-gray-500" />
                  <span>College</span>
                </label>
                <p className="text-lg">{profile?.college || 'Not set'}</p>
                <hr className="my-4 border-t border-gray-300" />
              </div>

              <div>
                <label className="text-sm font-medium flex items-center space-x-2">
                  <FaInfoCircle className="text-gray-500" />
                  <span>Bio</span>
                </label>
                <p className="text-lg">{profile?.bio || 'Not set'}</p>
                <hr className="my-4 border-t border-gray-300" />
              </div>

              <div>
  {/* Resume Label */}
  <label className="text-sm font-medium flex items-center space-x-2">
    <FaFile className="text-gray-500" />
    <span>Resume</span>
  </label>
  
  {/* Resume Status - View Resume or Not Uploaded */}
  <div className="flex items-center space-x-4 mt-2">
    {profile?.resume_url ? (
      <a
        href={profile?.resume_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 text-blue-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3H6.75A2.25 2.25 0 004.5 5.25v13.5A2.25 2.25 0 006.75 21h10.5A2.25 2.25 0 0019.5 18.75V9H15.75zM15 9h4.5m-4.5 0V5.25a.75.75 0 01.75-.75h3.75m-4.5 0H6.75m7.5 6.75H9m0 3h4.5M9 15v3m6-3v3"
          />
        </svg>
      </a>
    ) : (
      <span className="flex items-center space-x-2 text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 12h-15m15 0v3.75A2.25 2.25 0 0117.25 18h-10.5A2.25 2.25 0 014.5 15.75V12m15 0v-3.75A2.25 2.25 0 0017.25 6h-10.5A2.25 2.25 0 004.5 8.25V12"
          />
        </svg>
      </span>
    )}

    {/* Upload Resume Button */}
    <label
      htmlFor="resume-upload"
      className="cursor-pointer text-gray-700 flex items-center space-x-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 text-blue-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 16.5v-6m0 0l3 3m-3-3l-3 3m9-6.75V18a2.25 2.25 0 01-2.25 2.25h-9A2.25 2.25 0 014.5 18V7.5M18 3v4.5M15.75 3H18m0 0h2.25"
        />
      </svg>
    </label>
  </div>

  {/* Resume Upload Input */}
  <div className="mt-2">
    <Input
      id="resume-upload"
      type="file"
      accept=".pdf,.doc,.docx"
      onChange={uploadResume} // Attach your `uploadResume` function here
      disabled={uploadingResume} // Use a state variable to handle loading state
      className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
    {uploadingResume && (
      <p className="text-sm text-gray-500 mt-1">Uploading resume...</p>
    )}
  </div>

  {/* Separator */}
  <hr className="my-4 border-t border-gray-300" />
</div>



              <div className="flex space-x-2">
                <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                {profile?.resume_url ? (
                  <Button
                    variant="outline"
                    onClick={() => window.open(profile.resume_url, '_blank')}
                  >
                    Download Resume
                  </Button>
                ) : (
                  <label className="text-sm text-gray-500">Upload Resume</label>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={uploadResume}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
